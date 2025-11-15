"""
Chat endpoints for conversational AI with RAG.
CRITICAL: Stateless chat engine with per-user history management.
"""
from typing import Annotated, List
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.core.dependencies import get_current_user, get_supabase
from app.db.schemas import (
    ChatRequest,
    ChatResponse,
    ConversationCreate,
    ConversationResponse,
    MessageResponse,
)
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    data: ConversationCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: Annotated[Client, Depends(get_supabase)]
):
    """
    Create a new conversation for the current user.

    Args:
        data: Conversation creation data
        current_user: Current authenticated user
        supabase: Supabase client

    Returns:
        Created conversation data
    """
    conversation_id = str(uuid4())

    result = supabase.table("conversations").insert({
        "id": conversation_id,
        "user_id": current_user["user_id"],
        "title": data.title or "New Conversation"
    }).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create conversation"
        )

    conv = result.data[0]
    return ConversationResponse(**conv)


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: Annotated[Client, Depends(get_supabase)],
    limit: int = 50
):
    """
    List all conversations for the current user.

    Args:
        current_user: Current authenticated user
        supabase: Supabase client
        limit: Maximum number of conversations to return

    Returns:
        List of user's conversations
    """
    result = supabase.table("conversations")\
        .select("*")\
        .eq("user_id", current_user["user_id"])\
        .order("updated_at", desc=True)\
        .limit(limit)\
        .execute()

    return [ConversationResponse(**conv) for conv in result.data]


@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: Annotated[Client, Depends(get_supabase)]
):
    """
    Get all messages in a conversation.

    Args:
        conversation_id: Conversation UUID
        current_user: Current authenticated user
        supabase: Supabase client

    Returns:
        List of messages in chronological order
    """
    # Verify user owns this conversation
    conv_result = supabase.table("conversations")\
        .select("id")\
        .eq("id", conversation_id)\
        .eq("user_id", current_user["user_id"])\
        .execute()

    if not conv_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    # Fetch messages
    result = supabase.table("messages")\
        .select("*")\
        .eq("conversation_id", conversation_id)\
        .order("created_at", desc=False)\
        .execute()

    return [MessageResponse(**msg) for msg in result.data]


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: Annotated[Client, Depends(get_supabase)]
):
    """
    Send a message and get AI response with RAG.

    CRITICAL: This endpoint is STATELESS.
    - Fetches chat history from database for each request
    - Passes history explicitly to chat engine
    - Prevents multi-user data leakage

    Args:
        request: Chat message and conversation ID
        current_user: Current authenticated user
        supabase: Supabase client

    Returns:
        User message and AI response
    """
    # Create or validate conversation
    if request.conversation_id:
        # Verify conversation exists and belongs to user
        conv_result = supabase.table("conversations")\
            .select("id")\
            .eq("id", request.conversation_id)\
            .eq("user_id", current_user["user_id"])\
            .execute()

        if not conv_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        conversation_id = request.conversation_id
    else:
        # Create new conversation
        conversation_id = str(uuid4())
        supabase.table("conversations").insert({
            "id": conversation_id,
            "user_id": current_user["user_id"],
            "title": request.message[:50] + "..." if len(request.message) > 50 else request.message
        }).execute()

    # Fetch chat history for this conversation
    history_result = supabase.table("messages")\
        .select("role, content")\
        .eq("conversation_id", conversation_id)\
        .order("created_at", desc=False)\
        .execute()

    chat_history = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in history_result.data
    ]

    # Get AI response using ChatService (stateless)
    chat_service = ChatService(supabase)
    ai_response = await chat_service.get_response(
        message=request.message,
        chat_history=chat_history
    )

    # Save user message
    user_msg_id = str(uuid4())
    user_msg_result = supabase.table("messages").insert({
        "id": user_msg_id,
        "conversation_id": conversation_id,
        "role": "user",
        "content": request.message
    }).execute()

    # Save assistant message
    assistant_msg_id = str(uuid4())
    assistant_msg_result = supabase.table("messages").insert({
        "id": assistant_msg_id,
        "conversation_id": conversation_id,
        "role": "assistant",
        "content": ai_response
    }).execute()

    # Update conversation timestamp
    supabase.table("conversations")\
        .update({"updated_at": "now()"})\
        .eq("id", conversation_id)\
        .execute()

    return ChatResponse(
        conversation_id=conversation_id,
        user_message=MessageResponse(**user_msg_result.data[0]),
        assistant_message=MessageResponse(**assistant_msg_result.data[0])
    )

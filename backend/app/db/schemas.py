"""
Pydantic schemas for request/response validation.
These mirror the database tables but are used for API validation.
"""
from datetime import datetime
from typing import List, Literal
from pydantic import BaseModel, EmailStr, Field


# ==================== Auth Schemas ====================

class UserSignup(BaseModel):
    """Request schema for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """Request schema for user login."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response schema for authentication tokens."""
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    """Response schema for user data."""
    id: str
    email: str
    created_at: datetime


# ==================== Chat Schemas ====================

class ConversationCreate(BaseModel):
    """Request schema for creating a new conversation."""
    title: str | None = Field(default=None, max_length=255)


class ConversationResponse(BaseModel):
    """Response schema for conversation data."""
    id: str
    user_id: str
    title: str | None
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    """Request schema for creating/sending a chat message."""
    conversation_id: str
    content: str = Field(..., min_length=1)


class MessageResponse(BaseModel):
    """Response schema for a chat message."""
    id: str
    conversation_id: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime


class ChatRequest(BaseModel):
    """Request schema for the chat endpoint."""
    conversation_id: str | None = None
    message: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    """Response schema for the chat endpoint."""
    conversation_id: str
    user_message: MessageResponse
    assistant_message: MessageResponse


# ==================== Insight Schemas ====================

class InsightCreate(BaseModel):
    """Request schema for creating an insight."""
    source_url: str
    aspect: str
    sentiment: Literal["positive", "negative", "neutral"]
    text: str
    metadata: dict | None = None


class InsightResponse(BaseModel):
    """Response schema for an insight."""
    id: str
    source_url: str
    aspect: str
    sentiment: Literal["positive", "negative", "neutral"]
    text: str
    metadata: dict | None
    created_at: datetime


# ==================== Task Schemas ====================

class ScrapeRequest(BaseModel):
    """Request schema for triggering a Reddit scrape."""
    reddit_url: str = Field(..., description="URL to Reddit post or subreddit")
    max_comments: int = Field(default=1000, ge=1, le=10000)


class ScrapeTaskResponse(BaseModel):
    """Response schema for scrape task initiation."""
    task_id: str
    status: str
    message: str


class TaskStatusResponse(BaseModel):
    """Response schema for task status check."""
    task_id: str
    status: Literal["pending", "started", "success", "failure"]
    result: dict | None = None
    error: str | None = None

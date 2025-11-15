"""
Chat service implementing RAG with LlamaIndex.
CRITICAL: Stateless service - chat history passed explicitly.
"""
from typing import List, Dict
from llama_index.core import VectorStoreIndex
from llama_index.core.memory import ChatMemoryBuffer
try:
    from llama_index.vector_stores.supabase import SupabaseVectorStore
except ImportError:
    from llama_index_vector_stores_supabase import SupabaseVectorStore
try:
    from llama_index.embeddings.openai import OpenAIEmbedding
except ImportError:
    from llama_index_embeddings_openai import OpenAIEmbedding
try:
    from llama_index.llms.openai import OpenAI
except ImportError:
    from llama_index_llms_openai import OpenAI
from supabase import Client

from app.core.config import settings


class ChatService:
    """
    Stateless chat service with RAG capabilities.

    Each request:
    1. Receives chat history explicitly
    2. Queries vector store for relevant insights
    3. Generates response with context
    4. Returns response (no state stored)
    """

    def __init__(self, supabase_client: Client):
        """
        Initialize chat service with Supabase client.

        Args:
            supabase_client: Supabase client for vector store access
        """
        self.supabase = supabase_client
        self._vector_store = None
        self._index = None
        self._llm = None
        self._embed_model = None

    def _get_vector_store(self) -> SupabaseVectorStore:
        """Lazy-load vector store."""
        if self._vector_store is None:
            self._vector_store = SupabaseVectorStore(
                postgres_connection_string=settings.DATABASE_URL,
                collection_name="insights",
                dimension=settings.VECTOR_DIMENSION,
            )
        return self._vector_store

    def _get_index(self) -> VectorStoreIndex:
        """Lazy-load vector store index."""
        if self._index is None:
            vector_store = self._get_vector_store()
            self._index = VectorStoreIndex.from_vector_store(
                vector_store=vector_store,
                embed_model=self._get_embed_model()
            )
        return self._index

    def _get_llm(self) -> OpenAI:
        """Lazy-load LLM."""
        if self._llm is None:
            self._llm = OpenAI(
                model=settings.DEFAULT_LLM_MODEL,
                api_key=settings.OPENAI_API_KEY,
                temperature=0.7
            )
        return self._llm

    def _get_embed_model(self) -> OpenAIEmbedding:
        """Lazy-load embedding model."""
        if self._embed_model is None:
            self._embed_model = OpenAIEmbedding(
                model=settings.EMBEDDING_MODEL,
                api_key=settings.OPENAI_API_KEY
            )
        return self._embed_model

    async def get_response(
        self,
        message: str,
        chat_history: List[Dict[str, str]]
    ) -> str:
        """
        Generate AI response using RAG.

        Args:
            message: User's current message
            chat_history: List of previous messages [{"role": "user/assistant", "content": "..."}]

        Returns:
            AI-generated response string
        """
        # Get index and query engine
        index = self._get_index()
        llm = self._get_llm()

        # Create chat memory from history
        memory = ChatMemoryBuffer.from_defaults(
            token_limit=4000,
            chat_history=self._convert_history_format(chat_history)
        )

        # Create chat engine with retrieval
        chat_engine = index.as_chat_engine(
            chat_mode="condense_plus_context",
            memory=memory,
            llm=llm,
            verbose=True,
            system_prompt=(
                "You are JudgmentAI, an expert assistant that analyzes Reddit discussions. "
                "Use the provided context from Reddit insights to answer questions accurately. "
                "If asked about sentiment or opinions, cite specific aspects and percentages. "
                "If the context doesn't contain relevant information, say so honestly."
            )
        )

        # Get response
        response = await chat_engine.achat(message)

        return str(response)

    def _convert_history_format(self, history: List[Dict[str, str]]) -> List:
        """
        Convert database chat history to LlamaIndex format.

        Args:
            history: List of message dicts with 'role' and 'content'

        Returns:
            LlamaIndex-compatible chat history
        """
        from llama_index.core.llms import ChatMessage, MessageRole

        converted = []
        for msg in history:
            role = MessageRole.USER if msg["role"] == "user" else MessageRole.ASSISTANT
            converted.append(ChatMessage(role=role, content=msg["content"]))

        return converted

    async def search_insights(
        self,
        query: str,
        top_k: int = 5
    ) -> List[Dict]:
        """
        Search for relevant insights without generating a response.

        Args:
            query: Search query
            top_k: Number of results to return

        Returns:
            List of matching insights
        """
        index = self._get_index()
        retriever = index.as_retriever(similarity_top_k=top_k)

        results = await retriever.aretrieve(query)

        return [
            {
                "text": node.node.text,
                "score": node.score,
                "metadata": node.node.metadata
            }
            for node in results
        ]

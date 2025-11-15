"""
Supabase client initialization with async support.
"""
from supabase import create_client, Client
from app.core.config import settings

# Global Supabase client instance
_supabase_client: Client | None = None


async def get_supabase_client() -> Client:
    """
    Get or create the Supabase client instance.

    Returns:
        Configured Supabase client

    Note:
        This uses the service_role key for admin access.
        For user-scoped operations, use the user's JWT token instead.
    """
    global _supabase_client

    if _supabase_client is None:
        _supabase_client = create_client(
            supabase_url=settings.SUPABASE_URL,
            supabase_key=settings.SUPABASE_SERVICE_ROLE_KEY
        )

    return _supabase_client


async def close_supabase_client():
    """Close the Supabase client connection (for cleanup on shutdown)."""
    global _supabase_client
    # Supabase client doesn't require explicit cleanup
    _supabase_client = None

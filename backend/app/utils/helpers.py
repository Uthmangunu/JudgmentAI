"""
Utility functions and helpers.
"""
from typing import List, Dict
from datetime import datetime, timezone


def get_utc_now() -> datetime:
    """Get current UTC timestamp."""
    return datetime.now(timezone.utc)


def chunk_list(items: List, chunk_size: int) -> List[List]:
    """
    Split a list into chunks of specified size.

    Args:
        items: List to chunk
        chunk_size: Size of each chunk

    Returns:
        List of chunked lists
    """
    return [items[i:i + chunk_size] for i in range(0, len(items), chunk_size)]


def truncate_text(text: str, max_length: int = 500) -> str:
    """
    Truncate text to maximum length.

    Args:
        text: Text to truncate
        max_length: Maximum length

    Returns:
        Truncated text with ellipsis if needed
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."


def sanitize_reddit_url(url: str) -> str:
    """
    Normalize Reddit URL format.

    Args:
        url: Reddit URL

    Returns:
        Normalized URL
    """
    # Remove tracking parameters
    if "?" in url:
        url = url.split("?")[0]

    # Ensure HTTPS
    if url.startswith("http://"):
        url = url.replace("http://", "https://")

    return url

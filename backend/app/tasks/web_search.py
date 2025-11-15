"""
Celery task for web search augmentation using Google Custom Search API.
"""
from typing import List, Dict

from googleapiclient.discovery import build

from app.tasks.celery_app import celery_app
from app.core.config import settings


@celery_app.task(name="search_web")
def search_web(query: str, num_results: int = 5) -> List[Dict[str, str]]:
    """
    Perform web search using Google Custom Search API.

    Args:
        query: Search query
        num_results: Number of results to return

    Returns:
        List of search results with title, link, and snippet
    """
    if not settings.GOOGLE_API_KEY or not settings.GOOGLE_SEARCH_ENGINE_ID:
        return [{
            "title": "Web Search Unavailable",
            "link": "",
            "snippet": "Google Custom Search API credentials not configured"
        }]

    try:
        # Build Google Custom Search service
        service = build(
            "customsearch",
            "v1",
            developerKey=settings.GOOGLE_API_KEY
        )

        # Execute search
        result = service.cse().list(
            q=query,
            cx=settings.GOOGLE_SEARCH_ENGINE_ID,
            num=num_results
        ).execute()

        # Parse results
        search_results = []
        if "items" in result:
            for item in result["items"]:
                search_results.append({
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", "")
                })

        return search_results

    except Exception as e:
        return [{
            "title": "Search Error",
            "link": "",
            "snippet": f"Error performing search: {str(e)}"
        }]


@celery_app.task(name="augment_insights_with_search")
def augment_insights_with_search(
    aspect: str,
    reddit_url: str,
    num_sources: int = 3
) -> Dict:
    """
    Augment Reddit insights with external web sources.

    Args:
        aspect: The aspect being discussed (e.g., "battery life")
        reddit_url: Original Reddit discussion URL
        num_sources: Number of web sources to fetch

    Returns:
        Dict with aspect, Reddit context, and web sources
    """
    # Construct search query
    query = f"{aspect} review analysis"

    # Perform web search
    search_results = search_web(query, num_sources)

    return {
        "aspect": aspect,
        "reddit_source": reddit_url,
        "web_sources": search_results,
        "augmented_at": "now()"
    }

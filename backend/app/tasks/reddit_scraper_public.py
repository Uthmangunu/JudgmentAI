"""
Reddit scraper using public JSON endpoints (no API key required).
This approach allows immediate development without waiting for Reddit API approval.
"""
import asyncio
import httpx
from typing import List, Dict
from datetime import datetime


class PublicJSONScraper:
    """Scrapes Reddit using publicly available JSON endpoints."""

    def __init__(self):
        self.headers = {
            'User-Agent': 'JudgmentAI/1.0 (Educational Research Project; Open Source)'
        }

    async def scrape_thread(self, reddit_url: str, max_comments: int = 500) -> Dict:
        """
        Scrape a Reddit thread using public JSON endpoint.

        Args:
            reddit_url: Full Reddit post URL
            max_comments: Maximum number of comments to extract

        Returns:
            Dict with post data and comments
        """
        # Convert URL to JSON endpoint
        json_url = self._to_json_url(reddit_url)

        # Fetch JSON data
        data = await self._fetch_json(json_url)

        # Parse post metadata
        post_data = self._extract_post_data(data)

        # Extract all comments
        comments = self._extract_all_comments(data)

        # Limit to max_comments
        comments = comments[:max_comments]

        return {
            'url': reddit_url,
            'title': post_data['title'],
            'subreddit': post_data['subreddit'],
            'author': post_data['author'],
            'created_utc': post_data['created_utc'],
            'num_comments': post_data['num_comments'],
            'comments': comments,
            'scraped_at': datetime.utcnow().isoformat()
        }

    def _to_json_url(self, url: str) -> str:
        """Convert Reddit URL to JSON endpoint."""
        # Remove trailing slash
        url = url.rstrip('/')

        # Add .json if not already present
        if not url.endswith('.json'):
            url += '.json'

        return url

    async def _fetch_json(self, url: str, retry_count: int = 3) -> dict:
        """
        Fetch JSON from Reddit with retry logic.

        Args:
            url: JSON endpoint URL
            retry_count: Number of retries on failure

        Returns:
            Parsed JSON data
        """
        async with httpx.AsyncClient() as client:
            for attempt in range(retry_count):
                try:
                    response = await client.get(
                        url,
                        headers=self.headers,
                        timeout=30.0,
                        follow_redirects=True
                    )
                    response.raise_for_status()
                    return response.json()

                except httpx.HTTPStatusError as e:
                    if e.response.status_code == 429:
                        # Rate limited - wait and retry
                        wait_time = 60 * (attempt + 1)
                        print(f"Rate limited. Waiting {wait_time} seconds...")
                        await asyncio.sleep(wait_time)
                        continue
                    raise

                except httpx.RequestError as e:
                    if attempt == retry_count - 1:
                        raise
                    await asyncio.sleep(5 * (attempt + 1))

        raise Exception("Failed to fetch Reddit data after retries")

    def _extract_post_data(self, data: list) -> Dict:
        """Extract post metadata from JSON response."""
        try:
            post = data[0]['data']['children'][0]['data']
            return {
                'title': post.get('title', ''),
                'subreddit': post.get('subreddit', ''),
                'author': post.get('author', '[deleted]'),
                'created_utc': post.get('created_utc', 0),
                'num_comments': post.get('num_comments', 0),
                'score': post.get('score', 0),
                'selftext': post.get('selftext', '')
            }
        except (KeyError, IndexError):
            return {
                'title': 'Unknown',
                'subreddit': 'unknown',
                'author': 'unknown',
                'created_utc': 0,
                'num_comments': 0,
                'score': 0,
                'selftext': ''
            }

    def _extract_all_comments(self, data: list) -> List[Dict]:
        """
        Recursively extract all comments from JSON response.

        Args:
            data: JSON response from Reddit

        Returns:
            List of comment dictionaries
        """
        comments = []

        if len(data) < 2:
            return comments

        # Comments are in the second element
        comment_listing = data[1]['data']['children']

        self._parse_comments_recursive(comment_listing, comments)

        return comments

    def _parse_comments_recursive(self, items: list, comments: List[Dict]):
        """
        Recursively parse comments and their replies.

        Args:
            items: List of comment items
            comments: List to append parsed comments to
        """
        for item in items:
            # Skip "more comments" placeholders
            if item['kind'] != 't1':
                continue

            comment_data = item['data']
            body = comment_data.get('body', '')

            # Skip deleted/removed comments
            if body in ['[deleted]', '[removed]', '']:
                continue

            # Add comment
            comments.append({
                'text': body,
                'author': comment_data.get('author', '[deleted]'),
                'score': comment_data.get('score', 0),
                'created_utc': comment_data.get('created_utc', 0),
                'id': comment_data.get('id', '')
            })

            # Process replies recursively
            replies = comment_data.get('replies', '')

            if isinstance(replies, dict):
                reply_children = replies['data']['children']
                self._parse_comments_recursive(reply_children, comments)


# Celery task wrapper
from app.tasks.celery_app import celery_app
from app.services.analysis_service import AnalysisService
from app.db.supabase_client import get_supabase_client
from uuid import uuid4


@celery_app.task(bind=True, name="scrape_and_analyze_reddit_public")
def scrape_and_analyze_reddit_public(
    self,
    reddit_url: str,
    max_comments: int,
    user_id: str,
    job_id: str
) -> Dict:
    """
    Scrape Reddit using public JSON and perform ABSA analysis.

    Args:
        self: Celery task instance
        reddit_url: Reddit post URL
        max_comments: Maximum comments to analyze
        user_id: User who initiated the task
        job_id: Database job ID

    Returns:
        Dict with task results
    """
    import asyncio

    try:
        # Update job status
        supabase = asyncio.run(get_supabase_client())
        supabase.table("scrape_jobs").update({
            "status": "started"
        }).eq("id", job_id).execute()

        # Scrape Reddit
        self.update_state(state="PROGRESS", meta={"stage": "scraping", "progress": 0})

        scraper = PublicJSONScraper()
        data = asyncio.run(scraper.scrape_thread(reddit_url, max_comments))

        comments = [c['text'] for c in data['comments']]
        total_comments = len(comments)

        # Update job with comment count
        supabase.table("scrape_jobs").update({
            "total_comments": total_comments
        }).eq("id", job_id).execute()

        # Analyze with ABSA
        self.update_state(state="PROGRESS", meta={"stage": "analyzing", "progress": 0})

        analysis_service = AnalysisService()
        all_insights = []

        for idx, comment_text in enumerate(comments):
            insights = analysis_service.analyze_comment(comment_text)

            for insight in insights:
                insight["source_url"] = reddit_url
                insight["metadata"] = {
                    "submission_title": data['title'],
                    "subreddit": data['subreddit']
                }

            all_insights.extend(insights)

            # Update progress every 10 comments
            if (idx + 1) % 10 == 0:
                progress = int((idx + 1) / total_comments * 100)
                self.update_state(
                    state="PROGRESS",
                    meta={"stage": "analyzing", "progress": progress}
                )
                supabase.table("scrape_jobs").update({
                    "processed_comments": idx + 1
                }).eq("id", job_id).execute()

        # Store insights
        self.update_state(state="PROGRESS", meta={"stage": "storing", "progress": 0})

        from llama_index.embeddings.openai import OpenAIEmbedding
        from app.core.config import settings

        embed_model = OpenAIEmbedding(
            model=settings.EMBEDDING_MODEL,
            api_key=settings.OPENAI_API_KEY
        )

        # Store insights in vector database
        insights_count = 0
        batch_size = 100

        for i in range(0, len(all_insights), batch_size):
            batch = all_insights[i:i + batch_size]
            records = []

            for insight in batch:
                embedding_text = f"{insight['aspect']}: {insight['text']}"
                embedding = embed_model.get_text_embedding(embedding_text)

                records.append({
                    "id": str(uuid4()),
                    "source_url": insight["source_url"],
                    "aspect": insight["aspect"],
                    "sentiment": insight["sentiment"],
                    "text": insight["text"],
                    "embedding": embedding,
                    "metadata": insight.get("metadata", {})
                })

            result = supabase.table("insights").insert(records).execute()
            insights_count += len(result.data) if result.data else 0

        # Mark job complete
        supabase.table("scrape_jobs").update({
            "status": "completed",
            "processed_comments": total_comments,
            "completed_at": "now()"
        }).eq("id", job_id).execute()

        return {
            "status": "success",
            "comments_scraped": total_comments,
            "insights_count": insights_count,
            "job_id": job_id
        }

    except Exception as e:
        # Mark job as failed
        supabase = asyncio.run(get_supabase_client())
        supabase.table("scrape_jobs").update({
            "status": "failed",
            "error": str(e)
        }).eq("id", job_id).execute()
        raise

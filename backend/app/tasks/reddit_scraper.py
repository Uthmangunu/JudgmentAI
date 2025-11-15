"""
Celery task for scraping Reddit and performing ABSA analysis.
Runs in background worker to avoid blocking the API server.
"""
import re
from typing import List, Dict
from uuid import uuid4

import praw
from llama_index.core import Document
from llama_index.embeddings.openai import OpenAIEmbedding

from app.tasks.celery_app import celery_app
from app.core.config import settings
from app.services.analysis_service import AnalysisService
from app.db.supabase_client import get_supabase_client


@celery_app.task(bind=True, name="scrape_and_analyze_reddit")
def scrape_and_analyze_reddit(
    self,
    reddit_url: str,
    max_comments: int,
    user_id: str,
    job_id: str
) -> Dict:
    """
    Scrape Reddit post/comments and perform ABSA analysis.

    Args:
        self: Celery task instance (for progress updates)
        reddit_url: URL to Reddit post
        max_comments: Maximum comments to scrape
        user_id: User who initiated the task
        job_id: Database job ID

    Returns:
        Dict with task results (comment count, insights count, etc.)
    """
    try:
        # Update job status
        _update_job_status(job_id, "started")

        # Initialize Reddit client
        reddit = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            user_agent=settings.REDDIT_USER_AGENT
        )

        # Extract submission ID from URL
        submission_id = _extract_submission_id(reddit_url)
        submission = reddit.submission(id=submission_id)

        # Scrape comments
        self.update_state(state="PROGRESS", meta={"stage": "scraping", "progress": 0})
        comments = _scrape_comments(submission, max_comments)

        total_comments = len(comments)
        _update_job_status(job_id, "processing", total_comments=total_comments)

        # Analyze comments with ABSA
        self.update_state(state="PROGRESS", meta={"stage": "analyzing", "progress": 0})
        analysis_service = AnalysisService()
        all_insights = []

        for idx, comment_text in enumerate(comments):
            # Analyze individual comment
            insights = analysis_service.analyze_comment(comment_text)

            # Add metadata
            for insight in insights:
                insight["source_url"] = reddit_url
                insight["metadata"] = {
                    "submission_title": submission.title,
                    "submission_id": submission_id,
                    "comment_index": idx
                }

            all_insights.extend(insights)

            # Update progress every 10 comments
            if (idx + 1) % 10 == 0:
                progress = int((idx + 1) / total_comments * 100)
                self.update_state(
                    state="PROGRESS",
                    meta={"stage": "analyzing", "progress": progress}
                )
                _update_job_status(
                    job_id,
                    "processing",
                    processed_comments=idx + 1
                )

        # Store insights in vector database
        self.update_state(state="PROGRESS", meta={"stage": "storing", "progress": 0})
        insights_count = _store_insights(all_insights)

        # Mark job complete
        _update_job_status(
            job_id,
            "completed",
            processed_comments=total_comments,
            insights_count=insights_count
        )

        return {
            "status": "success",
            "comments_scraped": total_comments,
            "insights_count": insights_count,
            "job_id": job_id
        }

    except Exception as e:
        # Mark job as failed
        _update_job_status(job_id, "failed", error=str(e))
        raise


def _extract_submission_id(url: str) -> str:
    """Extract Reddit submission ID from URL."""
    patterns = [
        r"reddit\.com/r/\w+/comments/(\w+)",
        r"redd\.it/(\w+)"
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    raise ValueError(f"Could not extract submission ID from URL: {url}")


def _scrape_comments(submission, max_comments: int) -> List[str]:
    """
    Scrape comments from submission.

    Note: This is the MVP version using PRAW's default behavior.
    For production, implement the recursive morechildren API approach.
    """
    # Replace MoreComments objects to load all comments
    submission.comments.replace_more(limit=None)

    comments = []
    for comment in submission.comments.list()[:max_comments]:
        if hasattr(comment, 'body') and comment.body:
            # Filter out deleted/removed comments
            if comment.body not in ["[deleted]", "[removed]"]:
                comments.append(comment.body)

    return comments


def _store_insights(insights: List[Dict]) -> int:
    """
    Store insights in Supabase with embeddings.

    Args:
        insights: List of insight dicts

    Returns:
        Number of insights stored
    """
    if not insights:
        return 0

    # Get Supabase client synchronously (Celery tasks are not async)
    import asyncio
    supabase = asyncio.run(get_supabase_client())

    # Initialize embedding model
    embed_model = OpenAIEmbedding(
        model=settings.EMBEDDING_MODEL,
        api_key=settings.OPENAI_API_KEY
    )

    # Prepare records with embeddings
    records = []
    for insight in insights:
        # Generate embedding for the insight text
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

    # Batch insert (Supabase supports up to 1000 per batch)
    batch_size = 500
    stored_count = 0

    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        result = supabase.table("insights").insert(batch).execute()
        stored_count += len(result.data) if result.data else 0

    return stored_count


def _update_job_status(
    job_id: str,
    status: str,
    total_comments: int = None,
    processed_comments: int = None,
    insights_count: int = None,
    error: str = None
):
    """Update scrape job status in database."""
    import asyncio
    supabase = asyncio.run(get_supabase_client())

    update_data = {"status": status}

    if total_comments is not None:
        update_data["total_comments"] = total_comments
    if processed_comments is not None:
        update_data["processed_comments"] = processed_comments
    if error is not None:
        update_data["error"] = error
    if status == "completed":
        update_data["completed_at"] = "now()"

    supabase.table("scrape_jobs").update(update_data).eq("id", job_id).execute()

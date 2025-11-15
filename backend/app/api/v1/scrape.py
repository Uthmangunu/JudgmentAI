"""
Endpoints for triggering Reddit scraping and NLP analysis tasks.
"""
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.core.dependencies import get_current_user, get_supabase
from app.db.schemas import ScrapeRequest, ScrapeTaskResponse, TaskStatusResponse
from app.tasks.reddit_scraper_public import scrape_and_analyze_reddit_public

router = APIRouter(prefix="/scrape", tags=["Scraping"])


@router.post("", response_model=ScrapeTaskResponse)
async def trigger_scrape(
    request: ScrapeRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: Annotated[Client, Depends(get_supabase)]
):
    """
    Trigger asynchronous Reddit scraping and analysis.

    This endpoint:
    1. Validates the Reddit URL
    2. Creates a scrape job record
    3. Dispatches a Celery task
    4. Returns task ID for status tracking

    Args:
        request: Reddit URL and scraping parameters
        current_user: Current authenticated user
        supabase: Supabase client

    Returns:
        Task ID and initial status
    """
    # Basic URL validation
    if not ("reddit.com" in request.reddit_url or "redd.it" in request.reddit_url):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Reddit URL"
        )

    # Create scrape job record
    job_id = str(uuid4())

    # Dispatch Celery task (using public JSON scraper)
    task = scrape_and_analyze_reddit_public.delay(
        reddit_url=request.reddit_url,
        max_comments=request.max_comments,
        user_id=current_user["user_id"],
        job_id=job_id
    )

    # Save job to database
    supabase.table("scrape_jobs").insert({
        "id": job_id,
        "user_id": current_user["user_id"],
        "reddit_url": request.reddit_url,
        "task_id": task.id,
        "status": "pending"
    }).execute()

    return ScrapeTaskResponse(
        task_id=task.id,
        status="pending",
        message=f"Scraping task initiated for {request.reddit_url}"
    )


@router.get("/status/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(
    task_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: Annotated[Client, Depends(get_supabase)]
):
    """
    Check the status of a scraping task.

    Args:
        task_id: Celery task ID
        current_user: Current authenticated user
        supabase: Supabase client

    Returns:
        Current task status and results (if complete)
    """
    # Verify user owns this task
    result = supabase.table("scrape_jobs")\
        .select("*")\
        .eq("task_id", task_id)\
        .eq("user_id", current_user["user_id"])\
        .execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    job = result.data[0]

    # Get Celery task status
    from app.tasks.celery_app import celery_app
    task = celery_app.AsyncResult(task_id)

    response_data = {
        "task_id": task_id,
        "status": task.state.lower(),
        "result": None,
        "error": None
    }

    if task.successful():
        response_data["result"] = {
            "total_comments": job.get("total_comments", 0),
            "processed_comments": job.get("processed_comments", 0),
            "insights_generated": task.result.get("insights_count", 0) if task.result else 0
        }
    elif task.failed():
        response_data["error"] = str(task.info) if task.info else "Task failed"

    return TaskStatusResponse(**response_data)

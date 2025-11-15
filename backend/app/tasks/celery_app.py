"""
Celery application configuration.
Runs as separate worker process: celery -A app.tasks.celery_app worker --loglevel=info
"""
from celery import Celery
from app.core.config import settings

# Initialize Celery app
celery_app = Celery(
    "judgmentai",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.reddit_scraper",
        "app.tasks.reddit_scraper_public",
        "app.tasks.web_search"
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max per task
    task_soft_time_limit=3000,  # 50 minute soft limit
    worker_prefetch_multiplier=1,  # Process one task at a time
    worker_max_tasks_per_child=50,  # Restart worker after 50 tasks (prevent memory leaks)
)

# Optional: Configure task routes
celery_app.conf.task_routes = {
    "app.tasks.reddit_scraper.*": {"queue": "scraping"},
    "app.tasks.web_search.*": {"queue": "search"},
}

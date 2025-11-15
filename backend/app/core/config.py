"""
Core configuration settings using Pydantic Settings.
Loads from environment variables with validation.
"""
from typing import List
from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    # Application
    APP_ENV: str = Field(default="development")
    SECRET_KEY: str = Field(..., min_length=32)
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)

    # CORS - must be stored as List[str] for FastAPI CORS middleware
    ALLOWED_ORIGINS_STR: str = Field(default="http://localhost:3000", alias="ALLOWED_ORIGINS")

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Parse comma-separated origins string into list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS_STR.split(",")]

    # Supabase
    SUPABASE_URL: str = Field(...)
    SUPABASE_SERVICE_ROLE_KEY: str = Field(...)
    SUPABASE_ANON_KEY: str = Field(...)
    SUPABASE_JWT_SECRET: str = Field(...)  # For verifying Supabase JWT tokens

    # Database
    DATABASE_URL: str = Field(...)

    # LLM APIs
    OPENAI_API_KEY: str = Field(...)
    ANTHROPIC_API_KEY: str | None = Field(default=None)

    # Reddit
    REDDIT_CLIENT_ID: str = Field(...)
    REDDIT_CLIENT_SECRET: str = Field(...)
    REDDIT_USER_AGENT: str = Field(default="JudgmentAI/1.0")

    # Google Search
    GOOGLE_API_KEY: str | None = Field(default=None)
    GOOGLE_SEARCH_ENGINE_ID: str | None = Field(default=None)

    # Celery
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = Field(...)

    # Vector Store
    EMBEDDING_MODEL: str = Field(default="text-embedding-3-small")
    VECTOR_DIMENSION: int = Field(default=1536)

    # Chat
    DEFAULT_LLM_MODEL: str = Field(default="gpt-4o-mini")
    MAX_CHAT_HISTORY: int = Field(default=20)

    @property
    def is_production(self) -> bool:
        """Check if running in production."""
        return self.APP_ENV == "production"


# Global settings instance
settings = Settings()

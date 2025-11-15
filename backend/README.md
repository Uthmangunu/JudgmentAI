# JudgmentAI Backend

Reddit meta-analysis and conversational AI platform with RAG (Retrieval-Augmented Generation).

## Architecture Overview

```
┌─────────────────┐
│   React Client  │
└────────┬────────┘
         │
         │ HTTP/REST
         ▼
┌─────────────────┐      ┌──────────────┐
│  FastAPI Server │◄─────┤  Supabase    │
│  (async)        │      │  - Auth      │
└────────┬────────┘      │  - Postgres  │
         │               │  - pgvector  │
         │               └──────────────┘
         ▼
┌─────────────────┐      ┌──────────────┐
│  Celery Workers │◄─────┤    Redis     │
│  - Scraping     │      │  (Broker)    │
│  - ABSA         │      └──────────────┘
│  - Web Search   │
└─────────────────┘
```

## Features

- **Authentication**: Supabase Auth with JWT tokens
- **Chat API**: Stateless RAG-powered chat with LlamaIndex
- **Reddit Scraping**: Asynchronous PRAW-based scraping
- **ABSA Analysis**: Aspect-Based Sentiment Analysis with spaCy + SetFit
- **Vector Search**: pgvector for semantic similarity search
- **Web Augmentation**: Google Custom Search API integration
- **Task Queue**: Celery for background processing

## Project Structure

```
backend/
├── app/
│   ├── api/v1/          # API endpoints (auth, chat, scrape)
│   ├── core/            # Config, security, dependencies
│   ├── db/              # Database schemas, Supabase client
│   ├── services/        # Business logic (chat, analysis)
│   ├── tasks/           # Celery tasks (scraping, NLP)
│   └── utils/           # Helper functions
├── tests/               # Test suite
├── requirements.txt     # Python dependencies
└── docker-compose.yml   # Development environment
```

## Setup

### Prerequisites

- Python 3.11+
- Supabase account (or use Docker)
- Redis (or use Docker)
- API Keys:
  - OpenAI (for embeddings & LLM)
  - Reddit (PRAW credentials)
  - Google Custom Search (optional)

### Installation

1. **Clone and navigate:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_lg  # Better accuracy
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

5. **Initialize Supabase database:**
   - Go to your Supabase dashboard → SQL Editor
   - Run the SQL in `app/db/init_db.sql`
   - This creates tables and enables pgvector

### Running Locally

**Option 1: Manual (3 terminals)**

Terminal 1 - API Server:
```bash
uvicorn app.main:app --reload
```

Terminal 2 - Celery Worker:
```bash
celery -A app.tasks.celery_app worker --loglevel=info
```

Terminal 3 - Redis (if not using Docker):
```bash
redis-server
```

**Option 2: Docker Compose (recommended)**

```bash
docker-compose up
```

Services will start on:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Flower (Celery monitor): http://localhost:5555
- Redis: localhost:6379

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user profile

### Chat
- `POST /api/v1/chat/conversations` - Create conversation
- `GET /api/v1/chat/conversations` - List user's conversations
- `GET /api/v1/chat/conversations/{id}/messages` - Get conversation history
- `POST /api/v1/chat` - Send message and get AI response

### Scraping
- `POST /api/v1/scrape` - Trigger Reddit scrape & analysis
- `GET /api/v1/scrape/status/{task_id}` - Check task status

## Development Workflow

### Adding a New Endpoint

1. Create route in `app/api/v1/`
2. Add schema in `app/db/schemas.py`
3. Implement logic in `app/services/`
4. Register router in `app/main.py`

### Adding a New Celery Task

1. Define task in `app/tasks/`
2. Import in `app/tasks/celery_app.py` include list
3. Call with `.delay()` from API endpoint

### Running Tests

```bash
pytest tests/ -v
```

## Configuration

Key settings in `.env`:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) |
| `OPENAI_API_KEY` | OpenAI API key for embeddings & LLM |
| `REDDIT_CLIENT_ID` | Reddit app client ID |
| `REDDIT_CLIENT_SECRET` | Reddit app secret |
| `CELERY_BROKER_URL` | Redis connection string |
| `DATABASE_URL` | PostgreSQL connection string |

## Troubleshooting

**Import errors:**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

**Supabase connection fails:**
- Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Verify project is not paused

**Celery tasks not running:**
- Ensure Redis is running
- Check Celery worker logs
- Verify `CELERY_BROKER_URL` is correct

**Vector search not working:**
- Run `CREATE EXTENSION vector;` in Supabase SQL editor
- Check `pgvector` is enabled in Extensions tab

## Production Deployment

1. Set `APP_ENV=production` in `.env`
2. Use proper secret key (32+ characters)
3. Configure proper CORS origins
4. Use gunicorn/uvicorn workers
5. Set up monitoring (Sentry, Flower)
6. Enable Supabase RLS policies
7. Use managed Redis (Upstash, Redis Cloud)

## License

MIT

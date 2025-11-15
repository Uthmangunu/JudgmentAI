# Getting Started with JudgmentAI

This guide walks you through setting up JudgmentAI from scratch.

## What You've Built

**JudgmentAI** is a complete backend system for:
- 🔍 Scraping Reddit discussions
- 🧠 Analyzing sentiment at aspect-level (not just positive/negative)
- 💬 Chatting with AI that has context from Reddit insights
- 🔐 User authentication and authorization
- ⚡ Asynchronous background processing

## Architecture Highlights

### Modular Design
Every component is isolated for maintainability:
- `api/` - HTTP endpoints
- `core/` - Configuration, security
- `db/` - Database schemas and connection
- `services/` - Business logic
- `tasks/` - Background workers

### Key Design Decisions

1. **Stateless Chat Engine**
   - ❌ NOT a global chat object (causes data leaks)
   - ✅ Fetches history per request, passes to LLM
   - Why: Prevents users seeing each other's conversations

2. **Celery for Heavy Tasks**
   - ❌ NOT FastAPI BackgroundTasks (blocks server)
   - ✅ Separate worker processes
   - Why: API stays responsive while scraping 1000s of comments

3. **ABSA over Basic Sentiment**
   - ❌ NOT "this review is 60% positive"
   - ✅ "Camera: positive, Battery: negative"
   - Why: Nuanced insights users actually want

## Setup Steps

### 1. Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to **Database** → **Extensions** → Enable `vector`
3. Go to **SQL Editor** → Copy/paste from `backend/app/db/init_db.sql` → Run
4. Go to **Settings** → **API** → Copy:
   - Project URL
   - `anon` key
   - `service_role` key

### 2. Reddit API Credentials (3 minutes)

1. Go to [reddit.com/prefs/apps](https://reddit.com/prefs/apps)
2. Click "create app" or "create another app"
3. Choose "script"
4. Name: "JudgmentAI"
5. Redirect URI: `http://localhost:8000`
6. Copy:
   - Client ID (under app name)
   - Client Secret

### 3. OpenAI API Key (2 minutes)

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy it (you won't see it again!)

### 4. Backend Setup

```bash
cd backend

# Option A: Automated setup
make setup
# Edit .env with your keys
make dev

# In another terminal
make celery

# Option B: Docker (recommended)
cp .env.example .env
# Edit .env with your keys
docker-compose up
```

### 5. Test the API

Open http://localhost:8000/docs

Try:
1. **POST /api/v1/auth/signup** - Create account
2. **POST /api/v1/auth/login** - Get JWT token
3. **POST /api/v1/scrape** - Scrape a Reddit URL
4. **POST /api/v1/chat** - Ask about the insights

## Understanding the Flow

### Scraping Flow
```
User → POST /api/v1/scrape → FastAPI
                             ↓
                       Celery Task Queued
                             ↓
            Celery Worker ← Redis (broker)
                 ↓
         1. Scrape Reddit (PRAW)
         2. Extract aspects (spaCy)
         3. Classify sentiment (SetFit)
         4. Generate embeddings (OpenAI)
         5. Store in Supabase (pgvector)
                 ↓
              Done!
```

### Chat Flow
```
User → POST /api/v1/chat → FastAPI
                            ↓
                    Fetch user's chat history
                            ↓
                    Query vector store (pgvector)
                    "Find insights similar to user's question"
                            ↓
                    LlamaIndex retrieves top 5 insights
                            ↓
                    Build prompt:
                    - System: "You are JudgmentAI..."
                    - Context: [retrieved insights]
                    - History: [past messages]
                    - User: [current question]
                            ↓
                    OpenAI GPT-4o-mini
                            ↓
                    Save user message + AI response
                            ↓
                    Return to user
```

## Project Structure

```
JudgmentAI/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # 3 routers: auth, chat, scrape
│   │   ├── core/            # config, security, dependencies
│   │   ├── db/              # schemas, SQL, Supabase client
│   │   ├── services/        # chat_service, analysis_service
│   │   ├── tasks/           # celery_app, reddit_scraper, web_search
│   │   ├── utils/           # helpers
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt
│   ├── docker-compose.yml
│   ├── Makefile
│   └── README.md
├── plan.md                  # Original architecture plan
└── README.md                # This file
```

## Common Commands

```bash
# Development
make dev          # Start FastAPI server
make celery       # Start background workers
make format       # Format code with black
make lint         # Check code quality
make test         # Run tests

# Docker
docker-compose up           # Start all services
docker-compose logs -f      # View logs
docker-compose down         # Stop services

# Production
APP_ENV=production uvicorn app.main:app --workers 4
celery -A app.tasks.celery_app worker --concurrency=4
```

## Next Steps

1. **Test End-to-End**
   - Signup → Login → Scrape a Reddit URL → Chat about it

2. **Build Frontend** (Phase 5)
   - React + TailwindCSS
   - Chat interface
   - Task status monitoring

3. **Optimize Scraping** (Phase 6)
   - Implement morechildren API for full threads
   - Add caching to avoid re-scraping

4. **Deploy** (Phase 7)
   - Railway/Render for FastAPI
   - Upstash for Redis
   - Vercel for frontend

## Troubleshooting

**"No module named 'app'"**
- Make sure you're in the `backend/` directory
- Virtual environment activated

**"Connection refused" to Supabase**
- Check `.env` has correct `SUPABASE_URL`
- Project not paused in Supabase dashboard

**Celery tasks stuck "pending"**
- Check Redis is running: `redis-cli ping` should return `PONG`
- Check Celery worker is running
- Check `CELERY_BROKER_URL` in `.env`

**"vector extension not found"**
- Go to Supabase → Database → Extensions
- Enable `vector`
- Re-run init_db.sql

## Resources

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [LlamaIndex Docs](https://docs.llamaindex.ai)
- [Celery Docs](https://docs.celeryq.dev)
- [Supabase Docs](https://supabase.com/docs)
- [PRAW Docs](https://praw.readthedocs.io)

## Questions?

Check the detailed plan: [plan.md](plan.md)

---

Built with ❤️ following clean architecture principles.

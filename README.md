# JudgmentAI

> **Reddit Meta-Analysis Platform with Conversational AI**

Scrape Reddit discussions, perform aspect-based sentiment analysis, and chat with AI insights using RAG (Retrieval-Augmented Generation).

## 🎯 What It Does

1. **Scrapes Reddit** - Extracts posts and comments from any subreddit or thread
2. **Analyzes Sentiment** - Uses ABSA to identify what people say about specific topics
3. **Stores Insights** - Saves structured data in a vector database for semantic search
4. **Conversational AI** - Chat interface powered by LlamaIndex + OpenAI
5. **Web Augmentation** - Enriches insights with external web sources

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│              (Next.js or Vite + React)                  │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────┐
│                   FastAPI Backend                        │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │   Auth   │  │   Chat   │  │  Reddit Scraping   │   │
│  │ (Supabase)│  │  (RAG)   │  │  (Celery Tasks)   │   │
│  └──────────┘  └──────────┘  └────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Supabase + pgvector                     │
│         (PostgreSQL, Auth, Vector Store)                │
└──────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+ (for frontend)
- Supabase account (free tier works)
- OpenAI API key
- Reddit API credentials

### Backend Setup

```bash
cd backend
make setup                    # or bash scripts/setup.sh
# Edit .env with your credentials
make dev                      # Start FastAPI server
```

In another terminal:
```bash
make celery                   # Start background workers
```

Or use Docker:
```bash
docker-compose up
```

### Frontend Setup (Coming Soon)

```bash
cd frontend
npm install
npm run dev
```

## 📖 Full Documentation

- **Backend**: See [backend/README.md](backend/README.md)
- **API Docs**: http://localhost:8000/docs (when running)
- **Architecture**: See [plan.md](plan.md)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Async Python web framework
- **Supabase** - PostgreSQL + Auth + pgvector
- **LlamaIndex** - RAG framework
- **Celery** - Background task queue
- **PRAW** - Reddit API wrapper
- **spaCy + SetFit** - NLP for ABSA

### Frontend (Planned)
- **React** - UI framework
- **TailwindCSS** - Styling
- **React Query** - Data fetching

## 🎓 Key Concepts

### Aspect-Based Sentiment Analysis (ABSA)

Traditional sentiment analysis gives one score for entire text. ABSA identifies **what** is being discussed and the sentiment for **each aspect**:

**Example:**
> "The camera is amazing but the battery life is terrible"

Traditional: ❓ Neutral (mixed)
ABSA:
- ✅ Camera → Positive
- ❌ Battery life → Negative

### Stateless Chat with RAG

Each chat request:
1. Fetches user's chat history from database
2. Queries vector store for relevant Reddit insights
3. Passes context + history to LLM
4. Returns response and saves to database

**Why?** Prevents data leakage between users. Each user gets isolated history.

## 📊 API Examples

### 1. Signup
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}'
```

### 2. Trigger Reddit Scrape
```bash
curl -X POST http://localhost:8000/api/v1/scrape \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reddit_url": "https://reddit.com/r/gaming/comments/abc123",
    "max_comments": 500
  }'
```

### 3. Chat
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "optional-uuid",
    "message": "What do people say about the graphics?"
  }'
```

## 🔐 Environment Variables

Create `backend/.env` with:

```env
# Supabase
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key

# OpenAI
OPENAI_API_KEY=sk-...

# Reddit
REDDIT_CLIENT_ID=your-client-id
REDDIT_CLIENT_SECRET=your-secret
REDDIT_USER_AGENT=JudgmentAI/1.0

# Optional: Google Search
GOOGLE_API_KEY=your-key
GOOGLE_SEARCH_ENGINE_ID=your-id
```

## 🗺️ Roadmap

- [x] Phase 1: Backend foundation (FastAPI, Supabase, Auth)
- [x] Phase 2: RAG chat engine with LlamaIndex
- [x] Phase 3: Reddit scraping with Celery
- [x] Phase 4: ABSA analysis pipeline
- [ ] Phase 5: React frontend
- [ ] Phase 6: Advanced Reddit scraping (morechildren API)
- [ ] Phase 7: Production deployment
- [ ] Phase 8: Caching & rate limiting

## 📝 License

MIT

## 🤝 Contributing

This is a learning/portfolio project. Feel free to fork and modify!

## 💡 Credits

Built following the architectural plan in [plan.md](plan.md) 

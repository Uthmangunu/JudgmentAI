Project Goal & Stack
Objective: Build a web application that scrapes Reddit, performs a "meta-analysis" on the content, augments it with web search, and provides a conversational (RAG) chat interface.

Core Stack:

Backend: FastAPI (Python)

Database & Auth: Supabase (PostgreSQL with pgvector)

Phase 1: The Foundation (Backend, Database & Auth)
Objective: Establish the core API server, connect it to Supabase, and implement secure user authentication. This is the foundation for all other features.

Key Tasks:

Initialize Supabase Project:

Create a new project in your Supabase dashboard.

Enable the pgvector extension in the "Database" -> "Extensions" section. This is non-negotiable for the RAG component.   

Note your Project URL and service_role key. These will be stored securely as environment variables for your FastAPI backend.

Initialize FastAPI Project:

Set up a standard Python virtual environment and install dependencies: fastapi, uvicorn, and supabase-py.   

Implement Supabase Connection:

Create a Supabase client instance within your FastAPI application, initializing it with your URL and service_role key.   

Ensure you use the acreate_client and async methods for database operations to avoid blocking FastAPI's event loop.   

Define Core Database Schema:

In the Supabase SQL editor, create the necessary tables. You will need:

conversations: To store a list of chat sessions, linked to a user.   

messages: To store individual user and AI messages, linked to a conversation_id.   

insights: To store the results of your meta-analysis (e.g., aspect, sentiment, source_url, and an embedding column of type vector).

Implement Authentication Endpoints:

Create /signup and /login endpoints in FastAPI.

These endpoints will simply call the supabase.auth.sign_up() and supabase.auth.sign_in_with_password() methods from the supabase-py client.   

Create a protected /users/me endpoint that requires a valid JWT (Bearer Token) to test that authentication is working correctly.   

Phase 2: The Core Experience (Conversational RAG Engine)
Objective: Build the main "chat" feature. This phase implements the Retrieval-Augmented Generation (RAG) pipeline connecting LlamaIndex to your Supabase vector store.

Key Tasks:

Integrate LlamaIndex:

Install LlamaIndex: pip install llama-index llama-index-vector-stores-supabase.   

In your FastAPI app, import and configure the SupabaseVectorStore to point to your Supabase project and the insights table.   

Load this vector store into a VectorStoreIndex.   

Build the /chat Endpoint:

Create a POST /api/v1/chat endpoint in FastAPI that accepts a user's message.   

This endpoint will convert the user's query into an embedding, use the LlamaIndex retriever to find relevant insights from your pgvector database, and then pass that context to an LLM (like GPT-4o-mini) to generate an answer.   

CRITICAL: Implement Multi-User Chat History:

The Pitfall: Do not create a single, global chat_engine object in your FastAPI app. This will cause all users to share the same conversation history, which is a critical data leak.   

The Solution: The ChatEngine must be stateless. On every request to your /chat endpoint:

Get the user_id from the JWT token.

Get the conversation_id from the request body.   

Fetch that user's past messages for that conversation from your Supabase messages table.   

Pass this list of messages explicitly to the chat engine: response = chat_engine.chat(message, chat_history=...).   

Save the new user message and the AI's response back to the messages table.   

Phase 3: The Data Pipeline (Asynchronous Scraping)
Objective: Build a robust, scalable system to scrape Reddit and process the data without freezing the main web server.

Key Tasks:

Choose a Task Processor (Celery):

The Pitfall: Do not use FastAPI's built-in BackgroundTasks for scraping or NLP. These tasks run in the same process as your web server. A long-running scrape or analysis will block the entire server, making it unresponsive to other users.   

The Solution: Use Celery, a dedicated, distributed task queue. This runs heavy jobs in separate worker processes, allowing your FastAPI app to stay fast and responsive.   

Install and configure Celery: pip install celery redis. You will use Redis as the "broker" (the task manager) and can use your Supabase (Postgres) database as the "backend" (to store task results).   

Implement Reddit Scraper (Celery Task):

Method 1 (MVP): Start with PRAW, the official Python Reddit API Wrapper. This is simple to use but is generally limited to fetching ~1000 posts or comments from a listing.   

Method 2 (Production): To get all comments from a thread (for true meta-analysis), you must bypass PRAW and reverse-engineer the internal API. This involves:

Fetching the thread's initial .json page.   

Parsing the response for {"kind": "more"} objects.

Recursively calling the api/morechildren endpoint with the comment IDs from those "more" objects to load the next batch of comments.   

Wrap this scraping logic inside a @celery.task function.

Phase 4: The "Meta-Analysis" Engine (NLP)
Objective: Process the raw scraped comments into the structured, queryable "insights" that the user requested. This will also be a Celery task.

Key Tasks:

Define Analysis Goal: The user wants to know the "percentage of people saying something." A simple n-gram frequency count or basic sentiment score is insufficient. A review like "The camera is great, but the battery is terrible" would be incorrectly classified as "neutral".   

Select Technique (ABSA): The correct method is Aspect-Based Sentiment Analysis (ABSA). This identifies what is being discussed (the "aspect") and the sentiment for that specific aspect.   

Implement ABSA Pipeline (as a Celery task):

Install libraries: pip install setfit[absa] spacy and download a spaCy model: spacy download en_core_web_lg.   

Step 1 (Aspect Extraction): For each comment, use spaCy to extract "noun chunks" (e.g., "battery life," "customer service").   

Step 2 (Classification): Use a pre-trained SetFitABSA model to classify the sentiment (Positive, Negative, Neutral) for each extracted noun chunk.   

Step 3 (Store): Take the structured output (e.g., {"aspect": "camera quality", "sentiment": "positive"}) and save it to your Supabase insights table, generating a vector embedding for it at the same time.

Phase 5: Augmentation & Frontend
Objective: Integrate the external web search feature and select the correct frontend technology to build the user interface.

Key Tasks:

Web Search Integration (Celery Task):

Create a new Celery task for web research.

Use the Google Custom Search JSON API. It is simple to integrate and provides a free tier of 100 queries per day, with paid plans at $5 per 1000 queries.   

Your /chat endpoint can trigger this task when the RAG system identifies a topic that needs external validation.

Frontend Technology (React):

The Decision: Use React.

Justification: Your core feature is a complex, stateful, interactive chat application. This is the exact use case React was designed for. A server-driven library like HTMX is excellent for simpler, server-rendered pages but is not suitable for building a modern, real-time chat window and will lead to technical limitations.   

Operational Cost Management:

LLM Costs: Use cost-effective models like OpenAI's gpt-4o-mini or Anthropic's claude-3-5-haiku for most chat interactions.   

Cost Controls: Implement caching (to avoid re-analyzing the same thread) and API rate limiting on your FastAPI backend to prevent abuse and control costs.   
# Support RAG Chatbot

Customer support chatbot with Retrieval-Augmented Generation. Stack: LangChain · Pinecone · Gemini 1.5 Pro · FastAPI · React + Vite + Tailwind.

## Architecture

```
User → React UI → FastAPI → LangChain RAG pipeline
                              ├── Pinecone (vector search)
                              ├── Gemini (embeddings + LLM)
                              └── Redis / in-memory (conversation history)
```

**RAG Flow:**
1. User message → Gemini embeddings → Pinecone similarity search (top-k chunks)
2. Retrieved context + conversation history → Gemini 1.5 Pro
3. Response + source documents + confidence score → UI

## Project Structure

```
support-rag/
├── .gitignore
├── README.md
├── docker-compose.yml
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app, lifespan, CORS, routers
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py               # POST /chat/, GET+DELETE /chat/history
│   │   │   ├── health.py             # GET /health
│   │   │   └── ingest.py             # POST /ingest/sample, /ingest/custom
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py             # Pydantic settings (env vars)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py            # All request/response Pydantic models
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── rag_chain.py          # Core RAG pipeline (Gemini + retrieval + memory)
│   │   │   ├── vector_store.py       # Pinecone init, ingest, similarity search
│   │   │   └── memory.py             # Conversation memory (Redis + in-memory fallback)
│   │   └── utils/
│   │       └── __init__.py
│   └── data/
│       ├── __init__.py
│       └── sample_docs.py            # 8 sample support documents for ingestion
│
└── frontend/
    ├── Dockerfile
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx                  # React entry point
        ├── App.tsx                   # Root layout, health polling
        ├── index.css                 # Tailwind + custom design tokens
        ├── components/
        │   ├── Header.tsx            # Top bar, health badge, clear/reset actions
        │   ├── Sidebar.tsx           # System status, ingest button, session stats
        │   ├── MessageList.tsx       # Scrollable chat + empty state
        │   ├── MessageBubble.tsx     # User/assistant bubbles, sources, confidence
        │   └── ChatInput.tsx         # Textarea, send button, suggestion chips
        ├── services/
        │   └── api.ts                # Axios client (chat, ingest, health)
        ├── store/
        │   └── chatStore.ts          # Zustand global state
        └── types/
            └── index.ts              # Shared TypeScript interfaces
```

## Setup

### 1. Environment

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:
```
GOOGLE_API_KEY=your_key        # aistudio.google.com
PINECONE_API_KEY=your_key      # app.pinecone.io
PINECONE_INDEX_NAME=support-rag
PINECONE_ENVIRONMENT=us-east-1
```

### 2. Run (Docker)

```bash
docker-compose up
```

### 3. Run (local dev)

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Ingest sample documents

Hit the sidebar **"Load sample docs"** button, or:
```bash
curl -X POST http://localhost:8000/api/v1/ingest/sample
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/chat/` | Send message, get RAG response |
| GET | `/api/v1/chat/history/{session_id}` | Get conversation history |
| DELETE | `/api/v1/chat/history/{session_id}` | Clear session |
| POST | `/api/v1/ingest/sample` | Load built-in sample docs |
| POST | `/api/v1/ingest/custom` | Ingest custom documents |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |

## Adding Your Own Documents

```bash
curl -X POST http://localhost:8000/api/v1/ingest/custom \
  -H "Content-Type: application/json" \
  -d '[{"title": "My Doc", "content": "...", "category": "support", "doc_id": "DOC-001"}]'
```

## Key Config (backend/.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `CHUNK_SIZE` | 1000 | Characters per chunk |
| `CHUNK_OVERLAP` | 200 | Overlap between chunks |
| `TOP_K_RESULTS` | 5 | Retrieved docs per query |
| `MAX_CONVERSATION_HISTORY` | 10 | Message turns kept in context |
| `REDIS_URL` | (empty) | Falls back to in-memory if unset |

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
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers (chat, ingest, health)
│   │   ├── core/         # Config, settings
│   │   ├── models/       # Pydantic schemas
│   │   └── services/     # RAG chain, vector store, memory
│   ├── data/
│   │   └── sample_docs.py  # 8 sample support documents
│   ├── .env.example
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Header, Sidebar, MessageBubble, ChatInput, MessageList
│   │   ├── services/     # Axios API client
│   │   ├── store/        # Zustand state
│   │   └── types/        # TypeScript types
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
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

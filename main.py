import logging
import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

# Add the backend root to path so `data` module resolves
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import get_settings
from app.services.vector_store import vector_store_service
from app.services.memory import memory_service
from app.api import chat, ingest, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up Support RAG API...")
    await vector_store_service.initialize()
    await memory_service.initialize()
    logger.info("All services initialized")
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="Support RAG API",
    description="Customer Support Chatbot powered by RAG — LangChain + Pinecone + Gemini",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(chat.router, prefix="/api/v1")
app.include_router(ingest.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "name": "Support RAG API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }

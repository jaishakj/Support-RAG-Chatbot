from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    sources: Optional[List[str]] = None


class ChatRequest(BaseModel):
    session_id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str
    stream: bool = False


class SourceDocument(BaseModel):
    title: str
    content: str
    score: float
    metadata: dict = {}


class ChatResponse(BaseModel):
    session_id: str
    message: str
    sources: List[SourceDocument] = []
    confidence: float
    response_time_ms: int
    escalate_to_agent: bool = False


class IngestRequest(BaseModel):
    namespace: Optional[str] = "default"


class IngestResponse(BaseModel):
    status: str
    documents_processed: int
    chunks_created: int
    namespace: str


class SessionHistoryResponse(BaseModel):
    session_id: str
    messages: List[ChatMessage]
    total_messages: int


class HealthResponse(BaseModel):
    status: str
    pinecone_connected: bool
    gemini_connected: bool
    version: str = "1.0.0"

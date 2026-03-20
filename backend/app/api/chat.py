import uuid
import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import (
    ChatRequest, ChatResponse,
    SessionHistoryResponse,
)
from app.services.rag_chain import rag_service
from app.services.memory import memory_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint. Accepts a message, runs RAG pipeline,
    returns answer + source documents + confidence score.
    """
    session_id = request.session_id or str(uuid.uuid4())

    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if len(request.message) > 4000:
        raise HTTPException(status_code=400, detail="Message too long (max 4000 chars)")

    try:
        response = await rag_service.chat(
            session_id=session_id,
            user_message=request.message.strip(),
        )
        return response
    except Exception as e:
        logger.exception(f"Chat error for session {session_id}: {e}")
        raise HTTPException(status_code=500, detail="An error occurred processing your request")


@router.get("/history/{session_id}", response_model=SessionHistoryResponse)
async def get_history(session_id: str):
    """Return full conversation history for a session."""
    messages = await memory_service.get_session_schema(session_id)
    return SessionHistoryResponse(
        session_id=session_id,
        messages=messages,
        total_messages=len(messages),
    )


@router.delete("/history/{session_id}")
async def clear_history(session_id: str):
    """Clear conversation history for a session."""
    await memory_service.clear_session(session_id)
    return {"status": "cleared", "session_id": session_id}

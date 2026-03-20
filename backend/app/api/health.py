from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.services.vector_store import vector_store_service
from app.services.rag_chain import rag_service

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health():
    pinecone_ok = await vector_store_service.health_check()
    gemini_ok = await rag_service.health_check()

    return HealthResponse(
        status="healthy" if (pinecone_ok and gemini_ok) else "degraded",
        pinecone_connected=pinecone_ok,
        gemini_connected=gemini_ok,
    )

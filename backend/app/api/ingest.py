import logging
import sys
import os
from fastapi import APIRouter, HTTPException
from app.models.schemas import IngestRequest, IngestResponse
from app.services.vector_store import vector_store_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ingest", tags=["ingest"])


@router.post("/sample", response_model=IngestResponse)
async def ingest_sample_data(request: IngestRequest = IngestRequest()):
    """
    Ingest the built-in sample support documents into Pinecone.
    Safe to call multiple times (Pinecone upserts by vector ID).
    """
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../"))
        from data.sample_docs import SAMPLE_DOCUMENTS

        doc_count, chunk_count = await vector_store_service.ingest_documents(
            documents=SAMPLE_DOCUMENTS,
            namespace=request.namespace,
        )

        return IngestResponse(
            status="success",
            documents_processed=doc_count,
            chunks_created=chunk_count,
            namespace=request.namespace,
        )
    except Exception as e:
        logger.exception(f"Ingest error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/custom", response_model=IngestResponse)
async def ingest_custom_documents(
    documents: list[dict],
    request: IngestRequest = IngestRequest(),
):
    """
    Ingest custom documents. Each document should have:
    { "title": str, "content": str, "category": str, "doc_id": str }
    """
    if not documents:
        raise HTTPException(status_code=400, detail="No documents provided")
    if len(documents) > 500:
        raise HTTPException(status_code=400, detail="Max 500 documents per batch")

    try:
        doc_count, chunk_count = await vector_store_service.ingest_documents(
            documents=documents,
            namespace=request.namespace,
        )
        return IngestResponse(
            status="success",
            documents_processed=doc_count,
            chunks_created=chunk_count,
            namespace=request.namespace,
        )
    except Exception as e:
        logger.exception(f"Custom ingest error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

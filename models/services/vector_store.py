import asyncio
import logging
from typing import List, Tuple, Optional
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from pinecone import Pinecone, ServerlessSpec
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class VectorStoreService:
    def __init__(self):
        self._store: Optional[PineconeVectorStore] = None
        self._embeddings: Optional[GoogleGenerativeAIEmbeddings] = None
        self._pc: Optional[Pinecone] = None
        self._initialized = False

    def _get_embeddings(self) -> GoogleGenerativeAIEmbeddings:
        if not self._embeddings:
            self._embeddings = GoogleGenerativeAIEmbeddings(
                model=settings.embedding_model,
                google_api_key=settings.google_api_key,
            )
        return self._embeddings

    def _get_pinecone_client(self) -> Pinecone:
        if not self._pc:
            self._pc = Pinecone(api_key=settings.pinecone_api_key)
        return self._pc

    async def initialize(self) -> None:
        """Initialize Pinecone index, create if it doesn't exist."""
        if self._initialized:
            return

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self._sync_initialize)
        self._initialized = True

    def _sync_initialize(self) -> None:
        pc = self._get_pinecone_client()
        existing_indexes = [idx.name for idx in pc.list_indexes()]

        if settings.pinecone_index_name not in existing_indexes:
            logger.info(f"Creating Pinecone index: {settings.pinecone_index_name}")
            pc.create_index(
                name=settings.pinecone_index_name,
                dimension=768,  # Gemini embedding-001 dimension
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region=settings.pinecone_environment),
            )

        self._store = PineconeVectorStore(
            index_name=settings.pinecone_index_name,
            embedding=self._get_embeddings(),
            pinecone_api_key=settings.pinecone_api_key,
        )
        logger.info("Pinecone vector store initialized")

    def get_store(self) -> PineconeVectorStore:
        if not self._store:
            raise RuntimeError("VectorStoreService not initialized. Call initialize() first.")
        return self._store

    async def ingest_documents(
        self,
        documents: List[dict],
        namespace: str = "default",
    ) -> Tuple[int, int]:
        """Ingest raw document dicts, split and embed them. Returns (doc_count, chunk_count)."""
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            separators=["\n\n", "\n", ".", " ", ""],
        )

        langchain_docs = []
        for doc in documents:
            langchain_docs.append(
                Document(
                    page_content=doc["content"],
                    metadata={
                        "title": doc.get("title", ""),
                        "category": doc.get("category", "general"),
                        "doc_id": doc.get("doc_id", ""),
                        "source": doc.get("title", ""),
                        "namespace": namespace,
                    },
                )
            )

        chunks = splitter.split_documents(langchain_docs)
        logger.info(f"Split {len(langchain_docs)} documents into {len(chunks)} chunks")

        store = self.get_store()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: store.add_documents(chunks),
        )

        return len(langchain_docs), len(chunks)

    async def similarity_search(
        self,
        query: str,
        k: int = None,
        filter: Optional[dict] = None,
    ) -> List[Tuple[Document, float]]:
        """Return top-k docs with similarity scores."""
        k = k or settings.top_k_results
        store = self.get_store()

        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(
            None,
            lambda: store.similarity_search_with_score(query, k=k, filter=filter),
        )
        return results

    async def health_check(self) -> bool:
        try:
            pc = self._get_pinecone_client()
            loop = asyncio.get_event_loop()
            indexes = await loop.run_in_executor(None, pc.list_indexes)
            return True
        except Exception as e:
            logger.error(f"Pinecone health check failed: {e}")
            return False


# Singleton
vector_store_service = VectorStoreService()

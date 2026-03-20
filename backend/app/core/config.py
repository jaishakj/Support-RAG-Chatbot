from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    # Google Gemini
    google_api_key: str = ""

    # Pinecone
    pinecone_api_key: str = ""
    pinecone_index_name: str = "support-rag"
    pinecone_environment: str = "us-east-1"

    # App
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Redis (optional)
    redis_url: str = ""

    # RAG
    chunk_size: int = 1000
    chunk_overlap: int = 200
    top_k_results: int = 5
    max_conversation_history: int = 10

    # Embedding model
    embedding_model: str = "models/embedding-001"

    # LLM model
    llm_model: str = "gemini-1.5-pro"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()

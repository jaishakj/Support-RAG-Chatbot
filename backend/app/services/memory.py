import json
import logging
from typing import List, Dict, Optional
from datetime import datetime
from collections import defaultdict
from app.core.config import get_settings
from app.models.schemas import ChatMessage

logger = logging.getLogger(__name__)
settings = get_settings()


class MemoryService:
    """
    Conversation memory with Redis as primary store and in-process dict as fallback.
    Keeps last N turns per session for the context window.
    """

    def __init__(self):
        self._redis = None
        self._local_store: Dict[str, List[dict]] = defaultdict(list)
        self._use_redis = False

    async def initialize(self) -> None:
        if not settings.redis_url:
            logger.info("No REDIS_URL set — using in-memory conversation store")
            return

        try:
            import redis.asyncio as aioredis
            self._redis = aioredis.from_url(settings.redis_url, decode_responses=True)
            await self._redis.ping()
            self._use_redis = True
            logger.info("Redis connected for conversation memory")
        except Exception as e:
            logger.warning(f"Redis unavailable, falling back to in-memory: {e}")
            self._redis = None

    def _session_key(self, session_id: str) -> str:
        return f"chat:history:{session_id}"

    async def add_message(self, session_id: str, role: str, content: str, sources: Optional[List[str]] = None) -> None:
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "sources": sources or [],
        }

        if self._use_redis and self._redis:
            key = self._session_key(session_id)
            await self._redis.rpush(key, json.dumps(message))
            await self._redis.expire(key, 86400 * 7)  # 7-day TTL
            # Trim to max history
            await self._redis.ltrim(key, -settings.max_conversation_history * 2, -1)
        else:
            self._local_store[session_id].append(message)
            # Trim in-memory
            max_msgs = settings.max_conversation_history * 2
            if len(self._local_store[session_id]) > max_msgs:
                self._local_store[session_id] = self._local_store[session_id][-max_msgs:]

    async def get_history(self, session_id: str) -> List[dict]:
        if self._use_redis and self._redis:
            key = self._session_key(session_id)
            raw = await self._redis.lrange(key, 0, -1)
            return [json.loads(m) for m in raw]
        else:
            return list(self._local_store.get(session_id, []))

    async def get_langchain_messages(self, session_id: str) -> List[dict]:
        """Format history for LangChain message injection."""
        history = await self.get_history(session_id)
        return [{"role": m["role"], "content": m["content"]} for m in history]

    async def clear_session(self, session_id: str) -> None:
        if self._use_redis and self._redis:
            await self._redis.delete(self._session_key(session_id))
        else:
            self._local_store.pop(session_id, None)

    async def get_session_schema(self, session_id: str) -> List[ChatMessage]:
        history = await self.get_history(session_id)
        return [
            ChatMessage(
                role=m["role"],
                content=m["content"],
                timestamp=datetime.fromisoformat(m["timestamp"]),
                sources=m.get("sources"),
            )
            for m in history
        ]


memory_service = MemoryService()

import logging
import time
from typing import Tuple, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from app.core.config import get_settings
from app.services.vector_store import vector_store_service
from app.services.memory import memory_service
from app.models.schemas import ChatResponse, SourceDocument

logger = logging.getLogger(__name__)
settings = get_settings()

SYSTEM_PROMPT = """You are a knowledgeable and friendly customer support agent. 
Your job is to help users accurately and concisely using ONLY the context provided below.

Rules:
1. Answer ONLY based on the provided context. Do NOT hallucinate or make up information.
2. If the context doesn't contain the answer, say: "I don't have information on that — let me connect you with a human agent who can help."
3. Be direct, warm, and professional. No corporate jargon.
4. If you reference specific steps or procedures, format them clearly.
5. Keep answers focused — don't over-explain.
6. For billing, account access, or security issues that are urgent or unresolved, recommend human escalation.

Context from knowledge base:
{context}

Conversation history is provided. Use it to maintain continuity and avoid asking for info already shared."""

ESCALATION_KEYWORDS = [
    "speak to human", "human agent", "real person", "manager", "supervisor",
    "escalate", "not helping", "useless", "terrible", "legal", "lawsuit",
    "fraud", "urgent", "emergency", "refund not received", "account hacked",
]

ESCALATION_RESPONSE_INDICATORS = [
    "connect you with a human agent",
    "I don't have information on that",
    "human support",
    "escalate this",
]


class RAGService:
    def __init__(self):
        self._llm: Optional[ChatGoogleGenerativeAI] = None

    def _get_llm(self) -> ChatGoogleGenerativeAI:
        if not self._llm:
            self._llm = ChatGoogleGenerativeAI(
                model=settings.llm_model,
                google_api_key=settings.google_api_key,
                temperature=0.2,
                max_output_tokens=1024,
                convert_system_message_to_human=True,
            )
        return self._llm

    def _should_escalate(self, user_message: str, ai_response: str) -> bool:
        msg_lower = user_message.lower()
        resp_lower = ai_response.lower()

        for kw in ESCALATION_KEYWORDS:
            if kw in msg_lower:
                return True
        for indicator in ESCALATION_RESPONSE_INDICATORS:
            if indicator in resp_lower:
                return True
        return False

    def _compute_confidence(self, scores: List[float]) -> float:
        """Simple confidence: average of top-k cosine similarity scores, clamped [0,1]."""
        if not scores:
            return 0.0
        avg = sum(scores) / len(scores)
        return round(min(max(avg, 0.0), 1.0), 3)

    async def chat(
        self,
        session_id: str,
        user_message: str,
    ) -> ChatResponse:
        start_ms = int(time.time() * 1000)

        # 1. Retrieve relevant context from Pinecone
        retrieved = await vector_store_service.similarity_search(
            query=user_message,
            k=settings.top_k_results,
        )

        source_docs = []
        context_parts = []
        scores = []

        for doc, score in retrieved:
            scores.append(float(score))
            source_docs.append(
                SourceDocument(
                    title=doc.metadata.get("title", "Knowledge Base"),
                    content=doc.page_content[:300],
                    score=round(float(score), 4),
                    metadata=doc.metadata,
                )
            )
            context_parts.append(
                f"[Source: {doc.metadata.get('title', 'KB')}]\n{doc.page_content}"
            )

        context_str = "\n\n---\n\n".join(context_parts) if context_parts else "No relevant context found."

        # 2. Load conversation history
        history = await memory_service.get_langchain_messages(session_id)

        # 3. Build messages for LangChain
        messages = [SystemMessage(content=SYSTEM_PROMPT.format(context=context_str))]

        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))

        messages.append(HumanMessage(content=user_message))

        # 4. Invoke LLM
        llm = self._get_llm()
        response = await llm.ainvoke(messages)
        answer = response.content.strip()

        # 5. Persist to memory
        await memory_service.add_message(session_id, "user", user_message)
        await memory_service.add_message(
            session_id, "assistant", answer,
            sources=[s.title for s in source_docs],
        )

        # 6. Compute confidence and escalation
        confidence = self._compute_confidence(scores)
        escalate = self._should_escalate(user_message, answer)

        elapsed_ms = int(time.time() * 1000) - start_ms

        return ChatResponse(
            session_id=session_id,
            message=answer,
            sources=source_docs,
            confidence=confidence,
            response_time_ms=elapsed_ms,
            escalate_to_agent=escalate,
        )

    async def health_check(self) -> bool:
        try:
            llm = self._get_llm()
            resp = await llm.ainvoke([HumanMessage(content="Say OK")])
            return "ok" in resp.content.lower() or len(resp.content) > 0
        except Exception as e:
            logger.error(f"Gemini health check failed: {e}")
            return False


rag_service = RAGService()

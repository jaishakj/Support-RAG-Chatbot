import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage, HealthStatus } from '../types'
import { chatApi, healthApi, ingestApi } from '../services/api'

interface ChatStore {
  sessionId: string
  messages: ChatMessage[]
  isLoading: boolean
  health: HealthStatus | null
  isIngesting: boolean
  ingestDone: boolean
  error: string | null

  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  checkHealth: () => Promise<void>
  ingestSampleData: () => Promise<void>
  resetSession: () => void
}

const newSessionId = () => uuidv4()

export const useChatStore = create<ChatStore>((set, get) => ({
  sessionId: newSessionId(),
  messages: [],
  isLoading: false,
  health: null,
  isIngesting: false,
  ingestDone: false,
  error: null,

  sendMessage: async (content: string) => {
    const { sessionId, messages } = get()

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    const loadingMsg: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }

    set({ messages: [...messages, userMsg, loadingMsg], isLoading: true, error: null })

    try {
      const response = await chatApi.send({ session_id: sessionId, message: content })

      const assistantMsg: ChatMessage = {
        id: loadingMsg.id,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence,
        responseTimeMs: response.response_time_ms,
        escalateToAgent: response.escalate_to_agent,
        isStreaming: false,
      }

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === loadingMsg.id ? assistantMsg : m
        ),
        isLoading: false,
      }))
    } catch (err: any) {
      const errMsg = err?.response?.data?.detail || 'Something went wrong. Please try again.'
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== loadingMsg.id),
        isLoading: false,
        error: errMsg,
      }))
    }
  },

  clearChat: async () => {
    const { sessionId } = get()
    try {
      await chatApi.clearHistory(sessionId)
    } catch (_) {}
    set({ messages: [], error: null })
  },

  resetSession: () => {
    set({ sessionId: newSessionId(), messages: [], error: null })
  },

  checkHealth: async () => {
    try {
      const health = await healthApi.check()
      set({ health })
    } catch (_) {
      set({ health: { status: 'error', pinecone_connected: false, gemini_connected: false, version: '—' } })
    }
  },

  ingestSampleData: async () => {
    set({ isIngesting: true, error: null })
    try {
      await ingestApi.ingestSample()
      set({ isIngesting: false, ingestDone: true })
    } catch (err: any) {
      set({
        isIngesting: false,
        error: err?.response?.data?.detail || 'Ingest failed',
      })
    }
  },
}))

import axios from 'axios'
import type { ChatRequest, ChatResponse, HealthStatus, IngestResponse } from '../types'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

export const chatApi = {
  send: async (payload: ChatRequest): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>('/chat/', payload)
    return data
  },

  getHistory: async (sessionId: string) => {
    const { data } = await api.get(`/chat/history/${sessionId}`)
    return data
  },

  clearHistory: async (sessionId: string) => {
    const { data } = await api.delete(`/chat/history/${sessionId}`)
    return data
  },
}

export const ingestApi = {
  ingestSample: async (): Promise<IngestResponse> => {
    const { data } = await api.post<IngestResponse>('/ingest/sample')
    return data
  },
}

export const healthApi = {
  check: async (): Promise<HealthStatus> => {
    const { data } = await axios.get<HealthStatus>('/health', { timeout: 5000 })
    return data
  },
}

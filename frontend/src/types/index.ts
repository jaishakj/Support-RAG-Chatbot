export interface SourceDocument {
  title: string
  content: string
  score: number
  metadata: Record<string, string>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: SourceDocument[]
  confidence?: number
  responseTimeMs?: number
  escalateToAgent?: boolean
  isStreaming?: boolean
}

export interface ChatRequest {
  session_id?: string
  message: string
  stream?: boolean
}

export interface ChatResponse {
  session_id: string
  message: string
  sources: SourceDocument[]
  confidence: number
  response_time_ms: number
  escalate_to_agent: boolean
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'error'
  pinecone_connected: boolean
  gemini_connected: boolean
  version: string
}

export interface IngestResponse {
  status: string
  documents_processed: number
  chunks_created: number
  namespace: string
}

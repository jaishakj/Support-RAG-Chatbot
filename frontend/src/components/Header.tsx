import { Cpu, Wifi, WifiOff, RefreshCw, Trash2 } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { clsx } from 'clsx'

export function Header() {
  const { health, clearChat, resetSession, isLoading } = useChatStore()

  const statusColor =
    health?.status === 'healthy'
      ? 'text-success'
      : health?.status === 'degraded'
      ? 'text-warning'
      : 'text-danger'

  return (
    <header className="glass-heavy border-b border-white/5 px-5 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center glow-accent">
            <Cpu size={16} className="text-white" />
          </div>
          {health?.status === 'healthy' && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface-0" />
          )}
        </div>
        <div>
          <h1 className="font-display font-bold text-sm text-white tracking-tight leading-none">
            Support Assistant
          </h1>
          <p className="text-xs text-muted mt-0.5">RAG · Gemini · Pinecone</p>
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center gap-2">
        {/* Health indicator */}
        {health && (
          <div className={clsx('flex items-center gap-1.5 text-xs font-mono', statusColor)}>
            {health.status === 'healthy' ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span className="hidden sm:inline">{health.status}</span>
          </div>
        )}

        <div className="w-px h-4 bg-white/10 mx-1" />

        <button
          onClick={clearChat}
          disabled={isLoading}
          className="btn-ghost text-xs"
          title="Clear messages"
        >
          <Trash2 size={13} />
          <span className="hidden sm:inline">Clear</span>
        </button>

        <button
          onClick={resetSession}
          disabled={isLoading}
          className="btn-ghost text-xs"
          title="New session"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">New session</span>
        </button>
      </div>
    </header>
  )
}

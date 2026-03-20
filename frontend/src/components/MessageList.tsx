import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { useChatStore } from '../store/chatStore'
import { Cpu, Sparkles } from 'lucide-react'

export function MessageList() {
  const { messages, error } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {error && (
        <div className="flex justify-center">
          <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2">
            {error}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center glow-accent">
          <Cpu size={28} className="text-accent" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-surface-0 flex items-center justify-center">
          <Sparkles size={11} className="text-accent" />
        </div>
      </div>

      <h2 className="font-display font-bold text-xl text-white mb-2">
        How can I help you?
      </h2>
      <p className="text-sm text-muted max-w-xs leading-relaxed">
        I'm your AI support agent. Ask me about your account, billing, API, integrations, or troubleshooting.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-2 w-full max-w-sm">
        {[
          { emoji: '🔐', label: 'Account & Security' },
          { emoji: '💳', label: 'Billing & Plans' },
          { emoji: '🔌', label: 'API & Integrations' },
          { emoji: '🛠️', label: 'Troubleshooting' },
        ].map((cat) => (
          <div
            key={cat.label}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-2/50 border border-white/5 text-xs text-muted"
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted/50">
        Load sample docs from the sidebar first if you haven't already.
      </p>
    </div>
  )
}

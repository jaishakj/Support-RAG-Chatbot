import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronDown, ChevronUp, AlertTriangle, Clock, BarChart2, User, Cpu } from 'lucide-react'
import { clsx } from 'clsx'
import type { ChatMessage } from '../types'

interface Props {
  message: ChatMessage
}

export function MessageBubble({ message }: Props) {
  const [showSources, setShowSources] = useState(false)
  const isUser = message.role === 'user'

  const confidenceColor =
    (message.confidence ?? 0) > 0.75
      ? 'text-success'
      : (message.confidence ?? 0) > 0.5
      ? 'text-warning'
      : 'text-danger'

  if (message.isStreaming) {
    return (
      <div className="flex items-start gap-3 animate-fade-up">
        <Avatar isUser={false} />
        <div className="message-assistant rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex items-center gap-1.5 h-5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'flex items-start gap-3 animate-fade-up',
        isUser && 'flex-row-reverse'
      )}
    >
      <Avatar isUser={isUser} />

      <div className={clsx('flex flex-col gap-1.5 max-w-[80%]', isUser && 'items-end')}>
        {/* Bubble */}
        <div
          className={clsx(
            'px-4 py-3 rounded-2xl',
            isUser
              ? 'message-user rounded-tr-sm'
              : 'message-assistant rounded-tl-sm'
          )}
        >
          {isUser ? (
            <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Escalation warning */}
        {message.escalateToAgent && (
          <div className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 border border-warning/20 rounded-lg px-3 py-1.5">
            <AlertTriangle size={12} />
            <span>Connecting you with a human agent may help here</span>
          </div>
        )}

        {/* Metadata row */}
        {!isUser && (message.confidence !== undefined || message.responseTimeMs !== undefined) && (
          <div className="flex items-center gap-3 px-1">
            {message.confidence !== undefined && (
              <div className={clsx('flex items-center gap-1 text-xs font-mono', confidenceColor)}>
                <BarChart2 size={10} />
                <span>{Math.round(message.confidence * 100)}% conf</span>
              </div>
            )}
            {message.responseTimeMs !== undefined && (
              <div className="flex items-center gap-1 text-xs text-muted font-mono">
                <Clock size={10} />
                <span>{message.responseTimeMs}ms</span>
              </div>
            )}
          </div>
        )}

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="px-1">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
            >
              {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              <span>{message.sources.length} source{message.sources.length > 1 ? 's' : ''}</span>
            </button>

            {showSources && (
              <div className="mt-2 space-y-2 animate-fade-up">
                {message.sources.map((src, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/5 bg-surface-2/60 p-3"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-300">{src.title}</span>
                      <span className="source-chip">{Math.round(src.score * 100)}%</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {src.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Avatar({ isUser }: { isUser: boolean }) {
  return (
    <div
      className={clsx(
        'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
        isUser
          ? 'bg-surface-3 border border-white/10'
          : 'bg-accent/20 border border-accent/30'
      )}
    >
      {isUser ? (
        <User size={13} className="text-gray-400" />
      ) : (
        <Cpu size={13} className="text-accent" />
      )}
    </div>
  )
}

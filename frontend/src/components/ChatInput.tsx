import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useChatStore } from '../store/chatStore'

const SUGGESTIONS = [
  'How do I reset my password?',
  'What payment methods do you accept?',
  'How do I connect the Slack integration?',
  'Where can I find my API key?',
  'What are the storage limits per plan?',
]

export function ChatInput() {
  const [value, setValue] = useState('')
  const { sendMessage, isLoading } = useChatStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  const submit = async () => {
    const msg = value.trim()
    if (!msg || isLoading) return
    setValue('')
    await sendMessage(msg)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="glass-heavy border-t border-white/5 p-4 space-y-3">
      {/* Suggestion chips — only show when no messages */}
      <SuggestionChips onSelect={(s) => { setValue(s); textareaRef.current?.focus() }} />

      {/* Input row */}
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything about your account, billing, API..."
            rows={1}
            disabled={isLoading}
            className="
              w-full resize-none rounded-xl bg-surface-2 border border-white/8
              text-sm text-gray-100 placeholder:text-muted
              px-4 py-3 pr-12 leading-relaxed
              focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150
            "
          />
          <div className="absolute right-3 bottom-3 text-xs text-muted/50 font-mono select-none">
            ↵
          </div>
        </div>

        <button
          onClick={submit}
          disabled={isLoading || !value.trim()}
          className="btn-primary h-11 w-11 rounded-xl shrink-0 p-0"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
        </button>
      </div>

      <p className="text-center text-xs text-muted/50">
        Shift+Enter for new line · Enter to send
      </p>
    </div>
  )
}

function SuggestionChips({ onSelect }: { onSelect: (s: string) => void }) {
  const { messages } = useChatStore()
  if (messages.length > 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="
            text-xs px-3 py-1.5 rounded-full border border-white/8
            bg-surface-2 text-muted hover:text-gray-200 hover:border-accent/30
            hover:bg-accent/5 transition-all duration-150
          "
        >
          {s}
        </button>
      ))}
    </div>
  )
}

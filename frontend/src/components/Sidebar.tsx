import { Database, Zap, Box, CheckCircle2, XCircle, Loader2, FileText } from 'lucide-react'
import { clsx } from 'clsx'
import { useChatStore } from '../store/chatStore'

export function Sidebar() {
  const { health, ingestSampleData, isIngesting, ingestDone, messages } = useChatStore()

  const stats = {
    messages: messages.filter((m) => m.role === 'user').length,
    avgConfidence:
      messages
        .filter((m) => m.confidence !== undefined)
        .reduce((acc, m) => acc + (m.confidence ?? 0), 0) /
        Math.max(messages.filter((m) => m.confidence !== undefined).length, 1) || 0,
    avgResponseMs:
      messages
        .filter((m) => m.responseTimeMs !== undefined)
        .reduce((acc, m) => acc + (m.responseTimeMs ?? 0), 0) /
        Math.max(messages.filter((m) => m.responseTimeMs !== undefined).length, 1) || 0,
    escalations: messages.filter((m) => m.escalateToAgent).length,
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-4 py-5 px-4 border-r border-white/5">

      {/* System status */}
      <Section title="System">
        <StatusRow
          label="Gemini 1.5 Pro"
          icon={<Zap size={12} />}
          ok={health?.gemini_connected}
        />
        <StatusRow
          label="Pinecone"
          icon={<Database size={12} />}
          ok={health?.pinecone_connected}
        />
        <StatusRow
          label="API"
          icon={<Box size={12} />}
          ok={health?.status === 'healthy'}
        />
      </Section>

      {/* Knowledge base */}
      <Section title="Knowledge Base">
        <button
          onClick={ingestSampleData}
          disabled={isIngesting || ingestDone}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border',
            ingestDone
              ? 'border-success/30 bg-success/10 text-success cursor-default'
              : 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20'
          )}
        >
          {isIngesting ? (
            <><Loader2 size={12} className="animate-spin" /> Ingesting...</>
          ) : ingestDone ? (
            <><CheckCircle2 size={12} /> Docs loaded</>
          ) : (
            <><FileText size={12} /> Load sample docs</>
          )}
        </button>
        <p className="text-xs text-muted text-center mt-1">8 support docs · ~5k chunks</p>
      </Section>

      {/* Session stats */}
      <Section title="Session Stats">
        <StatRow label="Messages sent" value={stats.messages} />
        <StatRow
          label="Avg confidence"
          value={stats.messages > 0 ? `${Math.round(stats.avgConfidence * 100)}%` : '—'}
          color={
            stats.avgConfidence > 0.75
              ? 'text-success'
              : stats.avgConfidence > 0.5
              ? 'text-warning'
              : undefined
          }
        />
        <StatRow
          label="Avg response"
          value={stats.messages > 0 ? `${Math.round(stats.avgResponseMs)}ms` : '—'}
        />
        <StatRow
          label="Escalations"
          value={stats.escalations}
          color={stats.escalations > 0 ? 'text-warning' : undefined}
        />
      </Section>

      {/* Tech stack */}
      <Section title="Stack">
        {[
          { label: 'LangChain', sub: 'RAG pipeline' },
          { label: 'Pinecone', sub: 'Vector search' },
          { label: 'Gemini 1.5 Pro', sub: 'LLM' },
          { label: 'FastAPI', sub: 'Backend' },
          { label: 'React + Vite', sub: 'Frontend' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs text-gray-300">{item.label}</span>
            <span className="text-xs text-muted">{item.sub}</span>
          </div>
        ))}
      </Section>
    </aside>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h3 className="font-display text-xs font-semibold text-muted uppercase tracking-widest">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function StatusRow({
  label, icon, ok,
}: { label: string; icon: React.ReactNode; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        {icon}
        {label}
      </div>
      {ok === undefined ? (
        <Loader2 size={11} className="animate-spin text-muted" />
      ) : ok ? (
        <CheckCircle2 size={11} className="text-success" />
      ) : (
        <XCircle size={11} className="text-danger" />
      )}
    </div>
  )
}

function StatRow({
  label, value, color,
}: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted">{label}</span>
      <span className={clsx('text-xs font-mono font-medium', color ?? 'text-gray-300')}>
        {value}
      </span>
    </div>
  )
}

import { useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { useChatStore } from './store/chatStore'

export default function App() {
  const { checkHealth } = useChatStore()

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="noise grid-bg min-h-screen flex flex-col bg-surface-0">
      <Header />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
        <Sidebar />

        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <MessageList />
          <ChatInput />
        </main>
      </div>
    </div>
  )
}

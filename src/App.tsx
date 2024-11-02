import React from 'react';
import { Phone, MessageSquare, BarChart3, Users, Brain, Clock, Zap, TrendingUp } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LiveMetrics from './components/LiveMetrics';
import AgentPerformance from './components/AgentPerformance';
import AIInsights from './components/AIInsights';
import RealtimeMonitoring from './components/RealtimeMonitoring';

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <LiveMetrics />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AgentPerformance />
            <AIInsights />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <RealtimeMonitoring />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
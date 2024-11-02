import React from 'react';
import { Zap, Phone, Clock, MessageSquare } from 'lucide-react';

const RealtimeMonitoring = () => {
  const calls = [
    {
      id: 1,
      agent: 'Sarah Johnson',
      customer: 'John Smith',
      duration: '5:23',
      status: 'Active',
      type: 'Technical Support',
      sentiment: 'Positive',
    },
    {
      id: 2,
      agent: 'Michael Chen',
      customer: 'Emma Brown',
      duration: '2:45',
      status: 'Active',
      type: 'Billing',
      sentiment: 'Neutral',
    },
    {
      id: 3,
      agent: 'Emma Davis',
      customer: 'David Wilson',
      duration: '8:12',
      status: 'Active',
      type: 'Product Inquiry',
      sentiment: 'Positive',
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Zap className="text-indigo-600 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Real-time Call Monitoring</h2>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Join Call
          </button>
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200">
            View Analytics
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-4">Agent</th>
              <th className="pb-4">Customer</th>
              <th className="pb-4">Duration</th>
              <th className="pb-4">Type</th>
              <th className="pb-4">Sentiment</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id} className="border-t border-gray-100">
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-2" />
                    <span className="font-medium text-gray-900">{call.agent}</span>
                  </div>
                </td>
                <td className="py-4">{call.customer}</td>
                <td className="py-4">
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-1" />
                    {call.duration}
                  </div>
                </td>
                <td className="py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {call.type}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(call.sentiment)}`}>
                    {call.sentiment}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-500">
                      <Phone size={16} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-500">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealtimeMonitoring;
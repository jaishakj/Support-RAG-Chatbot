import React from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const AIInsights = () => {
  const insights = [
    {
      icon: TrendingUp,
      title: 'Peak Call Time Prediction',
      description: 'Expected surge in calls between 2-4 PM today',
      type: 'info',
    },
    {
      icon: AlertTriangle,
      title: 'Customer Sentiment Alert',
      description: 'Negative sentiment detected in billing inquiries',
      type: 'warning',
    },
    {
      icon: CheckCircle,
      title: 'Agent Performance Insight',
      description: 'Team efficiency improved by 15% this week',
      type: 'success',
    },
  ];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-100 text-orange-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="text-indigo-600 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-700">Refresh</button>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-start">
              <div className={`p-2 rounded-lg ${getTypeStyles(insight.type)}`}>
                <insight.icon size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
import React from 'react';
import { Phone, Clock, Users, TrendingUp } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
        <TrendingUp size={16} className="mr-1" />
        {Math.abs(trend)}%
      </span>
    </div>
    <h3 className="mt-4 text-3xl font-semibold text-gray-900">{value}</h3>
    <p className="text-gray-600 text-sm">{label}</p>
  </div>
);

const LiveMetrics = () => {
  const metrics = [
    {
      icon: Phone,
      label: 'Active Calls',
      value: '24',
      trend: 12,
      color: 'bg-blue-500',
    },
    {
      icon: Clock,
      label: 'Avg. Handle Time',
      value: '3:45',
      trend: -8,
      color: 'bg-purple-500',
    },
    {
      icon: Users,
      label: 'Available Agents',
      value: '18',
      trend: 5,
      color: 'bg-green-500',
    },
    {
      icon: TrendingUp,
      label: 'Customer Satisfaction',
      value: '92%',
      trend: 3,
      color: 'bg-orange-500',
    },
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </>
  );
};

export default LiveMetrics;
import React from 'react';
import { BarChart3 } from 'lucide-react';

const AgentPerformance = () => {
  const agents = [
    { name: 'Sarah Johnson', calls: 45, satisfaction: 98, efficiency: 94 },
    { name: 'Michael Chen', calls: 38, satisfaction: 96, efficiency: 92 },
    { name: 'Emma Davis', calls: 42, satisfaction: 95, efficiency: 90 },
    { name: 'James Wilson', calls: 36, satisfaction: 94, efficiency: 89 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="text-indigo-600 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Agent Performance</h2>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-4">Agent</th>
              <th className="pb-4">Calls Handled</th>
              <th className="pb-4">Satisfaction</th>
              <th className="pb-4">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="py-4">
                  <div className="flex items-center">
                    <img
                      src={`https://images.unsplash.com/photo-${1500 + index}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                      alt={agent.name}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                    <span className="font-medium text-gray-900">{agent.name}</span>
                  </div>
                </td>
                <td className="py-4">{agent.calls}</td>
                <td className="py-4">
                  <div className="flex items-center">
                    <span className="text-green-500">{agent.satisfaction}%</span>
                    <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${agent.satisfaction}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center">
                    <span className="text-blue-500">{agent.efficiency}%</span>
                    <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${agent.efficiency}%` }}
                      />
                    </div>
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

export default AgentPerformance;
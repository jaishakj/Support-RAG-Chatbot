import React from 'react';
import { Home, Phone, MessageSquare, Users, Settings, HelpCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: Phone, label: 'Calls' },
    { icon: MessageSquare, label: 'Chat' },
    { icon: Users, label: 'Agents' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-20 bg-indigo-700 text-white flex flex-col items-center py-8">
      <div className="mb-8">
        <Phone size={32} className="text-white" />
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-6">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button className="p-3 rounded-xl hover:bg-indigo-600 transition-colors duration-200">
                <item.icon size={24} />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-6">
        <button className="p-3 rounded-xl hover:bg-indigo-600 transition-colors duration-200">
          <HelpCircle size={24} />
        </button>
        <button className="p-3 rounded-xl hover:bg-indigo-600 transition-colors duration-200">
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block">
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            {item.icon && <span className="w-5 h-5">{item.icon}</span>}
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
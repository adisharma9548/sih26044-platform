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
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-4.5rem)] sticky top-[4.5rem] overflow-y-auto hidden md:block">
      <p className="px-5 pt-6 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Career workspace</p>
      <nav className="p-3 pt-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#e8f6f4] text-[#087a73]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#073b63]'
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

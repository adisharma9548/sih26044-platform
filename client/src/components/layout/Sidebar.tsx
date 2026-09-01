import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC<{ items: { path: string; label: string; icon?: React.ReactNode }[] }> = ({ items }) => (
  <aside className="w-64 bg-surface border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block flex-shrink-0">
    <nav className="p-4 space-y-1">
      {items.map(item => (
        <NavLink key={item.path} to={item.path} className={({ isActive }) =>
          cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
            isActive ? 'bg-primary-muted text-primary' : 'text-foreground hover:bg-surface-muted'
          )
        }>
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          <span className="text-body-sm font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);
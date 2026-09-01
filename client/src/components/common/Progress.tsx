import React from 'react';
import { cn } from '../../lib/utils';

export const Progress: React.FC<{
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}> = ({ value, max = 100, variant = 'default', className }) => {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const colors = { default: 'bg-primary', success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' };
  return (
    <div className={cn('h-2 bg-surface-muted rounded-full overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all duration-500', colors[variant])} style={{ width: `${pct}%` }} />
    </div>
  );
};
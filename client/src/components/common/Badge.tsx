import React from 'react';
import { cn } from '../../lib/utils';

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}> = ({ children, variant = 'default', size = 'md', className }) => {
  const variants = {
    default: 'bg-surface-muted text-foreground',
    primary: 'bg-primary-muted text-primary',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
    danger: 'bg-danger-bg text-danger',
    info: 'bg-info-bg text-info',
  };
  const sizes = { sm: 'px-2 py-0.5 text-caption', md: 'px-2.5 py-1 text-body-sm' };
  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
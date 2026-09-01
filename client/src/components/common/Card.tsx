import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> =
  ({ children, className, hover = false }) => (
    <div className={cn(
      'bg-surface border border-border rounded-lg p-6 transition-all duration-200',
      hover && 'hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5',
      className
    )}>{children}</div>
  );

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex items-center justify-between pb-4 border-b border-border', className)}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={cn('text-h3 font-semibold', className)}>{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('pt-4', className)}>{children}</div>
);
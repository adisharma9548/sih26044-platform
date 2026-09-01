import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string; variant?: 'text' | 'circle' | 'rect' }> =
  ({ className, variant = 'text' }) => {
    const variants = {
      text: 'h-4 rounded',
      circle: 'rounded-full aspect-square',
      rect: 'rounded-lg',
    };
    return <div className={cn('animate-pulse bg-surface-muted', variants[variant], className)} />;
  };
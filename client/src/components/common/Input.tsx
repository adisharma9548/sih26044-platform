import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
      {label && <label htmlFor={inputId} className="text-body-sm font-medium text-foreground">{label}</label>}
      <input
        id={inputId}
        className={cn(
          'w-full px-3 py-2 bg-surface border rounded-lg text-foreground',
          'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-all duration-150',
          error && 'border-danger focus:ring-danger',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
};
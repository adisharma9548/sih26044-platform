import React from 'react';
import { cn } from '../../lib/utils';

interface Option { value: string; label: string; }
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
      {label && <label htmlFor={selectId} className="text-body-sm font-medium text-foreground">{label}</label>}
      <select
        id={selectId}
        className={cn(
          'w-full px-3 py-2 bg-surface border rounded-lg text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-all duration-150',
          error && 'border-danger focus:ring-danger',
          className
        )}
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
};
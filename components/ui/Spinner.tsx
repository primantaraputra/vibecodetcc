import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'brand' | 'white' | 'slate' | 'civic' | 'amber';
  label?: string;
}

const sizeClasses = {
  xs: 'w-3.5 h-3.5 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

const variantClasses = {
  brand: 'border-brand-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  slate: 'border-slate-600 border-t-transparent',
  civic: 'border-civic-600 border-t-transparent',
  amber: 'border-amber-500 border-t-transparent',
};

export function Spinner({
  size = 'md',
  variant = 'brand',
  label,
  className,
  ...props
}: SpinnerProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)} {...props}>
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {label && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
}

/**
 * Full Page Center Loader for Root Loading
 */
export function PageLoader({
  title = 'Memuat Data SI-BANSOS...',
  description = 'Sinkronisasi data terpadu kesejahteraan sosial sedang berjalan.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center shadow-sm">
          <Spinner size="lg" variant="brand" />
        </div>
        <div className="w-20 h-20 rounded-2xl border-2 border-brand-500/20 animate-ping absolute -top-2 -left-2 pointer-events-none" />
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}

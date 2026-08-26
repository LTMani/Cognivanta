import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate' | 'violet' | 'success' | 'info' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'sm',
  dot = false,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-primary-950/80 text-primary-300 border border-primary-800/50',
    emerald: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50',
    success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50',
    cyan: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50',
    info: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50',
    amber: 'bg-amber-950/80 text-amber-300 border border-amber-800/50',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-800/50',
    rose: 'bg-rose-950/80 text-rose-300 border border-rose-800/50',
    danger: 'bg-rose-950/80 text-rose-300 border border-rose-800/50',
    violet: 'bg-purple-950/80 text-purple-300 border border-purple-800/50',
    slate: 'bg-slate-800/80 text-slate-300 border border-slate-700/50'
  };

  const dotColors = {
    primary: 'bg-primary-400',
    emerald: 'bg-emerald-400',
    success: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    info: 'bg-cyan-400',
    amber: 'bg-amber-400',
    warning: 'bg-amber-400',
    rose: 'bg-rose-400',
    danger: 'bg-rose-400',
    violet: 'bg-purple-400',
    slate: 'bg-slate-400'
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full transition-colors',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
};

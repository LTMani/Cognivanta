import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: 'none' | 'primary' | 'cyan' | 'violet';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  glow = 'none',
  ...props
}) => {
  const glowStyles = {
    none: '',
    primary: 'hover:shadow-glow-primary hover:border-primary-500/40',
    cyan: 'hover:shadow-glow-cyan hover:border-cyan-500/40',
    violet: 'hover:shadow-glow-violet hover:border-accent-violet/40'
  };

  return (
    <div
      className={twMerge(
        clsx(
          'glass-card rounded-xl border border-card-border p-5 text-slate-100 shadow-glow-card transition-all duration-200',
          hoverEffect && 'glass-card-hover cursor-pointer',
          glowStyles[glow],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={twMerge(clsx('flex items-center justify-between pb-4 border-b border-card-border/60', className))} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={twMerge(clsx('text-base font-semibold text-slate-100 tracking-tight', className))} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={twMerge(clsx('text-xs text-slate-400 mt-0.5', className))} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={twMerge(clsx('pt-4', className))} {...props}>
    {children}
  </div>
);

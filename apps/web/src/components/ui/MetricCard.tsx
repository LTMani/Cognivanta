import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  changePeriod?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  statusBadge?: string;
  statusColor?: 'emerald' | 'cyan' | 'amber' | 'primary';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  changePeriod = 'vs last month',
  icon,
  iconBgColor = 'bg-primary-950/80',
  iconColor = 'text-primary-400',
  statusBadge,
  statusColor = 'emerald',
  className
}) => {
  const statusColorMap = {
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/50',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-800/50',
    primary: 'bg-primary-950/80 text-primary-300 border-primary-800/50'
  };

  return (
    <div
      className={twMerge(
        clsx(
          'glass-card p-4 rounded-xl border border-card-border hover:border-card-subtle transition-all duration-200 shadow-glow-card relative overflow-hidden group',
          className
        )
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 tracking-tight">{value}</span>
            {statusBadge && (
              <span className={clsx('text-[11px] px-2 py-0.5 rounded-full border font-medium', statusColorMap[statusColor])}>
                {statusBadge}
              </span>
            )}
          </div>
        </div>
        <div className={clsx('p-2.5 rounded-xl border border-card-border/60 transition-transform group-hover:scale-110 duration-200', iconBgColor, iconColor)}>
          {icon}
        </div>
      </div>

      {change && (
        <div className="mt-3 pt-2.5 border-t border-card-border/40 flex items-center gap-1.5 text-xs">
          {isPositive ? (
            <span className="text-emerald-400 flex items-center font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          ) : (
            <span className="text-rose-400 flex items-center font-medium">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          )}
          <span className="text-slate-500">{changePeriod}</span>
        </div>
      )}
    </div>
  );
};

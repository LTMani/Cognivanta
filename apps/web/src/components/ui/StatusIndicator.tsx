import React from 'react';
import { clsx } from 'clsx';

export interface StatusIndicatorProps {
  status: 'active' | 'running' | 'completed' | 'failed' | 'paused' | 'indexed' | 'queued' | 'error';
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const config = {
    active: { color: 'bg-emerald-400', text: 'text-emerald-400', defaultLabel: 'Active', pulse: true },
    running: { color: 'bg-cyan-400', text: 'text-cyan-400', defaultLabel: 'Running', pulse: true },
    completed: { color: 'bg-emerald-400', text: 'text-emerald-400', defaultLabel: 'Completed', pulse: false },
    indexed: { color: 'bg-emerald-400', text: 'text-emerald-400', defaultLabel: 'Indexed', pulse: false },
    queued: { color: 'bg-amber-400', text: 'text-amber-400', defaultLabel: 'Queued', pulse: true },
    paused: { color: 'bg-slate-400', text: 'text-slate-400', defaultLabel: 'Paused', pulse: false },
    failed: { color: 'bg-rose-400', text: 'text-rose-400', defaultLabel: 'Failed', pulse: false },
    error: { color: 'bg-rose-400', text: 'text-rose-400', defaultLabel: 'Error', pulse: false }
  };

  const item = config[status] || config.active;

  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className="relative flex h-2 w-2">
        {item.pulse && (
          <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', item.color)} />
        )}
        <span className={clsx('relative inline-flex rounded-full h-2 w-2', item.color)} />
      </span>
      <span className={item.text}>{label || item.defaultLabel}</span>
    </div>
  );
};

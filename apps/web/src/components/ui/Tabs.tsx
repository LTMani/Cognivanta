import React from 'react';
import { clsx } from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pills'
}) => {
  return (
    <div
      className={clsx(
        variant === 'pills'
          ? 'inline-flex p-1 bg-surface-200/80 rounded-xl border border-card-border/80'
          : 'flex space-x-6 border-b border-card-border',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'py-3 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 transition-all',
                isActive
                  ? 'border-primary-500 text-primary-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'text-[10px] px-2 py-0.5 rounded-full font-semibold',
                    isActive ? 'bg-primary-500/20 text-primary-300' : 'bg-surface-50 text-slate-400'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-200',
              isActive
                ? 'bg-primary-600 text-white shadow-glow-primary font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-100/60'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-semibold',
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-50 text-slate-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

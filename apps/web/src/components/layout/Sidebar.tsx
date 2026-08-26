import React from 'react';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Network,
  Database,
  BarChart3,
  Cpu,
  KeyRound,
  Sliders,
  ShieldCheck,
  Binary,
  Layers,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';

export type NavigationPage =
  | 'dashboard'
  | 'workspace'
  | 'chat'
  | 'agents'
  | 'workflows'
  | 'knowledge'
  | 'data-intelligence'
  | 'analytics'
  | 'models'
  | 'api'
  | 'settings'
  | 'audit';

export interface SidebarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const navGroups = [
    {
      label: 'CORE PLATFORM',
      items: [
        { id: 'dashboard' as NavigationPage, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'workspace' as NavigationPage, label: 'AI Workspace', icon: Layers },
        { id: 'chat' as NavigationPage, label: 'AI Chat', icon: MessageSquare, badge: 'Live' },
        { id: 'agents' as NavigationPage, label: 'AI Agents', icon: Bot, count: 28 },
        { id: 'workflows' as NavigationPage, label: 'Workflows', icon: Network, count: 12 },
        { id: 'knowledge' as NavigationPage, label: 'Knowledge Hub', icon: Database },
        { id: 'data-intelligence' as NavigationPage, label: 'Data Intelligence', icon: Binary }
      ]
    },
    {
      label: 'MANAGEMENT & GOVERNANCE',
      items: [
        { id: 'analytics' as NavigationPage, label: 'Analytics', icon: BarChart3 },
        { id: 'models' as NavigationPage, label: 'Model Hub', icon: Cpu },
        { id: 'api' as NavigationPage, label: 'API Management', icon: KeyRound },
        { id: 'settings' as NavigationPage, label: 'Settings', icon: Sliders },
        { id: 'audit' as NavigationPage, label: 'Audit Logs', icon: ShieldCheck }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-surface-300 border-r border-card-border flex flex-col shrink-0 h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-card-border/80 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-accent-violet to-accent-cyan flex items-center justify-center shadow-glow-primary">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
            COGNIVANTA
          </h1>
          <p className="text-[10px] text-primary-400 font-medium tracking-wider uppercase">
            Enterprise Intelligence
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={clsx(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-accent-violet text-white shadow-glow-primary font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-surface-100/60'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={clsx(
                        'w-4 h-4 transition-transform group-hover:scale-110 duration-200',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && (
                    <span
                      className={clsx(
                        'text-[10px] px-1.5 py-0.2 rounded-md font-semibold',
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-50 text-slate-400'
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer System Metric */}
      <div className="p-3 border-t border-card-border/80 bg-surface-400/50">
        <div className="glass-card p-3 rounded-xl border border-card-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-300">Cluster Status</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
              99.9% Healthy
            </span>
          </div>
          <div className="w-full bg-surface-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-accent-cyan h-full rounded-full w-[99.9%]" />
          </div>
        </div>
      </div>
    </aside>
  );
};

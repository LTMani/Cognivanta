import React from 'react';
import { Search, Bell, Building2, ChevronDown, Plus, Moon } from 'lucide-react';

export interface TopbarProps {
  onOpenQuickAction?: () => void;
  onOpenSearch?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenQuickAction, onOpenSearch }) => {
  return (
    <header className="h-16 bg-surface-300/80 backdrop-blur-md border-b border-card-border px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Global Search */}
      <div className="w-96">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-surface-200/90 hover:bg-surface-100/90 border border-card-border rounded-xl text-xs text-slate-400 transition-all duration-200 group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-primary-400" />
            <span>Search agents, documents, workflows...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-surface-50 border border-card-border/80 rounded text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Org Switcher, Notifications, Theme, User Avatar */}
      <div className="flex items-center gap-4">
        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAction}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600/20 text-primary-300 border border-primary-500/30 text-xs font-medium hover:bg-primary-600/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Create</span>
        </button>

        {/* Organization Switcher */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-200 border border-card-border rounded-xl text-xs font-medium text-slate-200 cursor-pointer hover:bg-surface-100 transition-colors">
          <Building2 className="w-3.5 h-3.5 text-primary-400" />
          <span>Cognivanta Inc.</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        {/* Notifications Bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-surface-100 rounded-xl transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
        </button>

        {/* Theme Icon */}
        <button className="p-2 text-slate-400 hover:text-slate-100 hover:bg-surface-100 rounded-xl transition-colors">
          <Moon className="w-4 h-4 text-primary-400" />
        </button>

        <div className="h-6 w-px bg-card-border" />

        {/* User Profile matching design ("Tharun Admin") */}
        <div className="flex items-center gap-3 cursor-pointer pl-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-violet flex items-center justify-center font-bold text-white text-xs shadow-glow-primary border border-primary-400/40">
            T
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-100 flex items-center gap-1">
              Tharun
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary-950 text-primary-400 border border-primary-800/40">
                Admin
              </span>
            </div>
            <div className="text-[10px] text-slate-400">tharun@cognivanta.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Sidebar, NavigationPage } from './Sidebar';
import { Topbar } from './Topbar';

export interface AppShellProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ activePage, onNavigate, children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-slate-100 font-sans">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenQuickAction={() => onNavigate('chat')}
        />
        <main className="flex-1 p-6 overflow-y-auto max-w-[1700px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

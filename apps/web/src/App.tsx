import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { NavigationPage } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { AgentsPage } from './pages/AgentsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { DataIntelligencePage } from './pages/DataIntelligencePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ModelHubPage } from './pages/ModelHubPage';
import { APIManagementPage } from './pages/APIManagementPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { NotificationProvider } from './context/NotificationContext';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');

  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'workspace':
        return <WorkspacePage onNavigate={setActivePage} />;
      case 'chat':
        return <ChatPage />;
      case 'agents':
        return <AgentsPage />;
      case 'workflows':
        return <WorkflowsPage />;
      case 'knowledge':
        return <KnowledgePage />;
      case 'data-intelligence':
        return <DataIntelligencePage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'models':
        return <ModelHubPage />;
      case 'api':
        return <APIManagementPage />;
      case 'audit':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <AuthProvider>
      <WorkspaceProvider>
        <NotificationProvider>
          <AppShell activePage={activePage} onNavigate={setActivePage}>
            {renderPageContent()}
          </AppShell>
        </NotificationProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
};

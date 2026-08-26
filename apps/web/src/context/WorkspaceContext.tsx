import React, { createContext, useContext, useState } from 'react';
import { Workspace } from '@cognivanta/core';

export interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  setCurrentWorkspace: (workspace: Workspace) => void;
}

const DEFAULT_WORKSPACE: Workspace = {
  id: 'ws-default-enterprise',
  organizationId: 'org-cognivanta-inc',
  name: 'Default Workspace',
  description: 'Primary workspace for enterprise AI chat, agents, and RAG pipelines.',
  slug: 'default-workspace',
  memberIds: ['usr-tharun-admin'],
  isDefault: true,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-05-20T10:00:00Z'
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces] = useState<Workspace[]>([DEFAULT_WORKSPACE]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(DEFAULT_WORKSPACE);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

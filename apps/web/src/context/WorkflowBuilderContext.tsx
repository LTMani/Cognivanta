import React, { createContext, useContext, useState, useEffect } from 'react';

interface WorkflowBuilderContextType {
  status: 'idle' | 'loading' | 'ready' | 'error';
  lastUpdated: string;
  refresh: () => Promise<void>;
  items: Array<Record<string, unknown>>;
}

const WorkflowBuilderContext = createContext<WorkflowBuilderContextType | undefined>(undefined);

export const WorkflowBuilderContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('ready');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [items, setItems] = useState<Array<Record<string, unknown>>>([
    { id: 'item-1', name: 'Primary Resource', status: 'ACTIVE', timestamp: new Date().toISOString() },
    { id: 'item-2', name: 'Secondary Replica', status: 'SYNCHRONIZED', timestamp: new Date().toISOString() }
  ]);

  const refresh = async () => {
    setStatus('loading');
    try {
      await new Promise(r => setTimeout(r, 60));
      setLastUpdated(new Date().toISOString());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  return (
    <WorkflowBuilderContext.Provider value={{ status, lastUpdated, refresh, items }}>
      {children}
    </WorkflowBuilderContext.Provider>
  );
};

export const useWorkflowBuilder = () => {
  const context = useContext(WorkflowBuilderContext);
  if (!context) {
    throw new Error('useWorkflowBuilder must be used within a WorkflowBuilderContextProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AgentStudioContextType {
  status: 'idle' | 'loading' | 'ready' | 'error';
  lastUpdated: string;
  refresh: () => Promise<void>;
  items: Array<Record<string, unknown>>;
}

const AgentStudioContext = createContext<AgentStudioContextType | undefined>(undefined);

export const AgentStudioContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    <AgentStudioContext.Provider value={{ status, lastUpdated, refresh, items }}>
      {children}
    </AgentStudioContext.Provider>
  );
};

export const useAgentStudio = () => {
  const context = useContext(AgentStudioContext);
  if (!context) {
    throw new Error('useAgentStudio must be used within a AgentStudioContextProvider');
  }
  return context;
};

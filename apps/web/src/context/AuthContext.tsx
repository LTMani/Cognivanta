import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization } from '@cognivanta/core';

export interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const DEFAULT_DEMO_USER: User = {
  id: 'usr-tharun-admin',
  email: 'tharun@cognivanta.com',
  name: 'Tharun',
  avatarUrl: undefined,
  role: 'org_admin',
  organizationId: 'org-cognivanta-inc',
  workspaceIds: ['ws-default-enterprise'],
  preferences: {
    theme: 'dark',
    defaultModel: 'gpt-4o',
    defaultTemperature: 0.7,
    notificationSettings: {
      emailAlerts: true,
      inAppAlerts: true,
      workflowFailures: true,
      agentMilestones: true,
      securityEvents: true
    },
    editorFontSize: 14,
    enableTelemetry: true
  },
  status: 'active',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-05-20T10:30:00Z',
  lastLoginAt: '2024-05-20T10:30:00Z'
};

const DEFAULT_DEMO_ORG: Organization = {
  id: 'org-cognivanta-inc',
  name: 'Cognivanta Inc.',
  slug: 'cognivanta-inc',
  plan: 'enterprise_dedicated',
  ownerId: 'usr-tharun-admin',
  settings: {
    enforceSSO: false,
    allowedDomains: ['cognivanta.com'],
    maxWorkspaces: 20,
    maxUsers: 500,
    allowedProviders: ['mock', 'openai', 'anthropic', 'gemini', 'ollama'],
    monthlyTokenQuota: 100000000,
    monthlyBudgetCapUSD: 10000,
    enablePIIMasking: true,
    retentionDays: 90
  },
  billing: {
    currentPeriodTokensUsed: 84290120,
    currentPeriodCostUSD: 2450.75,
    tierLimitUSD: 10000,
    billingCycleAnchor: '2024-05-01T00:00:00Z',
    paymentMethodStatus: 'active'
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-05-01T00:00:00Z'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_DEMO_USER);
  const [organization, setOrganization] = useState<Organization | null>(DEFAULT_DEMO_ORG);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulated instant session login
    setUser({ ...DEFAULT_DEMO_USER, email, name: email.split('@')[0] });
    setOrganization(DEFAULT_DEMO_ORG);
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

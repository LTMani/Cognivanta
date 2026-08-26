import React from 'react';
import { Layers, Plus, Users, Bot, Database, Network, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { NavigationPage } from '../components/layout/Sidebar';

export const WorkspacePage: React.FC<{ onNavigate: (page: NavigationPage) => void }> = ({ onNavigate }) => {
  const workspaces = [
    {
      id: 'ws-1',
      name: 'Default Workspace',
      description: 'Primary workspace for enterprise AI chat, agents, and RAG pipelines.',
      members: 12,
      agents: 8,
      documents: 1420,
      isDefault: true
    },
    {
      id: 'ws-2',
      name: 'Finance & Risk Intelligence',
      description: 'Dedicated knowledge space and agents for financial reports and compliance audits.',
      members: 5,
      agents: 4,
      documents: 560,
      isDefault: false
    },
    {
      id: 'ws-3',
      name: 'Engineering & DevOps AI',
      description: 'Automated documentation, CI/CD telemetry analysis, and API code generation.',
      members: 8,
      agents: 6,
      documents: 361,
      isDefault: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-400" />
            AI Workspaces
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Segment teams, data assets, autonomous agents, and conversation threads with isolated RBAC boundaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create Workspace
          </Button>
        </div>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {workspaces.map((ws) => (
          <Card key={ws.id} className="flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-primary-950/80 text-primary-400 border border-primary-800/50">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{ws.name}</h3>
                    {ws.isDefault && (
                      <span className="text-[10px] text-cyan-400 font-medium">Default Organization Space</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed">{ws.description}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-surface-200 border border-card-border">
                  <div className="text-[10px] text-slate-400">Members</div>
                  <div className="font-bold text-slate-200 mt-0.5">{ws.members}</div>
                </div>
                <div className="p-2 rounded-lg bg-surface-200 border border-card-border">
                  <div className="text-[10px] text-slate-400">Agents</div>
                  <div className="font-bold text-slate-200 mt-0.5">{ws.agents}</div>
                </div>
                <div className="p-2 rounded-lg bg-surface-200 border border-card-border">
                  <div className="text-[10px] text-slate-400">Documents</div>
                  <div className="font-bold text-slate-200 mt-0.5">{ws.documents}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-card-border/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

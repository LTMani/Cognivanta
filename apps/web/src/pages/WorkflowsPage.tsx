import React, { useState } from 'react';
import {
  Network,
  Play,
  Save,
  Send,
  Plus,
  Clock,
  Sparkles,
  Search,
  Database,
  GitBranch,
  Code,
  Globe,
  CheckCircle2,
  AlertCircle,
  Mail,
  Sliders
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const WorkflowsPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>('node-3');

  const availableNodeTypes = [
    { type: 'trigger', label: 'Trigger', icon: Clock, color: 'text-cyan-400 bg-cyan-950/80 border-cyan-800/60' },
    { type: 'llm', label: 'LLM', icon: Sparkles, color: 'text-primary-400 bg-primary-950/80 border-primary-800/60' },
    { type: 'rag', label: 'RAG Search', icon: Search, color: 'text-accent-violet bg-purple-950/80 border-purple-800/60' },
    { type: 'data', label: 'Data Source', icon: Database, color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60' },
    { type: 'condition', label: 'Condition', icon: GitBranch, color: 'text-amber-400 bg-amber-950/80 border-amber-800/60' },
    { type: 'transform', label: 'Transform', icon: Code, color: 'text-indigo-400 bg-indigo-950/80 border-indigo-800/60' },
    { type: 'api', label: 'API Request', icon: Globe, color: 'text-rose-400 bg-rose-950/80 border-rose-800/60' },
    { type: 'end', label: 'End', icon: CheckCircle2, color: 'text-slate-400 bg-slate-900 border-slate-700' }
  ];

  const handleTestRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 2500);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col rounded-2xl border border-card-border overflow-hidden bg-surface-300 shadow-2xl">
      {/* Workflow Builder Top Bar matching design */}
      <div className="h-14 bg-surface-400 border-b border-card-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-950/90 text-primary-400 border border-primary-800/50">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-100">Market Research Workflow</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Draft
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Triggers every morning at 08:00 UTC</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            isLoading={isRunning}
            onClick={handleTestRun}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Test
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
            Publish
          </Button>
        </div>
      </div>

      {/* Main Canvas & Left Node Drawer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Available Nodes Panel matching design */}
        <div className="w-56 bg-surface-400/90 border-r border-card-border p-4 flex flex-col gap-4 shrink-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nodes</p>
          <div className="space-y-2 overflow-y-auto">
            {availableNodeTypes.map((node, idx) => {
              const Icon = node.icon;
              return (
                <div
                  key={idx}
                  draggable
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-200 hover:bg-surface-100 border border-card-border text-xs text-slate-200 font-medium cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]"
                >
                  <div className={`p-1.5 rounded-lg border ${node.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{node.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Central Visual DAG Canvas */}
        <div className="flex-1 bg-surface-300 relative overflow-auto p-10 flex flex-col items-center select-none">
          {/* Subtle Grid background */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#818cf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Connected DAG Nodes Flow matching design */}
          <div className="flex flex-col items-center space-y-6 w-full max-w-xl z-10">
            {/* Node 1: Trigger */}
            <div className="glass-card w-64 p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/30 flex items-center gap-3 shadow-glow-cyan">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Trigger</div>
                <div className="text-xs font-semibold text-slate-100">Schedule Daily</div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500 to-accent-violet" />

            {/* Node 2: RAG Search */}
            <div className="glass-card w-64 p-3 rounded-xl border border-accent-violet/40 bg-purple-950/30 flex items-center gap-3 shadow-glow-violet">
              <div className="p-2 rounded-lg bg-purple-950 text-accent-violet border border-purple-800">
                <Search className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-accent-violet font-semibold uppercase tracking-wider">RAG Search</div>
                <div className="text-xs font-semibold text-slate-100">Market Reports</div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-accent-violet to-primary-500" />

            {/* Node 3: LLM Analyze */}
            <div
              onClick={() => setActiveNode('node-3')}
              className={`glass-card w-64 p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                activeNode === 'node-3'
                  ? 'border-primary-500 bg-primary-950/40 shadow-glow-primary'
                  : 'border-card-border bg-surface-200'
              }`}
            >
              <div className="p-2 rounded-lg bg-primary-950 text-primary-400 border border-primary-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-primary-400 font-semibold uppercase tracking-wider">LLM</div>
                <div className="text-xs font-semibold text-slate-100">Analyze Trends</div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-primary-500 to-amber-500" />

            {/* Node 4: Condition Branch */}
            <div className="glass-card w-64 p-3 rounded-xl border border-amber-500/40 bg-amber-950/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Condition</div>
                <div className="text-xs font-semibold text-slate-100">Is Data Valid?</div>
              </div>
            </div>

            {/* Branch Split Fork */}
            <div className="w-full flex justify-around pt-2">
              {/* Branch Left: Yes -> Transform */}
              <div className="flex flex-col items-center space-y-4">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  Yes
                </span>
                <div className="glass-card w-48 p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 flex items-center gap-2.5">
                  <Code className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[9px] text-emerald-400 font-semibold">Transform</div>
                    <div className="text-[11px] font-medium text-slate-200 truncate">Format Output</div>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-emerald-500" />
                <div className="px-3 py-1 rounded-lg bg-surface-100 border border-card-border text-[10px] text-slate-400 font-mono">
                  End
                </div>
              </div>

              {/* Branch Right: No -> Email Alert */}
              <div className="flex flex-col items-center space-y-4">
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/40">
                  No
                </span>
                <div className="glass-card w-48 p-2.5 rounded-xl border border-rose-500/40 bg-rose-950/20 flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <div className="text-[9px] text-rose-400 font-semibold">Send Email</div>
                    <div className="text-[11px] font-medium text-slate-200 truncate">Notify Admin</div>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-rose-500" />
                <div className="px-3 py-1 rounded-lg bg-surface-100 border border-card-border text-[10px] text-slate-400 font-mono">
                  End
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="w-72 bg-surface-400/90 border-l border-card-border p-5 flex flex-col gap-4 shrink-0">
          <div className="flex items-center justify-between pb-3 border-b border-card-border/80">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary-400" />
              Node Configuration
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-[10px] font-medium text-slate-400">Node Title</label>
              <input
                type="text"
                readOnly
                value="Analyze Trends"
                className="w-full mt-1 bg-surface-200 border border-card-border rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-slate-400">Selected Model</label>
              <input
                type="text"
                readOnly
                value="GPT-4o (Omni)"
                className="w-full mt-1 bg-surface-200 border border-card-border rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-slate-400">System Prompt</label>
              <textarea
                readOnly
                rows={3}
                value="Synthesize competitor reports and highlight key quarterly delta shifts..."
                className="w-full mt-1 bg-surface-200 border border-card-border rounded-lg p-2 text-slate-300 text-[11px] resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Bot,
  Plus,
  MoreVertical,
  Play,
  Settings,
  Sparkles,
  Search,
  FileText,
  BarChart2,
  Scale,
  Headphones,
  TrendingUp,
  BrainCircuit,
  X
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const AgentsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'shared'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [newAgentInstructions, setNewAgentInstructions] = useState('');

  // Agents list matching View 3 in the design reference
  const [agents, setAgents] = useState([
    {
      id: 'agent-1',
      name: 'Research Assistant',
      description: 'Helps in researching and summarizing topics across enterprise knowledge spaces.',
      status: 'Active',
      usage: 1248,
      icon: Search,
      iconBg: 'bg-primary-950/80',
      iconColor: 'text-primary-400',
      model: 'GPT-4o',
      tools: ['Web Search', 'Document Q&A', 'Summarizer']
    },
    {
      id: 'agent-2',
      name: 'Document Analyst',
      description: 'Extracts insights, tables, and structured entities from PDF, Word, and Excel docs.',
      status: 'Active',
      usage: 982,
      icon: FileText,
      iconBg: 'bg-cyan-950/80',
      iconColor: 'text-cyan-400',
      model: 'Claude 3.5 Sonnet',
      tools: ['OCR Parser', 'Table Extractor', 'Entity Recognizer']
    },
    {
      id: 'agent-3',
      name: 'Data Analyst',
      description: 'Analyzes structured datasets, writes SQL queries, and generates chart insights.',
      status: 'Active',
      usage: 1105,
      icon: BarChart2,
      iconBg: 'bg-emerald-950/80',
      iconColor: 'text-emerald-400',
      model: 'GPT-4o',
      tools: ['SQL Runner', 'Code Sandbox', 'Chart Generator']
    },
    {
      id: 'agent-4',
      name: 'Legal Advisor',
      description: 'Reviews contracts, compliance documents, and identifies risk clauses.',
      status: 'Active',
      usage: 754,
      icon: Scale,
      iconBg: 'bg-purple-950/80',
      iconColor: 'text-accent-violet',
      model: 'Claude 3.5 Sonnet',
      tools: ['Clause Comparator', 'Risk Scorer', 'Audit Trail']
    },
    {
      id: 'agent-5',
      name: 'Customer Support Agent',
      description: 'Handles multi-tier customer queries and drafts context-grounded responses.',
      status: 'Active',
      usage: 1678,
      icon: Headphones,
      iconBg: 'bg-amber-950/80',
      iconColor: 'text-amber-400',
      model: 'GPT-4o',
      tools: ['Ticket Resolver', 'Knowledge Search', 'Sentiment Analysis']
    },
    {
      id: 'agent-6',
      name: 'Market Researcher',
      description: 'Analyzes market trends, competitor intelligence, and synthesized reports.',
      status: 'Active',
      usage: 632,
      icon: TrendingUp,
      iconBg: 'bg-rose-950/80',
      iconColor: 'text-rose-400',
      model: 'Gemini 1.5 Pro',
      tools: ['Trend Scraper', 'Sentiment Engine', 'Report Builder']
    }
  ]);

  const handleCreateAgent = () => {
    if (!newAgentName.trim()) return;

    const newAgent = {
      id: `agent-${Date.now()}`,
      name: newAgentName,
      description: newAgentDesc || 'Custom enterprise autonomous agent.',
      status: 'Active',
      usage: 0,
      icon: BrainCircuit,
      iconBg: 'bg-indigo-950/80',
      iconColor: 'text-indigo-400',
      model: 'GPT-4o',
      tools: ['General Reasoning', 'Knowledge Retrieval']
    };

    setAgents((prev) => [newAgent, ...prev]);
    setIsCreateModalOpen(false);
    setNewAgentName('');
    setNewAgentDesc('');
    setNewAgentInstructions('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary-400" />
            AI Agents
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, configure, and orchestrate autonomous agents powered by custom tools and enterprise memory.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet text-white text-xs font-semibold shadow-glow-primary hover:from-primary-500 hover:to-accent-violet/90 transition-all flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Agent</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-surface-200/90 rounded-xl border border-card-border">
          {(['all', 'my', 'shared'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                activeFilter === tab
                  ? 'bg-primary-600 text-white shadow-glow-primary font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Agents' : tab === 'my' ? 'My Agents' : 'Shared with me'}
            </button>
          ))}
        </div>

        <div className="w-72">
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Agents Grid matching design View 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents
          .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="glass-card p-5 rounded-2xl border border-card-border hover:border-primary-500/40 hover:shadow-glow-card transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl border border-card-border/60 ${agent.iconBg} ${agent.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-primary-300 transition-colors">
                          {agent.name}
                        </h3>
                        <Badge variant="emerald" size="sm" className="mt-1">
                          {agent.status}
                        </Badge>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-surface-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-4 leading-relaxed line-clamp-2">
                    {agent.description}
                  </p>

                  {/* Tools list */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {agent.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-surface-100 border border-card-border text-slate-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer stats and Run button */}
                <div className="mt-5 pt-4 border-t border-card-border/60 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-200">{agent.usage.toLocaleString()}</span> runs
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-card-border text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Config</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-primary-600/30 hover:bg-primary-600/50 border border-primary-500/40 text-xs text-primary-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Create Agent Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New AI Agent"
        description="Configure instructions, capabilities, and tools for autonomous execution."
      >
        <div className="space-y-4">
          <Input
            label="Agent Name"
            placeholder="e.g. Risk Compliance Auditor"
            value={newAgentName}
            onChange={(e) => setNewAgentName(e.target.value)}
          />
          <Input
            label="Description"
            placeholder="Briefly describe what this agent specializes in..."
            value={newAgentDesc}
            onChange={(e) => setNewAgentDesc(e.target.value)}
          />
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">System Instructions (Prompt)</label>
            <textarea
              rows={4}
              value={newAgentInstructions}
              onChange={(e) => setNewAgentInstructions(e.target.value)}
              placeholder="You are an expert enterprise agent. Analyze provided inputs systematically..."
              className="w-full rounded-lg bg-surface-200 border border-card-border px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-card-border/80">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateAgent}>
              Deploy Agent
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

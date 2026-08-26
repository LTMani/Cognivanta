import React from 'react';
import {
  Users,
  MessageSquare,
  FileText,
  Bot,
  DollarSign,
  Activity,
  Network,
  HardDrive,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  FileUp,
  Workflow
} from 'lucide-react';
import { MetricCard } from '../components/ui/MetricCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { NavigationPage } from '../components/layout/Sidebar';

export interface DashboardPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  // Query distribution data
  const queryDistribution = [
    { label: 'AI Chat', percentage: 45, color: 'bg-primary-500' },
    { label: 'RAG Search', percentage: 25, color: 'bg-accent-cyan' },
    { label: 'Agents', percentage: 15, color: 'bg-accent-violet' },
    { label: 'Workflows', percentage: 10, color: 'bg-emerald-500' },
    { label: 'Other', percentage: 5, color: 'bg-amber-500' }
  ];

  // Recent activity stream matching design
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Document "Q1_Financial_Report.pdf" uploaded',
      subtitle: 'Indexed into Finance/Reports knowledge space',
      time: '2 mins ago',
      icon: FileUp,
      iconColor: 'text-accent-cyan bg-cyan-950/80 border-cyan-800/40'
    },
    {
      id: 'act-2',
      title: 'AI Agent "Market Researcher" executed successfully',
      subtitle: 'Processed 48 competitor news feeds with 0 errors',
      time: '15 mins ago',
      icon: Bot,
      iconColor: 'text-primary-400 bg-primary-950/80 border-primary-800/40'
    },
    {
      id: 'act-3',
      title: 'New user "sarah.johnson@cognivanta.com" added',
      subtitle: 'Assigned role "Analyst" with workspace access',
      time: '32 mins ago',
      icon: Users,
      iconColor: 'text-accent-violet bg-purple-950/80 border-purple-800/40'
    },
    {
      id: 'act-4',
      title: 'Workflow "Market Analysis" completed',
      subtitle: 'DAG execution finished in 1.42s across 6 nodes',
      time: '1 hour ago',
      icon: Workflow,
      iconColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/40'
    },
    {
      id: 'act-5',
      title: 'RAG Pipeline "Legal Desk" reindexed',
      subtitle: 'Updated 142 contracts with 1536d dense vectors',
      time: '2 hours ago',
      icon: CheckCircle2,
      iconColor: 'text-amber-400 bg-amber-950/80 border-amber-800/40'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Welcome back, Tharun <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your AI platform today across models, agents, and RAG pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('chat')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet text-white text-xs font-semibold shadow-glow-primary hover:from-primary-500 hover:to-accent-violet/90 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start AI Conversation</span>
          </button>
        </div>
      </div>

      {/* Row 1: Key Metric Cards (Matching design: Total Users, Total Queries, Documents, AI Agents, Cost This Month, System Health, Active Workflows, Storage Used) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value="1,248"
          change="+12.5%"
          isPositive={true}
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-primary-950/90"
          iconColor="text-primary-400"
        />
        <MetricCard
          title="AI Queries"
          value="34,568"
          change="+18.2%"
          isPositive={true}
          icon={<MessageSquare className="w-5 h-5" />}
          iconBgColor="bg-cyan-950/90"
          iconColor="text-cyan-400"
        />
        <MetricCard
          title="Documents"
          value="2,341"
          change="+8.7%"
          isPositive={true}
          icon={<FileText className="w-5 h-5" />}
          iconBgColor="bg-emerald-950/90"
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="AI Agents"
          value="28"
          change="+27.6%"
          isPositive={true}
          icon={<Bot className="w-5 h-5" />}
          iconBgColor="bg-purple-950/90"
          iconColor="text-accent-violet"
        />
      </div>

      {/* Row 2: Secondary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cost This Month"
          value="$2,450.75"
          change="+3.4%"
          isPositive={false}
          icon={<DollarSign className="w-5 h-5" />}
          iconBgColor="bg-amber-950/90"
          iconColor="text-amber-400"
        />
        <MetricCard
          title="System Health"
          value="99.9%"
          statusBadge="Healthy"
          statusColor="emerald"
          icon={<Activity className="w-5 h-5" />}
          iconBgColor="bg-emerald-950/90"
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Active Workflows"
          value="12"
          change="+14.2%"
          isPositive={true}
          icon={<Network className="w-5 h-5" />}
          iconBgColor="bg-blue-950/90"
          iconColor="text-blue-400"
        />
        <MetricCard
          title="Storage Used"
          value="45.6 GB"
          change="+6.4%"
          isPositive={true}
          icon={<HardDrive className="w-5 h-5" />}
          iconBgColor="bg-indigo-950/90"
          iconColor="text-indigo-400"
        />
      </div>

      {/* Main Analytics Grid: Queries Overview Chart, Query Distribution Donut, Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Queries Overview Chart (7 Cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <CardTitle>AI Queries Overview</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Real-time daily query volume across workspaces</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-100 text-slate-300 border border-card-border font-medium">
                Last 7 Days
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Interactive SVG Trend Area Chart */}
            <div className="h-64 w-full relative flex flex-col justify-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
              </div>

              <svg className="w-full h-52 overflow-visible" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="queryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path
                  d="M 20 160 Q 120 120 220 140 T 420 50 T 560 110 T 680 30 L 680 200 L 20 200 Z"
                  fill="url(#queryGrad)"
                />
                {/* Stroke line */}
                <path
                  d="M 20 160 Q 120 120 220 140 T 420 50 T 560 110 T 680 30"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Highlight Point on Peak Day */}
                <circle cx="420" cy="50" r="6" fill="#06b6d4" className="animate-pulse" />
                <circle cx="420" cy="50" r="12" fill="#06b6d4" opacity="0.3" />
              </svg>

              {/* Peak Tooltip marker */}
              <div className="absolute top-4 left-[58%] -translate-x-1/2 bg-surface-100/95 border border-primary-500/50 shadow-glow-primary rounded-xl px-3 py-1.5 text-center">
                <div className="text-[10px] text-slate-400 font-medium">May 17 Peak</div>
                <div className="text-xs font-bold text-cyan-300">7,642 Queries</div>
              </div>

              {/* X-Axis labels */}
              <div className="flex justify-between text-[11px] text-slate-400 pt-3 border-t border-card-border/60">
                <span>May 14</span>
                <span>May 15</span>
                <span>May 16</span>
                <span>May 17</span>
                <span>May 18</span>
                <span>May 19</span>
                <span>May 20</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Query Distribution (5 Cols) */}
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Query Distribution</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">By platform interaction type</p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-around gap-4 my-2">
              {/* Donut Chart representation */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#1c2444" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#6366f1"
                    strokeWidth="12"
                    strokeDasharray="238.7"
                    strokeDashoffset="131.3"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#06b6d4"
                    strokeWidth="12"
                    strokeDasharray="238.7"
                    strokeDashoffset="179"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#8b5cf6"
                    strokeWidth="12"
                    strokeDasharray="238.7"
                    strokeDashoffset="202.9"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold text-white">34,568</span>
                  <span className="text-[10px] text-slate-400">Total</span>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-2.5">
                {queryDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-300 font-medium">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-100">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Recent Platform Activity Stream */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <CardTitle>Recent Activity</CardTitle>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-100 text-slate-400 font-medium">
              Live Feed
            </span>
          </div>
          <button
            onClick={() => onNavigate('audit')}
            className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-card-border/40">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0 group hover:bg-surface-200/40 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2 rounded-xl border ${act.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{act.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-medium">{act.time}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Binary,
  Database,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle,
  HardDrive,
  RefreshCw,
  Plus
} from 'lucide-react';
import { MetricCard } from '../components/ui/MetricCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';

export const DataIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'datasets', label: 'Datasets', count: 56 },
    { id: 'pipelines', label: 'Pipelines', count: 23 },
    { id: 'datasources', label: 'Data Sources', count: 15 }
  ];

  // Top Datasets matching View 6 in the design reference
  const topDatasets = [
    { name: 'Sales_Data', rows: '12.4K rows', type: 'PostgreSQL', status: 'Healthy' },
    { name: 'Customer_Data', rows: '8.7K rows', type: 'Snowflake', status: 'Healthy' },
    { name: 'Financial_Data', rows: '6.2K rows', type: 'S3 Parquet', status: 'Healthy' },
    { name: 'HR_Data', rows: '4.2K rows', type: 'Google BigQuery', status: 'Healthy' },
    { name: 'Support_Tickets', rows: '3.8K rows', type: 'Zendesk API', status: 'Healthy' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Binary className="w-5 h-5 text-primary-400" />
            Data Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage structured datasets, ETL transformations, pipeline health, and data quality metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            New Pipeline
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Metrics Row matching View 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Datasets"
          value="56"
          change="+8.2%"
          isPositive={true}
          icon={<Database className="w-5 h-5" />}
          iconBgColor="bg-cyan-950/80"
          iconColor="text-cyan-400"
        />
        <MetricCard
          title="Data Pipelines"
          value="23"
          change="+12.5%"
          isPositive={true}
          icon={<Layers className="w-5 h-5" />}
          iconBgColor="bg-primary-950/80"
          iconColor="text-primary-400"
        />
        <MetricCard
          title="Data Sources"
          value="15"
          change="+6.7%"
          isPositive={true}
          icon={<HardDrive className="w-5 h-5" />}
          iconBgColor="bg-purple-950/80"
          iconColor="text-accent-violet"
        />
        <MetricCard
          title="Data Quality"
          value="98.6%"
          statusBadge="Good"
          statusColor="emerald"
          icon={<CheckCircle className="w-5 h-5" />}
          iconBgColor="bg-emerald-950/80"
          iconColor="text-emerald-400"
        />
      </div>

      {/* Main Charts Row matching View 6: Data Pipeline Runs + Top Datasets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Data Pipeline Runs Chart (7 Cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <CardTitle>Data Pipeline Runs</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Execution volume across ETL jobs</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-100 text-slate-300 border border-card-border font-medium">
              Last 7 Days
            </span>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-56 w-full relative flex flex-col justify-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
              </div>

              <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 150">
                <defs>
                  <linearGradient id="pipelineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 110 Q 120 70 220 90 T 420 30 T 560 70 T 680 20 L 680 150 L 20 150 Z"
                  fill="url(#pipelineGrad)"
                />
                <path
                  d="M 20 110 Q 120 70 220 90 T 420 30 T 560 70 T 680 20"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

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

        {/* Right: Top Datasets List (5 Cols) */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle>Top Datasets</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Ranked by row size & query access</p>
          </CardHeader>

          <CardContent>
            <div className="divide-y divide-card-border/50">
              {topDatasets.map((ds, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0 hover:bg-surface-200/40 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface-100 border border-card-border text-cyan-400 shrink-0">
                      <Database className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100">{ds.name}</div>
                      <div className="text-[10px] text-slate-400">{ds.type}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-200 font-mono">{ds.rows}</div>
                    <div className="text-[10px] text-emerald-400 font-medium">{ds.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

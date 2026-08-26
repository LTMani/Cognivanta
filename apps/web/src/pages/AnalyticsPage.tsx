import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  DollarSign,
  Clock,
  ChevronDown,
  Download,
  Calendar
} from 'lucide-react';
import { MetricCard } from '../components/ui/MetricCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'usage', label: 'Usage Analytics' },
    { id: 'cost', label: 'Cost Analytics' },
    { id: 'user', label: 'User Analytics' }
  ];

  // Top users by query leaderboard matching View 7 in design reference
  const topUsers = [
    { name: 'Tharun', queries: 4842, avatar: 'T', percentage: 95 },
    { name: 'Sarah Johnson', queries: 3214, avatar: 'S', percentage: 68 },
    { name: 'Michael Brown', queries: 2987, avatar: 'M', percentage: 62 },
    { name: 'Jessica Davis', queries: 2456, avatar: 'J', percentage: 52 },
    { name: 'David Wilson', queries: 1987, avatar: 'D', percentage: 41 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            Analytics & Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, model usage attribution, token consumption, and cost telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-200 border border-card-border rounded-xl text-xs text-slate-300 cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-primary-400" />
            <span>This Month</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* 4 Key Metrics matching View 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Queries"
          value="34,568"
          change="+18.2%"
          isPositive={true}
          icon={<BarChart3 className="w-5 h-5" />}
          iconBgColor="bg-primary-950/80"
          iconColor="text-primary-400"
        />
        <MetricCard
          title="Unique Users"
          value="1,248"
          change="+12.5%"
          isPositive={true}
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-purple-950/80"
          iconColor="text-accent-violet"
        />
        <MetricCard
          title="Total Cost"
          value="$2,450.75"
          change="+3.4%"
          isPositive={false}
          icon={<DollarSign className="w-5 h-5" />}
          iconBgColor="bg-amber-950/80"
          iconColor="text-amber-400"
        />
        <MetricCard
          title="Avg Response Time"
          value="1.24s"
          change="-5.6%"
          isPositive={true}
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-emerald-950/80"
          iconColor="text-emerald-400"
        />
      </div>

      {/* Main Charts Row matching View 7: Queries Over Time Area Chart + Top Users by Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Queries Over Time (7 Cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <CardTitle>Queries Over Time</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">May 1 – May 28 Daily Query Traffic</p>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-64 w-full relative flex flex-col justify-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
              </div>

              {/* Area graph matching the violet/purple wave in design view 7 */}
              <svg className="w-full h-52 overflow-visible" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 170 Q 70 140 120 160 T 200 80 T 280 130 T 360 60 T 440 100 T 520 40 T 600 90 T 690 30 L 690 200 L 10 200 Z"
                  fill="url(#analyticsGrad)"
                />
                <path
                  d="M 10 170 Q 70 140 120 160 T 200 80 T 280 130 T 360 60 T 440 100 T 520 40 T 600 90 T 690 30"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex justify-between text-[11px] text-slate-400 pt-3 border-t border-card-border/60">
                <span>May 1</span>
                <span>May 7</span>
                <span>May 14</span>
                <span>May 21</span>
                <span>May 28</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Users by Queries Leaderboard (5 Cols) */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle>Top Users by Queries</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Highest volume enterprise consumers</p>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-violet text-white text-[10px] font-bold flex items-center justify-center">
                        {user.avatar}
                      </div>
                      <span className="font-semibold text-slate-200">{user.name}</span>
                    </div>
                    <span className="font-bold text-slate-100 font-mono">{user.queries.toLocaleString()}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-surface-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-violet h-full rounded-full"
                      style={{ width: `${user.percentage}%` }}
                    />
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

import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const GuardrailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchFilter, setSearchFilter] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">AI Security Guardrails & Policy Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor prompt injection attacks, automated DLP token redactions, and content toxicity thresholds.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Telemetry
          </Button>
          <Button variant="primary">
            New Operation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Operational Status</span>
          <div className="flex items-center space-x-2 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-lg font-bold text-slate-100">Healthy (99.9%)</span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Verified Events</span>
          <p className="text-xl font-bold text-cyan-400 mt-1">128,490</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Average Latency</span>
          <p className="text-xl font-bold text-purple-400 mt-1">142 ms</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Security Compliance</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">SOC2 Type II</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex space-x-4">
            {['overview', 'records', 'metrics', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold capitalize pb-2 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="w-64">
            <Input
              placeholder="Filter items..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Identifier</th>
                <th className="py-3 px-4">Entity Classification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Confidence / SLA</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[1, 2, 3, 4, 5, 6, 7].map(idx => (
                <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-100">
                    Guardrails Event #${idx}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-400">
                    enterprise.subsystem.event
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={idx % 2 === 0 ? 'success' : 'info'}>
                      {idx % 2 === 0 ? 'Processed' : 'Verified'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-emerald-400">
                    99.9%
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {new Date().toISOString().split('T')[0]}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

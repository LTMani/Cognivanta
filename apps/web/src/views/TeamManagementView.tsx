import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const TeamManagementView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Team & Department Directory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage enterprise department hierarchy, team memberships, and role assignments.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Data
          </Button>
          <Button variant="primary">
            Configure Settings
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search records, parameters, or logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['all', 'active', 'pending', 'archived'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                  selectedFilter === f
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Identifier / Name</th>
                <th className="py-3 px-4">Domain / Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Health / SLA</th>
                <th className="py-3 px-4">Last Modified</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <tr key={idx} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-100">
                    Record Item #${idx}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">
                    enterprise.core.module
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={idx % 2 === 0 ? 'success' : 'info'}>
                      {idx % 2 === 0 ? 'Active' : 'Synchronized'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-mono text-xs">
                    99.9%
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs">
                    {new Date().toISOString().split('T')[0]}
                  </td>
                  <td className="py-3.5 px-4 text-right">
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

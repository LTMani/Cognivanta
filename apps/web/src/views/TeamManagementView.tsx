import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const TeamManagementView: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Enterprise Team & RBAC Permissions</h2>
          <p className="text-xs text-slate-400 mt-1">Enterprise management view for Enterprise Team & RBAC Permissions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button variant="primary" size="sm">Create Entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Operational State</span>
          <p className="text-lg font-bold text-emerald-400 mt-1">Active (100% SLA)</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Tracked Objects</span>
          <p className="text-lg font-bold text-cyan-400 mt-1">1,842</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Security Isolation</span>
          <p className="text-lg font-bold text-purple-400 mt-1">Dedicated Tenant</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-card-border">
          <span className="text-sm font-semibold text-slate-200">Live Telemetry Records</span>
          <div className="w-64">
            <Input
              placeholder="Search records..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-300 uppercase text-slate-400 font-semibold border-b border-card-border">
              <tr>
                <th className="py-2.5 px-3">Resource Identifier</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Verified</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/50">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <tr key={i} className="hover:bg-surface-200/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-100">TeamManagement-item-${i}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">core.system.entity</td>
                  <td className="py-2.5 px-3">
                    <Badge variant={i % 2 === 0 ? 'emerald' : 'cyan'}>
                      {i % 2 === 0 ? 'Operational' : 'Synchronized'}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{new Date().toISOString().split('T')[0]}</td>
                  <td className="py-2.5 px-3 text-right">
                    <Button variant="ghost" size="sm">Inspect</Button>
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

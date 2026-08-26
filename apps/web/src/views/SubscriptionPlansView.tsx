import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const SubscriptionPlansView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">SubscriptionPlans Explorer</h2>
          <p className="text-xs text-slate-400 mt-1">Enterprise management and configuration for SubscriptionPlans.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">Export CSV</Button>
          <Button variant="primary" size="sm">Add Resource</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Status</span>
          <p className="text-lg font-bold text-emerald-400 mt-1">Active (99.99% Uptime)</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Synchronized Units</span>
          <p className="text-lg font-bold text-cyan-400 mt-1">528 Nodes</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Compliance Verification</span>
          <p className="text-lg font-bold text-purple-400 mt-1">SOC2 Type II Passed</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-card-border">
          <span className="text-sm font-semibold text-slate-200">Configured Records</span>
          <div className="w-64">
            <Input
              placeholder="Filter items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-300 uppercase text-slate-400 font-semibold border-b border-card-border">
              <tr>
                <th className="py-2.5 px-3">Item Name</th>
                <th className="py-2.5 px-3">Identifier</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Last Sync</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="hover:bg-surface-200/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-100">SubscriptionPlans-item-${i}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">res-node-${i * 1024}</td>
                  <td className="py-2.5 px-3"><Badge variant="emerald">Healthy</Badge></td>
                  <td className="py-2.5 px-3 text-slate-400">{new Date().toISOString().split('T')[0]}</td>
                  <td className="py-2.5 px-3 text-right">
                    <Button variant="ghost" size="sm">Configure</Button>
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

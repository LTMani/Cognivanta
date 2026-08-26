import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  Shield,
  Clock,
  Activity,
  Code
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const APIManagementPage: React.FC = () => {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const apiKeys = [
    {
      id: 'key-1',
      name: 'Production SDK Backend',
      maskedKey: 'cgv_live_8f3a9e...4b12',
      role: 'Full Access',
      created: 'May 12, 2024',
      lastUsed: '4 mins ago',
      rateLimit: '1,000 req/min'
    },
    {
      id: 'key-2',
      name: 'Customer Portal Webhook',
      maskedKey: 'cgv_live_2c7b1d...9e88',
      role: 'Inference Only',
      created: 'May 02, 2024',
      lastUsed: '1 hour ago',
      rateLimit: '250 req/min'
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary-400" />
            API Management & SDK Access
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate programmatic keys, configure rate limiting, view SDK code examples, and monitor API traffic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create API Key
          </Button>
        </div>
      </div>

      {/* Active API Keys Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Enterprise API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-300 text-slate-400 uppercase text-[10px] border-b border-card-border">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Key Token</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Rate Limit</th>
                  <th className="py-3 px-4">Last Used</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/60">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-surface-200/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{key.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{key.maskedKey}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="cyan">{key.role}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{key.rateLimit}</td>
                    <td className="py-3.5 px-4 text-slate-400">{key.lastUsed}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopy(key.id, key.maskedKey)}
                          className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-slate-300 transition-colors"
                        >
                          {copiedKeyId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/50 text-rose-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

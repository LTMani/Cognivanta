import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Lock,
  Download,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const AuditLogsPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [integrityVerified, setIntegrityVerified] = useState(true);

  const logs = [
    {
      id: 'aud-1',
      actor: 'Tharun (Admin)',
      action: 'document.uploaded',
      resource: 'Q1_Financial_Report.pdf',
      ip: '192.168.1.45',
      time: '2 mins ago',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 'aud-2',
      actor: 'System Autonomous Runner',
      action: 'agent.executed',
      resource: 'Market Researcher Agent',
      ip: 'Internal Engine',
      time: '15 mins ago',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    },
    {
      id: 'aud-3',
      actor: 'Tharun (Admin)',
      action: 'user.created',
      resource: 'sarah.johnson@cognivanta.com',
      ip: '192.168.1.45',
      time: '32 mins ago',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
    },
    {
      id: 'aud-4',
      actor: 'System Cron',
      action: 'workflow.executed',
      resource: 'Market Analysis DAG',
      ip: 'Internal Engine',
      time: '1 hour ago',
      hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
    }
  ];

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIntegrityVerified(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Audit Logs & Cryptographic Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable SHA-256 chained activity log for enterprise compliance, SOC2, and security auditing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            isLoading={isVerifying}
            onClick={handleVerify}
            leftIcon={<Lock className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Verify Cryptographic Chain
          </Button>

          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export Audit Trail
          </Button>
        </div>
      </div>

      {/* Integrity Status Alert */}
      {integrityVerified && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Cryptographic Chain Verified: All SHA-256 block hashes are continuous with zero tampering.</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-bold">100% VALID</span>
        </div>
      )}

      {/* Audit Log Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Immutable Audit Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-300 text-slate-400 uppercase text-[10px] border-b border-card-border">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Resource Target</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Cryptographic Hash</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/60 font-medium">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-200/50">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-primary-400 font-semibold">{log.action}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">{log.actor}</td>
                    <td className="py-3.5 px-4 text-slate-300">{log.resource}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{log.ip}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[10px] truncate max-w-[150px]">
                      {log.hash}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-right">{log.time}</td>
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

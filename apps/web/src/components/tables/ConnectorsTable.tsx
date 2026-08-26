import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ConnectorsTableProps {
  onSelectRow?: (rowId: string) => void;
}

export const ConnectorsTable: React.FC<any> = ({ onSelectRow }) => {
  return (
    <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-900/60">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
          <tr>
            <th className="py-3 px-4">Entity Identifier</th>
            <th className="py-3 px-4">Classification</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Throughput / SLA</th>
            <th className="py-3 px-4">Timestamp</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <tr
              key={idx}
              onClick={() => onSelectRow && onSelectRow(`item-${idx}`)}
              className="hover:bg-slate-850/60 cursor-pointer transition-colors"
            >
              <td className="py-3.5 px-4 font-medium text-slate-100">
                Data Connectors Table Row Item #${idx}
              </td>
              <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">
                enterprise.record
              </td>
              <td className="py-3.5 px-4">
                <Badge variant={idx % 2 === 0 ? 'success' : 'info'}>
                  {idx % 2 === 0 ? 'Active' : 'Synchronized'}
                </Badge>
              </td>
              <td className="py-3.5 px-4 text-cyan-400 font-mono text-xs">
                99.9% (SLA met)
              </td>
              <td className="py-3.5 px-4 text-slate-400 text-xs">
                {new Date().toISOString().split('T')[0]}
              </td>
              <td className="py-3.5 px-4 text-right">
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

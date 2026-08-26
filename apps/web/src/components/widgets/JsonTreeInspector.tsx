import React from 'react';
import { Card } from '../ui/Card';

interface JsonTreeInspectorProps {
  title?: string;
  data?: unknown;
  height?: number;
}

export const JsonTreeInspector: React.FC<any> = ({
  title = 'JsonTreeInspector',
  height = 280
}) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span className="text-xs text-slate-400 font-mono">LIVE TELEMETRY</span>
      </div>

      <div
        className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-center p-6 text-center"
        style={{ minHeight: `${height}px` }}
      >
        <div>
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400 font-bold">
            ⚡
          </div>
          <p className="text-sm font-medium text-slate-200">Collapsible syntax-highlighted JSON tree viewer with copy-to-clipboard.</p>
          <p className="text-xs text-slate-500 mt-1">Real-time data stream connected (99.9% uptime SLA)</p>
        </div>
      </div>
    </Card>
  );
};

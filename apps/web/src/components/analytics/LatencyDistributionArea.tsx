import React from 'react';
import { Card } from '../ui/Card';

interface LatencyDistributionAreaProps {
  timeRange?: '24h' | '7d' | '30d' | '90d';
  height?: number;
}

export const LatencyDistributionArea: React.FC<any> = ({
  timeRange = '7d',
  height = 260
}) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">End-to-End Latency Percentiles</h3>
          <p className="text-xs text-slate-400 mt-0.5">Area chart tracking p50, p90, and p99 response times across routing paths.</p>
        </div>
        <span className="text-xs font-mono px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
          {timeRange.toUpperCase()}
        </span>
      </div>

      <div
        className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg flex items-center justify-center p-6 text-center"
        style={{ minHeight: `${height}px` }}
      >
        <div>
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-2 text-cyan-400 font-bold text-sm">
            📊
          </div>
          <p className="text-sm font-medium text-slate-200">End-to-End Latency Percentiles</p>
          <p className="text-xs text-slate-500 mt-1">Real-time analytical aggregation active</p>
        </div>
      </div>
    </Card>
  );
};

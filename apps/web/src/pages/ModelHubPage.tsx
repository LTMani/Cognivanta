import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Sliders,
  CheckCircle,
  Activity,
  DollarSign,
  Zap,
  Layers,
  Settings,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DEFAULT_MODELS } from '@cognivanta/core';

export const ModelHubPage: React.FC = () => {
  const [models, setModels] = useState(DEFAULT_MODELS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary-400" />
            Model Hub & Provider Gateway
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage LLM providers, load balancing, dynamic fallbacks, latency SLAs, and token rate limits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Connect Custom Model
          </Button>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {models.map((model) => (
          <Card key={model.id} className="flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">{model.displayName}</h3>
                    {model.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-950 text-primary-300 border border-primary-800 font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{model.provider.toUpperCase()} • {model.version}</p>
                </div>
                <Badge variant={model.isAvailable ? 'emerald' : 'slate'} size="sm" dot>
                  {model.isAvailable ? 'Online' : 'Offline'}
                </Badge>
              </div>

              {/* Capabilities & Specs */}
              <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-slate-400">Context Window</span>
                  <span className="font-mono text-slate-100">{model.capabilities.contextWindow.toLocaleString()} tokens</span>
                </div>
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-slate-400">Input Price / 1K</span>
                  <span className="font-mono text-slate-100">${model.pricing.inputPer1kTokensUSD.toFixed(4)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-slate-400">Output Price / 1K</span>
                  <span className="font-mono text-slate-100">${model.pricing.outputPer1kTokensUSD.toFixed(4)}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {model.capabilities.supportsStreaming && <Badge variant="cyan">Streaming</Badge>}
                {model.capabilities.supportsFunctionCalling && <Badge variant="violet">Tools</Badge>}
                {model.capabilities.supportsVision && <Badge variant="emerald">Vision</Badge>}
                {model.capabilities.supportsJSONSchema && <Badge variant="amber">JSON Mode</Badge>}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-card-border/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">ID: {model.id}</span>
              <button className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-card-border text-xs text-slate-300 hover:text-white transition-colors">
                Configure Routing
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

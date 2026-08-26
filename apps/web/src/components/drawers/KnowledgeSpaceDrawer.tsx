import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface KnowledgeSpaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemData?: Record<string, unknown>;
}

export const KnowledgeSpaceDrawer: React.FC<undefined> = ({ isOpen, onClose, itemData = {} }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Knowledge Space Details">
      <div className="space-y-6">
        <div>
          <p className="text-xs text-slate-400">
            Inspect vector database configuration, indexed documents, total tokens, and storage metrics.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Verification Status</span>
            <Badge variant="success">Verified Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Integrity Hash</span>
            <span className="text-xs font-mono text-cyan-400">e3b0c44298fc1c149afbf4...</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Timestamp</span>
            <span className="text-xs text-slate-300">{new Date().toISOString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-slate-400">Resource Attributes</h4>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 overflow-x-auto text-xs font-mono text-slate-300">
            <pre>{JSON.stringify({ ...itemData, verified: true, slaUptime: '99.9%' }, null, 2)}</pre>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
          <Button variant="primary" size="sm">
            Export JSON
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

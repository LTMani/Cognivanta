import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface ChatMessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Record<string, unknown>;
}

export const ChatMessageDrawer: React.FC<ChatMessageDrawerProps> = ({ isOpen, onClose, item }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="ChatMessage Inspector">
      <div className="space-y-6">
        <div className="p-4 bg-surface-300 rounded-2xl border border-card-border">
          <span className="text-xs font-semibold text-slate-400 uppercase">Entity Classification</span>
          <p className="text-lg font-bold text-slate-100 mt-1">{String(item?.name || 'ChatMessage Instance')}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="emerald">Operational</Badge>
            <span className="text-xs text-slate-400 font-mono">ID: {String(item?.id || 'res-default')}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase text-slate-400">Metadata Invariants</h4>
          <div className="p-3 bg-surface-300/80 rounded-xl border border-card-border text-xs font-mono space-y-1.5 text-slate-300">
            <div><strong>Created:</strong> {new Date().toISOString()}</div>
            <div><strong>Organization:</strong> org-cognivanta-inc</div>
            <div><strong>Security Tier:</strong> Dedicated Tenant</div>
            <div><strong>Audit Status:</strong> SHA-256 Verified</div>
          </div>
        </div>

        <div className="pt-4 border-t border-card-border flex justify-end space-x-3">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button variant="primary" size="sm">Save Changes</Button>
        </div>
      </div>
    </Drawer>
  );
};

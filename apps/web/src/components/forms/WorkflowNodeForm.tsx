import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface WorkflowNodeFormProps {
  initialValues?: Record<string, unknown>;
  onSave?: (values: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export const WorkflowNodeForm: React.FC<any> = ({ initialValues = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({
    name: 'Default Configuration',
    enabled: true,
    environment: 'production',
    ...initialValues
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (onSave) onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="border-b border-slate-800 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-100">Workflow Node Inspector</h2>
        <p className="text-xs text-slate-400 mt-1">Form for configuring step inputs, prompt templates, and condition rules.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Configuration Name
          </label>
          <Input
            value={String(formData.name || '')}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Enterprise Production Default"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Environment
            </label>
            <select
              value={String(formData.environment || 'production')}
              onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="production">Production (High SLA)</option>
              <option value="staging">Staging / Test</option>
              <option value="development">Local Development</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Operational Status
            </label>
            <div className="flex items-center space-x-3 mt-2">
              <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.enabled)}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>Active & Enforced</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800">
          {onCancel && (
            <Button variant="ghost" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Applying Changes...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

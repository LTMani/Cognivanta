import React from 'react';
import { Sliders, Shield, Users, Lock, Key, Bell, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-primary-400" />
          Platform & Organization Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage tenant policies, RBAC permissions, PII masking, encryption keys, and notification channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400">Organization Name</label>
              <input
                type="text"
                readOnly
                value="Cognivanta Inc."
                className="w-full mt-1 bg-surface-200 border border-card-border rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400">Organization Slug</label>
              <input
                type="text"
                readOnly
                value="cognivanta-inc"
                className="w-full mt-1 bg-surface-200 border border-card-border rounded-lg px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400">Current Subscription Tier</label>
              <div className="mt-1 flex items-center justify-between p-2.5 rounded-lg bg-surface-100 border border-card-border">
                <span className="font-semibold text-primary-300">Enterprise Dedicated</span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Compliance Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Security & Privacy Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-200 border border-card-border">
              <div>
                <div className="font-semibold text-slate-200">Automated PII Redaction</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Mask emails, credit cards, and SSNs before LLM dispatch</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-primary-500 w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-200 border border-card-border">
              <div>
                <div className="font-semibold text-slate-200">SHA-256 Audit Chaining</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Enforce cryptographic verification on every mutation</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-primary-500 w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-200 border border-card-border">
              <div>
                <div className="font-semibold text-slate-200">Single Sign-On (SAML / Okta)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Enforce enterprise identity provider authentication</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-primary-500 w-4 h-4 cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building, User, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateToLogin, onRegisterSuccess }) => {
  const { login } = useAuth();
  const [orgName, setOrgName] = useState('Acme Global Inc.');
  const [fullName, setFullName] = useState('Tharun');
  const [email, setEmail] = useState('tharun@cognivanta.com');
  const [password, setPassword] = useState('CognivantaSecure#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !email || !password) {
      setErrorMessage('Please complete all required fields.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Please accept the Enterprise Master Services Agreement.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(email);
      if (onRegisterSuccess) onRegisterSuccess();
    } catch {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-500 text-slate-100 p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient background glowing orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-violet/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-surface-400 border border-card-border rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 shadow-glow-primary mb-3">
            <div className="w-full h-full bg-surface-500 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Create Enterprise Tenant
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Deploy Dedicated Cognivanta Instance
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Organization / Company Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Corp Inc."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-300 border border-card-border rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tharun"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-300 border border-card-border rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-300 border border-card-border rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose strong password"
                className="w-full pl-10 pr-10 py-2.5 bg-surface-300 border border-card-border rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-surface-300/80 border border-card-border rounded-xl text-[11px] space-y-1.5 text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Includes 100,000,000 Sandbox Tokens & Dedicated Vector Index</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SOC2 Type II & HIPAA Compliance Enforced</span>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="rounded border-slate-700 bg-surface-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5 mt-0.5"
              />
              <span className="text-xs text-slate-400 leading-relaxed">
                I agree to the Enterprise Master Services Agreement, Data Privacy Addendum, and SLA terms.
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-glow-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Tenant...' : 'Initialize Enterprise Workspace'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </form>

        {/* Footer Toggle to Sign In */}
        <div className="mt-6 pt-5 border-t border-card-border/70 text-center">
          <p className="text-xs text-slate-400">
            Already have an organization account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-primary-400 font-semibold hover:text-primary-300 transition-colors ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

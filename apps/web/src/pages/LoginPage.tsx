import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToRegister, onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('tharun@cognivanta.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your enterprise work email.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(email);
      if (onLoginSuccess) onLoginSuccess();
    } catch {
      setErrorMessage('Invalid credentials or unauthorized SSO session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setIsLoading(true);
    setEmail(demoEmail);
    try {
      await login(demoEmail);
      if (onLoginSuccess) onLoginSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-500 text-slate-100 p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient background glowing orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-violet/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-surface-400 border border-card-border rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 shadow-glow-primary mb-4">
            <div className="w-full h-full bg-surface-500 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Cognivanta
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-widest font-semibold">
            Enterprise AI Intelligence Platform
          </p>
        </div>

        {/* Quick Demo Sign-In Pill */}
        <div className="mb-6 p-3.5 bg-primary-950/40 border border-primary-800/40 rounded-2xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-primary-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
              Instant Sandbox Access
            </span>
            <span className="text-[10px] text-slate-400">One-Click</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('tharun@cognivanta.com')}
              className="px-2.5 py-1.5 bg-surface-300 hover:bg-surface-200 border border-card-border rounded-xl text-[11px] font-medium text-slate-200 transition-colors text-left"
            >
              👑 Tharun (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('analyst@cognivanta.com')}
              className="px-2.5 py-1.5 bg-surface-300 hover:bg-surface-200 border border-card-border rounded-xl text-[11px] font-medium text-slate-200 transition-colors text-left"
            >
              🔬 AI Lead Analyst
            </button>
          </div>
        </div>

        {/* SSO Providers */}
        <div className="space-y-2.5 mb-6">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('tharun@cognivanta.com')}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-surface-300 hover:bg-surface-200 border border-card-border rounded-xl text-xs font-semibold text-slate-200 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            Continue with Enterprise SSO (Google / Okta)
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-card-border w-full" />
          <span className="bg-surface-400 px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
            Or Work Email
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Please contact your organization administrator or use SSO login.'); }} className="text-[11px] text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-surface-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
              />
              <span className="text-xs text-slate-400">Remember this workstation</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-glow-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </form>

        {/* Footer Toggle to Sign Up */}
        <div className="mt-8 pt-6 border-t border-card-border/70 text-center">
          <p className="text-xs text-slate-400">
            Need a dedicated organization workspace?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-primary-400 font-semibold hover:text-primary-300 transition-colors ml-1"
            >
              Sign Up Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

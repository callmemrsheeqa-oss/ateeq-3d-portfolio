import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Lock } from 'lucide-react';

interface AdminLoginProps {
  submitting: boolean;
  authError: string | null;
  onGoogleLogin: () => Promise<boolean>;
  onPasswordLogin: (email: string, password: string) => Promise<boolean>;
}

export function AdminLogin({
  submitting,
  authError,
  onGoogleLogin,
  onPasswordLogin,
}: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onPasswordLogin(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070B18] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#F4F7FF]/12 bg-[#10182B] p-8 shadow-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6B2C9] hover:text-[#00D9FF] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/12 text-[#00D9FF]">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#00D9FF]">
              Private Administration
            </p>
            <h1 className="font-display text-2xl font-bold text-[#F4F7FF]">
              Portfolio Dashboard
            </h1>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#A6B2C9]">
          Sign in with your authorized Google account or use admin credentials created via the
          one-time CLI setup command (<code className="font-mono text-[#F4F7FF]">npm run admin:setup</code>).
        </p>

        {authError && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-400/35 bg-rose-500/10 p-3.5 text-xs text-rose-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
            <span>{authError}</span>
          </div>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={onGoogleLogin}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#00D9FF]/45 bg-[#070B18] px-4 py-3 text-sm font-semibold text-[#F4F7FF] hover:border-[#00D9FF] hover:bg-[#0B1226] disabled:opacity-60 cursor-pointer transition-colors"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#00D9FF]" aria-hidden="true" />
          ) : (
            <span className="font-mono text-sm font-bold text-[#00D9FF]">G</span>
          )}
          <span>Sign in with Authorized Google Account</span>
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#F4F7FF]/12" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#A6B2C9]">
            OR PASSWORD LOGIN
          </span>
          <div className="h-px flex-1 bg-[#F4F7FF]/12" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium text-[#F4F7FF]">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1.5 w-full rounded-lg border border-[#F4F7FF]/15 bg-[#070B18] px-3.5 py-2.5 text-sm text-[#F4F7FF] placeholder-[#A6B2C9]/45 focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-medium text-[#F4F7FF]">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-lg border border-[#F4F7FF]/15 bg-[#070B18] px-3.5 py-2.5 text-sm text-[#F4F7FF] placeholder-[#A6B2C9]/45 focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D9FF] px-4 py-3 text-sm font-semibold text-[#070B18] hover:bg-[#3CE4FF] disabled:opacity-60 cursor-pointer transition-colors"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            )}
            <span>Sign in to Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
}

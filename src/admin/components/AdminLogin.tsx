import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Lock } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

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
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-4 py-12 text-[var(--text-primary)]">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-[var(--panel-shadow)]">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent-ink)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Portfolio</span>
          </Link>
          <ThemeToggle compact />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-accent)] bg-[var(--accent-primary)]/12 text-[var(--accent-ink)]">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-ink)]">
              Private Administration
            </p>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Portfolio Dashboard
            </h1>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)]">
          Sign in with your authorized Google account or use admin credentials created via the
          one-time CLI setup command (
          <code className="font-mono text-[var(--text-primary)]">npm run admin:setup</code>).
        </p>

        {authError && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-200">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400"
              aria-hidden="true"
            />
            <span>{authError}</span>
          </div>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={onGoogleLogin}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--border-accent)] bg-[var(--bg-base)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-60 cursor-pointer transition-colors"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-[var(--accent-ink)]" aria-hidden="true" />
          ) : (
            <span className="font-mono text-sm font-bold text-[var(--accent-ink)]">G</span>
          )}
          <span>Sign in with Authorized Google Account</span>
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
            OR PASSWORD LOGIN
          </span>
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-medium text-[var(--text-primary)]"
            >
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
              className="mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/55 focus:border-[var(--accent-ink)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-[var(--text-primary)]"
            >
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
              className="mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/55 focus:border-[var(--accent-ink)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] px-4 py-3 text-sm font-semibold text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-60 cursor-pointer transition-colors shadow-[0_8px_22px_var(--glow-primary)]"
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

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  Send,
} from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { usePortfolio } from '../context/PortfolioContext';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

type SubmitStatus =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'success'; message: string; emailDelivered: boolean; mailtoDraft: string }
  | { state: 'error'; code?: string; message: string; fields?: Record<string, string> };

export function Contact() {
  const { portfolio } = usePortfolio();
  const { profile, socialLinks } = portfolio;
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: initialSubject,
    message: '',
    website: '',
  });
  const [status, setStatus] = useState<SubmitStatus>({ state: 'idle' });
  const [smtpConfigured, setSmtpConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    if (initialSubject) {
      setForm((prev) => ({ ...prev, subject: initialSubject }));
    }
  }, [initialSubject]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setSmtpConfigured(Boolean(data?.smtpConfigured));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSmtpConfigured(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const buildMailtoHref = (f: FormState) =>
    `mailto:${profile.email}?subject=${encodeURIComponent(
      f.subject || 'Portfolio Enquiry',
    )}&body=${encodeURIComponent(`Name: ${f.name}\nEmail: ${f.email}\n\n${f.message}`)}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ state: 'loading' });

    const draftBeforeClear = buildMailtoHref(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.ok) {
        const emailDelivered = Boolean(data?.emailDelivered);
        setStatus({
          state: 'success',
          emailDelivered,
          mailtoDraft: draftBeforeClear,
          message:
            data.message ||
            (emailDelivered
              ? 'Your message has been saved and emailed successfully.'
              : 'Your message has been saved to Ateeq’s portfolio inbox.'),
        });
        setForm({ name: '', email: '', subject: '', message: '', website: '' });
        return;
      }

      setStatus({
        state: 'error',
        code: data?.code,
        message:
          data?.error ||
          'Could not send your message right now. Please try again or use direct email.',
        fields: data?.fields,
      });
    } catch {
      setStatus({
        state: 'error',
        code: 'NETWORK_ERROR',
        message: `Unable to reach the contact API server. Please check your connection or email ${profile.email} directly.`,
      });
    }
  };

  const mailtoHref = buildMailtoHref(form);

  return (
    <>
      <PageMeta
        title="Contact"
        description="Get in touch with Ateeq Ur Rehman for software collaboration, mathematics tuition enquiries, or academic exchange."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <header>
          <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">CONTACT</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Let’s connect.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            Open to conversations about mathematics, machine learning projects, web development,
            student collaborations, or Class 1–12 mathematics tuition.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* Contact Channels */}
          <div className="space-y-4 lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6">
              <p className="font-mono text-xs text-[var(--accent-ink)]">DIRECT CHANNELS</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                Reach out where it suits you.
              </h2>

              <ul className="mt-6 space-y-3">
                {socialLinks.map((channel) => (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      target={channel.external ? '_blank' : undefined}
                      rel={channel.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3.5 hover:border-[var(--border-accent)] hover:bg-[var(--bg-surface-hover)] transition-colors"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--accent-ink)]">
                          {channel.platformKey === 'email' && (
                            <Mail className="h-4 w-4" aria-hidden="true" />
                          )}
                          {channel.platformKey === 'github' && (
                            <Github className="h-4 w-4" aria-hidden="true" />
                          )}
                          {channel.platformKey === 'linkedin' && (
                            <Linkedin className="h-4 w-4" aria-hidden="true" />
                          )}
                          {channel.platformKey === 'instagram' && (
                            <Instagram className="h-4 w-4" aria-hidden="true" />
                          )}
                          {channel.platformKey === 'facebook' && (
                            <span className="font-mono text-xs font-bold">f</span>
                          )}
                          {!['email', 'github', 'linkedin', 'instagram', 'facebook'].includes(
                            channel.platformKey,
                          ) && <Globe className="h-4 w-4" aria-hidden="true" />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {channel.label}
                          </p>
                          <p className="truncate text-xs text-[var(--text-secondary)]">
                            {channel.handle}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-[var(--text-secondary)]"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Real Backend Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-[var(--accent-secondary-ink)]">
                    SEND A MESSAGE
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                    Direct Enquiry Form
                  </h2>
                </div>
                {smtpConfigured === false && (
                  <p className="font-mono text-xs text-[var(--text-secondary)]">
                    Inbox persistence active · Direct mail fallback ready
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                {/* Honeypot field hidden from human users */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-[var(--text-primary)]"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="mt-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/55 focus:border-[var(--accent-ink)] focus:outline-none"
                    />
                    {status.state === 'error' && status.fields?.name && (
                      <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                        {status.fields.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-[var(--text-primary)]"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      maxLength={160}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/55 focus:border-[var(--accent-ink)] focus:outline-none"
                    />
                    {status.state === 'error' && status.fields?.email && (
                      <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                        {status.fields.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-medium text-[var(--text-primary)]"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    minLength={3}
                    maxLength={150}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Collaboration, project question, or mathematics tuition"
                    className="mt-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/55 focus:border-[var(--accent-ink)] focus:outline-none"
                  />
                  {status.state === 'error' && status.fields?.subject && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                      {status.fields.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-[var(--text-primary)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    minLength={10}
                    maxLength={4000}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Share a brief overview of what you have in mind..."
                    className="mt-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/55 focus:border-[var(--accent-ink)] focus:outline-none"
                  />
                  {status.state === 'error' && status.fields?.message && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                      {status.fields.message}
                    </p>
                  )}
                </div>

                {/* Live status feedback */}
                <div aria-live="polite">
                  {status.state === 'success' && (
                    <div
                      className={`space-y-3 rounded-xl border p-4 text-sm ${
                        status.emailDelivered
                          ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                          : 'border-[var(--border-accent)] bg-[var(--bg-surface-hover)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            status.emailDelivered
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-[var(--accent-ink)]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{status.message}</span>
                      </div>
                      {!status.emailDelivered && (
                        <a
                          href={status.mailtoDraft}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--accent-ink)] hover:border-[var(--border-accent)]"
                        >
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Also Send via Email App</span>
                        </a>
                      )}
                    </div>
                  )}

                  {status.state === 'error' && (
                    <div className="space-y-3 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-800 dark:text-rose-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400"
                          aria-hidden="true"
                        />
                        <span>{status.message}</span>
                      </div>
                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--accent-ink)] hover:border-[var(--border-accent)]"
                      >
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Open Pre-filled Email Draft</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={status.state === 'loading'}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0 shadow-[0_8px_22px_var(--glow-primary)]"
                  >
                    {status.state === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  <a
                    href={mailtoHref}
                    className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent-ink)] transition-colors"
                  >
                    Or compose in your email app ↗
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

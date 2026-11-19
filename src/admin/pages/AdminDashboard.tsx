import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Briefcase,
  Compass,
  Cpu,
  ExternalLink,
  FileText,
  FolderKanban,
  GraduationCap,
  History,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Share2,
  Sparkles,
  User,
} from 'lucide-react';
import { PageMeta } from '../../components/layout/PageMeta';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminLogin } from '../components/AdminLogin';
import {
  AwardsCertificatesPanel,
  CvManagerPanel,
  GalleryAndPhotoPanel,
  SocialsMessagesAiPanel,
} from '../components/MediaAndCredentialPanels';
import {
  AcademicPanels,
  ProfileSettingsPanel,
  ProjectsPanel,
} from '../components/PortfolioCrudPanels';
import { useAdminAuth } from '../hooks/useAdminAuth';

type AdminTab =
  | 'overview'
  | 'profile'
  | 'projects'
  | 'skills'
  | 'educations'
  | 'experiences'
  | 'learning'
  | 'journey'
  | 'teachings'
  | 'cv'
  | 'gallery'
  | 'awards'
  | 'socials'
  | 'messages'
  | 'ai';

interface OverviewResponse {
  counts: {
    projects: number;
    skills: number;
    educations: number;
    experiences: number;
    teachings: number;
    learningItems?: number;
    journeyMilestones?: number;
    awards: number;
    certificates: number;
    gallery: number;
    unreadMessages: number;
    totalMessages: number;
    aiKnowledge: number;
  };
  activeCv: { originalFilename: string; fileSize: number } | null;
}

const TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile & Muavin', icon: User },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'educations', label: 'Education', icon: GraduationCap },
  { id: 'experiences', label: 'Experience', icon: Briefcase },
  { id: 'learning', label: 'Learning', icon: Compass },
  { id: 'journey', label: 'Journey', icon: History },
  { id: 'teachings', label: 'Teaching', icon: BookOpen },
  { id: 'cv', label: 'CV PDF', icon: FileText },
  { id: 'gallery', label: 'Gallery & Photo', icon: ImageIcon },
  { id: 'awards', label: 'Awards & Certs', icon: Award },
  { id: 'socials', label: 'Social Links', icon: Share2 },
  { id: 'messages', label: 'Inbox', icon: Inbox },
  { id: 'ai', label: 'AI Knowledge', icon: Sparkles },
];

export function AdminDashboard() {
  const { admin, checking, submitting, authError, signInWithGoogle, signInWithPassword, logout } =
    useAdminAuth();
  const { portfolio, refreshPortfolio } = usePortfolio();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const notify = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const loadOverview = useCallback(async () => {
    const res = await fetch('/api/admin/overview', { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok) {
      setOverview({ counts: data.counts, activeCv: data.activeCv });
    }
  }, []);

  useEffect(() => {
    if (admin) {
      loadOverview();
    }
  }, [admin, loadOverview]);

  const handleSaved = useCallback(async () => {
    await Promise.all([refreshPortfolio(), loadOverview()]);
  }, [refreshPortfolio, loadOverview]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] text-[var(--text-secondary)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-ink)]" />
      </div>
    );
  }

  if (!admin) {
    return (
      <>
        <PageMeta title="Admin Sign In" description="Portfolio Administration Portal" />
        <AdminLogin
          submitting={submitting}
          authError={authError}
          onGoogleLogin={signInWithGoogle}
          onPasswordLogin={signInWithPassword}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <PageMeta title="Admin Dashboard" description="Manage Ateeq Ur Rehman portfolio data" />

      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/95 backdrop-blur-md px-4 py-3.5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold text-[var(--text-primary)]">
              Portfolio Admin
            </span>
            <span className="hidden font-mono text-xs text-[var(--accent-ink)] sm:inline">
              · {admin.email}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle compact />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/35 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-700 dark:text-rose-200 hover:bg-rose-500/20 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav
            aria-label="Dashboard sections"
            className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-1"
          >
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)] font-semibold'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-accent)]'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{t.label}</span>
                  </span>
                  {t.id === 'messages' && overview && overview.counts.unreadMessages > 0 && (
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        active ? 'text-[var(--accent-on-primary)]' : 'text-[var(--accent-ink)]'
                      }`}
                    >
                      {overview.counts.unreadMessages}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Workspace */}
        <main className="lg:col-span-9 space-y-6">
          {toast && (
            <div
              role="status"
              className={`rounded-xl border px-4 py-3 text-xs font-medium ${
                toast.type === 'success'
                  ? 'border-emerald-500/35 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200'
                  : 'border-rose-500/35 bg-rose-500/15 text-rose-800 dark:text-rose-200'
              }`}
            >
              {toast.text}
            </div>
          )}

          {tab === 'overview' && overview && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  Welcome, {admin.displayName}
                </h1>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Manage every section of your portfolio, Learning &amp; Journey items, CV,
                  gallery, credentials, inbox, and Muavin AI directly from PostgreSQL.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Projects', val: overview.counts.projects, go: 'projects' as AdminTab },
                  {
                    label: 'Learning Items',
                    val: overview.counts.learningItems ?? portfolio.learningItems.length,
                    go: 'learning' as AdminTab,
                  },
                  {
                    label: 'Journey Milestones',
                    val: overview.counts.journeyMilestones ?? portfolio.journeyMilestones.length,
                    go: 'journey' as AdminTab,
                  },
                  {
                    label: 'Gallery Photos',
                    val: overview.counts.gallery,
                    go: 'gallery' as AdminTab,
                  },
                  {
                    label: 'Awards & Certs',
                    val: overview.counts.awards + overview.counts.certificates,
                    go: 'awards' as AdminTab,
                  },
                  {
                    label: 'Unread Messages',
                    val: overview.counts.unreadMessages,
                    go: 'messages' as AdminTab,
                  },
                ].map((stat) => (
                  <button
                    key={stat.label}
                    type="button"
                    onClick={() => setTab(stat.go)}
                    className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-left hover:border-[var(--border-accent)] transition-colors cursor-pointer shadow-[var(--panel-shadow)]"
                  >
                    <p className="font-mono text-xs text-[var(--text-secondary)]">{stat.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold tabular-nums text-[var(--accent-ink)]">
                      {stat.val}
                    </p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 flex flex-wrap items-center justify-between gap-4 shadow-[var(--panel-shadow)]">
                <div>
                  <p className="font-mono text-xs text-[var(--accent-ink)]">CV DOCUMENT STATUS</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                    {overview.activeCv
                      ? `Active: ${overview.activeCv.originalFilename}`
                      : 'No PDF CV uploaded yet — upload one to enable direct public downloads.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab('cv')}
                  className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] cursor-pointer transition-colors"
                >
                  Manage CV
                </button>
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <ProfileSettingsPanel
              profile={portfolio.profile}
              settings={portfolio.settings}
              onSaved={handleSaved}
              notify={notify}
            />
          )}

          {tab === 'projects' && <ProjectsPanel onSaved={handleSaved} notify={notify} />}

          {(tab === 'skills' ||
            tab === 'educations' ||
            tab === 'experiences' ||
            tab === 'learning' ||
            tab === 'journey' ||
            tab === 'teachings') && (
            <AcademicPanels section={tab} onSaved={handleSaved} notify={notify} />
          )}

          {tab === 'cv' && <CvManagerPanel onSaved={handleSaved} notify={notify} />}

          {tab === 'gallery' && (
            <GalleryAndPhotoPanel
              currentAvatarUrl={portfolio.profile.avatarUrl}
              onSaved={handleSaved}
              notify={notify}
            />
          )}

          {tab === 'awards' && (
            <AwardsCertificatesPanel onSaved={handleSaved} notify={notify} />
          )}

          {tab === 'socials' && (
            <SocialsMessagesAiPanel section="socials" onSaved={handleSaved} notify={notify} />
          )}

          {tab === 'messages' && (
            <SocialsMessagesAiPanel section="messages" onSaved={handleSaved} notify={notify} />
          )}

          {tab === 'ai' && (
            <SocialsMessagesAiPanel section="ai-knowledge" onSaved={handleSaved} notify={notify} />
          )}
        </main>
      </div>
    </div>
  );
}

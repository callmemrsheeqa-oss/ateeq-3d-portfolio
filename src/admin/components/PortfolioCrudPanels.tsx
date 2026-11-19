import { useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Save, Star, Trash2, X } from 'lucide-react';
import type {
  EducationRecord,
  ExperienceRecord,
  JourneyMilestoneRecord,
  LearningItemRecord,
  ProfileRecord,
  ProjectRecord,
  SiteSettingsRecord,
  SkillRecord,
  TeachingRecord,
} from '../../types/portfolio';

export type NotifyFn = (type: 'success' | 'error', text: string) => void;

const INPUT_CLASS =
  'mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/55 focus:border-[var(--accent-ink)] focus:outline-none';

const CARD_CLASS =
  'rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--panel-shadow)]';

const PRIMARY_BTN_CLASS =
  'inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 cursor-pointer transition-colors';

/* ==================== PROFILE & SETTINGS PANEL ==================== */
export function ProfileSettingsPanel({
  profile,
  settings,
  onSaved,
  notify,
}: {
  profile: ProfileRecord;
  settings: SiteSettingsRecord;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [pForm, setPForm] = useState({
    ...profile,
    rotatingRolesText: profile.rotatingRoles.join(', '),
    aboutStoryText: profile.aboutStory.join('\n\n'),
  });
  const [sForm, setSForm] = useState({
    ...settings,
    muavinSuggestedQuestionsText: (settings.muavinSuggestedQuestions || []).join('\n'),
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setPForm({
      ...profile,
      rotatingRolesText: profile.rotatingRoles.join(', '),
      aboutStoryText: profile.aboutStory.join('\n\n'),
    });
  }, [profile]);

  useEffect(() => {
    setSForm({
      ...settings,
      muavinSuggestedQuestionsText: (settings.muavinSuggestedQuestions || []).join('\n'),
    });
  }, [settings]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...pForm,
          rotatingRoles: pForm.rotatingRolesText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          aboutStory: pForm.aboutStoryText
            .split(/\n\s*\n/)
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        notify('error', data?.error || 'Failed to update profile.');
        return;
      }
      await onSaved();
      notify('success', 'Profile saved to PostgreSQL.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const suggestedQuestions = sForm.muavinSuggestedQuestionsText
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...sForm,
          muavinSuggestedQuestions: suggestedQuestions,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        notify('error', data?.error || 'Failed to update site settings.');
        return;
      }
      await onSaved();
      notify('success', 'Site & Muavin AI settings saved.');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSaveProfile} className={`${CARD_CLASS} space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
              Profile Information
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Public identity, hero rotating roles, academic headline, and story paragraphs.
            </p>
          </div>
          <button type="submit" disabled={savingProfile} className={PRIMARY_BTN_CLASS}>
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs text-[var(--text-secondary)]">
            Full Name
            <input
              className={INPUT_CLASS}
              value={pForm.name}
              onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
            />
          </label>
          <label className="text-xs text-[var(--text-secondary)]">
            Initials
            <input
              className={INPUT_CLASS}
              maxLength={4}
              value={pForm.initials}
              onChange={(e) => setPForm({ ...pForm, initials: e.target.value })}
            />
          </label>
          <label className="text-xs text-[var(--text-secondary)]">
            Email
            <input
              className={INPUT_CLASS}
              type="email"
              value={pForm.email}
              onChange={(e) => setPForm({ ...pForm, email: e.target.value })}
            />
          </label>
          <label className="text-xs text-[var(--text-secondary)]">
            Location
            <input
              className={INPUT_CLASS}
              value={pForm.location}
              onChange={(e) => setPForm({ ...pForm, location: e.target.value })}
            />
          </label>
          <label className="text-xs text-[var(--text-secondary)]">
            Coordinates
            <input
              className={INPUT_CLASS}
              value={pForm.coordinates}
              onChange={(e) => setPForm({ ...pForm, coordinates: e.target.value })}
            />
          </label>
          <label className="text-xs text-[var(--text-secondary)]">
            Degree / Semester
            <input
              className={INPUT_CLASS}
              value={pForm.semester}
              onChange={(e) => setPForm({ ...pForm, semester: e.target.value })}
            />
          </label>
        </div>

        <label className="block text-xs text-[var(--text-secondary)]">
          Hero Tagline
          <textarea
            rows={2}
            className={INPUT_CLASS}
            value={pForm.tagline}
            onChange={(e) => setPForm({ ...pForm, tagline: e.target.value })}
          />
        </label>

        <label className="block text-xs text-[var(--text-secondary)]">
          Rotating Roles (comma-separated)
          <input
            className={INPUT_CLASS}
            value={pForm.rotatingRolesText}
            onChange={(e) => setPForm({ ...pForm, rotatingRolesText: e.target.value })}
          />
        </label>

        <label className="block text-xs text-[var(--text-secondary)]">
          Philosophy Quote
          <input
            className={INPUT_CLASS}
            value={pForm.philosophyQuote}
            onChange={(e) => setPForm({ ...pForm, philosophyQuote: e.target.value })}
          />
        </label>

        <label className="block text-xs text-[var(--text-secondary)]">
          About Story (separate paragraphs with a blank line)
          <textarea
            rows={5}
            className={INPUT_CLASS}
            value={pForm.aboutStoryText}
            onChange={(e) => setPForm({ ...pForm, aboutStoryText: e.target.value })}
          />
        </label>
      </form>

      <form onSubmit={handleSaveSettings} className={`${CARD_CLASS} space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
              Teaching Overview &amp; Muavin AI Settings
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Control site-wide labels, teaching metadata, and persistent Muavin AI quick
              questions.
            </p>
          </div>
          <button type="submit" disabled={savingSettings} className={PRIMARY_BTN_CLASS}>
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-[var(--text-secondary)]">
            Teaching Headline
            <input
              className={INPUT_CLASS}
              value={sForm.teachingHeadline}
              onChange={(e) => setSForm({ ...sForm, teachingHeadline: e.target.value })}
            />
          </label>
          <label className="text-xs text-[var(--text-secondary)]">
            Audience Range
            <input
              className={INPUT_CLASS}
              value={sForm.teachingAudience}
              onChange={(e) => setSForm({ ...sForm, teachingAudience: e.target.value })}
            />
          </label>
          <label className="text-xs text-[var(--text-secondary)]">
            Experience Label
            <input
              className={INPUT_CLASS}
              value={sForm.teachingExperienceLabel}
              onChange={(e) => setSForm({ ...sForm, teachingExperienceLabel: e.target.value })}
            />
          </label>
          <label className="text-xs text-[var(--text-secondary)]">
            Teaching Mode
            <input
              className={INPUT_CLASS}
              value={sForm.teachingMode}
              onChange={(e) => setSForm({ ...sForm, teachingMode: e.target.value })}
            />
          </label>
        </div>

        <label className="block text-xs text-[var(--text-secondary)]">
          Teaching Summary
          <textarea
            rows={2}
            className={INPUT_CLASS}
            value={sForm.teachingSummary}
            onChange={(e) => setSForm({ ...sForm, teachingSummary: e.target.value })}
          />
        </label>

        <div className="rounded-xl border border-[var(--border-accent)] bg-[var(--bg-base)] p-4 space-y-4">
          <label className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)] cursor-pointer">
            <input
              type="checkbox"
              checked={sForm.muavinEnabled}
              onChange={(e) => setSForm({ ...sForm, muavinEnabled: e.target.checked })}
              className="h-4 w-4 accent-[var(--accent-primary)]"
            />
            <span>Enable Muavin AI Public Chat Assistant</span>
          </label>

          <label className="block text-xs text-[var(--text-secondary)]">
            Muavin Welcome Message (English)
            <textarea
              rows={2}
              className={INPUT_CLASS}
              value={sForm.muavinWelcomeMessage}
              onChange={(e) => setSForm({ ...sForm, muavinWelcomeMessage: e.target.value })}
            />
          </label>

          <label className="block text-xs text-[var(--text-secondary)]">
            Muavin System Tone Instruction
            <input
              className={INPUT_CLASS}
              value={sForm.muavinSystemTone}
              onChange={(e) => setSForm({ ...sForm, muavinSystemTone: e.target.value })}
            />
          </label>

          <label className="block text-xs text-[var(--text-secondary)]">
            Muavin Suggested Quick Questions (one question per line — stays permanently above chat
            input)
            <textarea
              rows={5}
              className={INPUT_CLASS}
              placeholder="Who is Ateeq Ur Rehman?&#10;What projects has Ateeq built?&#10;How can I contact Ateeq?"
              value={sForm.muavinSuggestedQuestionsText}
              onChange={(e) =>
                setSForm({ ...sForm, muavinSuggestedQuestionsText: e.target.value })
              }
            />
          </label>
        </div>
      </form>
    </div>
  );
}

/* ==================== PROJECTS PANEL ==================== */
export function ProjectsPanel({
  onSaved,
  notify,
}: {
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [items, setItems] = useState<ProjectRecord[]>([]);
  const [editing, setEditing] = useState<Partial<ProjectRecord> | null>(null);
  const [techText, setTechText] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  const load = async () => {
    const res = await fetch('/api/admin/projects', { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok) setItems(data.items || []);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing({
      title: '',
      shortTitle: '',
      slug: '',
      indexLabel: String(items.length + 1).padStart(2, '0'),
      category: 'Web & Apps',
      status: 'Built',
      mathSymbol: '∑',
      motif: 'group-symmetry',
      tagline: '',
      summary: '',
      problem: '',
      approach: '',
      mathematicalConnection: '',
      notes: '',
      githubUrl: '',
      liveUrl: '',
      featured: false,
      published: true,
      sortOrder: items.length + 1,
    });
    setTechText('');
    setFeaturesText('');
  };

  const openEdit = (p: ProjectRecord) => {
    setEditing({ ...p });
    setTechText(p.techStack.join(', '));
    setFeaturesText(p.features.join('\n'));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const isUpdate = Boolean(editing.id);
    const url = isUpdate ? `/api/admin/projects/${editing.id}` : '/api/admin/projects';
    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...editing,
        techStack: techText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        features: featuresText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      notify('error', data?.error || 'Failed to save project.');
      return;
    }
    setEditing(null);
    await load();
    await onSaved();
    notify('success', isUpdate ? 'Project updated.' : 'Project created.');
  };

  const togglePublish = async (p: ProjectRecord) => {
    const res = await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ published: !p.published }),
    });
    if (res.ok) {
      await load();
      await onSaved();
    }
  };

  const remove = async (id: number) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      await load();
      await onSaved();
      notify('success', 'Project deleted.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Projects ({items.length})
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Add, edit, feature, publish/unpublish, or remove portfolio projects.
          </p>
        </div>
        <button type="button" onClick={openNew} className={PRIMARY_BTN_CLASS}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Project</span>
        </button>
      </div>

      {editing && (
        <form
          onSubmit={save}
          className="rounded-2xl border border-[var(--border-accent)] bg-[var(--bg-surface)] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {editing.id ? `Edit: ${editing.title}` : 'New Project'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs text-[var(--text-secondary)]">
              Title *
              <input
                required
                className={INPUT_CLASS}
                value={editing.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              Slug (optional)
              <input
                className={INPUT_CLASS}
                value={editing.slug || ''}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              Category
              <select
                className={INPUT_CLASS}
                value={editing.category || 'Web & Apps'}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="AI & ML">AI &amp; ML</option>
                <option value="Web & Apps">Web &amp; Apps</option>
                <option value="Concepts">Concepts</option>
              </select>
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              Status
              <input
                className={INPUT_CLASS}
                value={editing.status || ''}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              Math Symbol
              <input
                className={INPUT_CLASS}
                value={editing.mathSymbol || ''}
                onChange={(e) => setEditing({ ...editing, mathSymbol: e.target.value })}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              3D Motif
              <select
                className={INPUT_CLASS}
                value={editing.motif || 'group-symmetry'}
                onChange={(e) => setEditing({ ...editing, motif: e.target.value })}
              >
                <option value="group-symmetry">Group Symmetry</option>
                <option value="neural-lattice">Neural Lattice</option>
                <option value="simplex-frontier">Simplex Frontier</option>
                <option value="vector-manifold">Vector Manifold</option>
                <option value="harmonic-torus">Harmonic Torus</option>
                <option value="stochastic-grid">Stochastic Grid</option>
                <option value="polyhedral-prism">Polyhedral Prism</option>
                <option value="orbital-wave">Orbital Wave</option>
              </select>
            </label>
          </div>

          <label className="block text-xs text-[var(--text-secondary)]">
            Tagline *
            <input
              required
              className={INPUT_CLASS}
              value={editing.tagline || ''}
              onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
            />
          </label>
          <label className="block text-xs text-[var(--text-secondary)]">
            Summary
            <textarea
              rows={2}
              className={INPUT_CLASS}
              value={editing.summary || ''}
              onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs text-[var(--text-secondary)]">
              Problem
              <textarea
                rows={3}
                className={INPUT_CLASS}
                value={editing.problem || ''}
                onChange={(e) => setEditing({ ...editing, problem: e.target.value })}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              Approach
              <textarea
                rows={3}
                className={INPUT_CLASS}
                value={editing.approach || ''}
                onChange={(e) => setEditing({ ...editing, approach: e.target.value })}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              Mathematical Link
              <textarea
                rows={3}
                className={INPUT_CLASS}
                value={editing.mathematicalConnection || ''}
                onChange={(e) =>
                  setEditing({ ...editing, mathematicalConnection: e.target.value })
                }
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-[var(--text-secondary)]">
              Tech Stack (comma-separated)
              <input
                className={INPUT_CLASS}
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              Key Features (one per line)
              <textarea
                rows={3}
                className={INPUT_CLASS}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              GitHub URL
              <input
                className={INPUT_CLASS}
                value={editing.githubUrl || ''}
                onChange={(e) => setEditing({ ...editing, githubUrl: e.target.value })}
              />
            </label>
            <label className="text-xs text-[var(--text-secondary)]">
              Live Demo URL
              <input
                className={INPUT_CLASS}
                value={editing.liveUrl || ''}
                onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(editing.featured)}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="accent-[var(--accent-primary)]"
              />
              <span>Featured on Home</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published !== false}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="accent-[var(--accent-primary)]"
              />
              <span>Published</span>
            </label>
            <button type="submit" className={`ml-auto ${PRIMARY_BTN_CLASS}`}>
              <Save className="h-3.5 w-3.5" />
              <span>Save Project</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--text-secondary)]">
                <span className="text-[var(--accent-ink)]">{p.indexLabel}</span>
                <span>· {p.category}</span>
                <span>· {p.status}</span>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 text-[var(--accent-secondary-ink)]">
                    <Star className="h-3 w-3" /> Featured
                  </span>
                )}
                {!p.published && (
                  <span className="text-amber-600 dark:text-amber-300">· Draft</span>
                )}
              </div>
              <h3 className="mt-1 truncate text-base font-semibold text-[var(--text-primary)]">
                {p.title}
              </h3>
              <p className="truncate text-xs text-[var(--text-secondary)]">{p.tagline}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => togglePublish(p)}
                title={p.published ? 'Unpublish' : 'Publish'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => openEdit(p)}
                aria-label={`Edit ${p.title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--accent-ink)] cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label={`Delete ${p.title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-rose-400/50 hover:text-rose-500 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== SKILLS, EDUCATION, EXPERIENCE, TEACHING, LEARNING & JOURNEY PANEL ==================== */
export type AcademicSection =
  | 'skills'
  | 'educations'
  | 'experiences'
  | 'teachings'
  | 'learning'
  | 'journey';

const SECTION_LABELS: Record<AcademicSection, string> = {
  skills: 'Skills',
  educations: 'Education',
  experiences: 'Experience',
  teachings: 'Teaching',
  learning: 'Learning Focus Areas',
  journey: 'Journey Milestones',
};

export function AcademicPanels({
  section,
  onSaved,
  notify,
}: {
  section: AcademicSection;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const [educations, setEducations] = useState<EducationRecord[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [teachings, setTeachings] = useState<TeachingRecord[]>([]);
  const [learning, setLearning] = useState<LearningItemRecord[]>([]);
  const [journey, setJourney] = useState<JourneyMilestoneRecord[]>([]);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const loadAll = async () => {
    const endpoint = `/api/admin/${section}`;
    const res = await fetch(endpoint, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) return;
    if (section === 'skills') setSkills(data.items || []);
    if (section === 'educations') setEducations(data.items || []);
    if (section === 'experiences') setExperiences(data.items || []);
    if (section === 'teachings') setTeachings(data.items || []);
    if (section === 'learning') setLearning(data.items || []);
    if (section === 'journey') setJourney(data.items || []);
  };

  useEffect(() => {
    setDraft(null);
    loadAll();
  }, [section]);

  const submitDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const isEdit = Boolean(draft.id);
    const url = isEdit ? `/api/admin/${section}/${draft.id}` : `/api/admin/${section}`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(draft),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      notify('error', data?.error || 'Failed to save item.');
      return;
    }
    setDraft(null);
    await loadAll();
    await onSaved();
    notify('success', isEdit ? 'Updated successfully.' : 'Created successfully.');
  };

  const deleteItem = async (id: number) => {
    const res = await fetch(`/api/admin/${section}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      await loadAll();
      await onSaved();
      notify('success', 'Item removed.');
    }
  };

  const items =
    section === 'skills'
      ? skills
      : section === 'educations'
        ? educations
        : section === 'experiences'
          ? experiences
          : section === 'teachings'
            ? teachings
            : section === 'learning'
              ? learning
              : journey;

  const openNewDraft = () => {
    const nextIdx = String(items.length + 1).padStart(2, '0');
    if (section === 'skills') {
      setDraft({
        indexLabel: nextIdx,
        title: '',
        domain: '',
        symbol: '∑',
        topics: '',
        contextLabel: 'Active',
        published: true,
        sortOrder: items.length + 1,
      });
    } else if (section === 'educations') {
      setDraft({
        degree: '',
        institution: '',
        department: '',
        location: 'Multan, Pakistan',
        period: '',
        semesterOrGrade: '',
        description: '',
        published: true,
        sortOrder: items.length + 1,
      });
    } else if (section === 'experiences') {
      setDraft({
        indexLabel: nextIdx,
        title: '',
        organization: '',
        category: 'Experience',
        period: '',
        location: 'Multan, Pakistan',
        summary: '',
        highlights: '',
        takeaway: '',
        published: true,
        sortOrder: items.length + 1,
      });
    } else if (section === 'teachings') {
      setDraft({
        indexLabel: nextIdx,
        level: '',
        title: '',
        focus: '',
        topics: '',
        published: true,
        sortOrder: items.length + 1,
      });
    } else if (section === 'learning') {
      setDraft({
        indexLabel: nextIdx,
        category: 'Mathematics',
        title: '',
        focus: '',
        resources: '',
        status: 'Active Study',
        published: true,
        sortOrder: items.length + 1,
      });
    } else {
      setDraft({
        indexLabel: nextIdx,
        period: '',
        phase: 'Milestone',
        title: '',
        organization: '',
        location: 'Multan, Pakistan',
        summary: '',
        tags: '',
        published: true,
        sortOrder: items.length + 1,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
          {SECTION_LABELS[section]} ({items.length})
        </h2>
        <button type="button" onClick={openNewDraft} className={PRIMARY_BTN_CLASS}>
          <Plus className="h-4 w-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {draft && (
        <form
          onSubmit={submitDraft}
          className="rounded-2xl border border-[var(--border-accent)] bg-[var(--bg-surface)] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {draft.id ? 'Edit Entry' : 'New Entry'}
            </h3>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {section === 'skills' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[var(--text-secondary)]">
                Title *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.title || '')}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Domain *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.domain || '')}
                  onChange={(e) => setDraft({ ...draft, domain: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Symbol
                <input
                  className={INPUT_CLASS}
                  value={String(draft.symbol || '')}
                  onChange={(e) => setDraft({ ...draft, symbol: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Topics (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={
                    Array.isArray(draft.topics)
                      ? draft.topics.join(', ')
                      : String(draft.topics || '')
                  }
                  onChange={(e) => setDraft({ ...draft, topics: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Description
                <textarea
                  rows={2}
                  className={INPUT_CLASS}
                  value={String(draft.description || '')}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </label>
            </div>
          )}

          {section === 'educations' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[var(--text-secondary)]">
                Degree *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.degree || '')}
                  onChange={(e) => setDraft({ ...draft, degree: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Institution *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.institution || '')}
                  onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Department
                <input
                  className={INPUT_CLASS}
                  value={String(draft.department || '')}
                  onChange={(e) => setDraft({ ...draft, department: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Period
                <input
                  className={INPUT_CLASS}
                  value={String(draft.period || '')}
                  onChange={(e) => setDraft({ ...draft, period: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Semester / Grade
                <input
                  className={INPUT_CLASS}
                  value={String(draft.semesterOrGrade || '')}
                  onChange={(e) => setDraft({ ...draft, semesterOrGrade: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Location
                <input
                  className={INPUT_CLASS}
                  value={String(draft.location || '')}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Description
                <textarea
                  rows={2}
                  className={INPUT_CLASS}
                  value={String(draft.description || '')}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </label>
            </div>
          )}

          {section === 'experiences' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[var(--text-secondary)]">
                Role / Title *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.title || '')}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Organization *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.organization || '')}
                  onChange={(e) => setDraft({ ...draft, organization: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Category
                <input
                  className={INPUT_CLASS}
                  value={String(draft.category || '')}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Period
                <input
                  className={INPUT_CLASS}
                  value={String(draft.period || '')}
                  onChange={(e) => setDraft({ ...draft, period: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Summary
                <textarea
                  rows={2}
                  className={INPUT_CLASS}
                  value={String(draft.summary || '')}
                  onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Highlights (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={
                    Array.isArray(draft.highlights)
                      ? draft.highlights.join(', ')
                      : String(draft.highlights || '')
                  }
                  onChange={(e) => setDraft({ ...draft, highlights: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Takeaway
                <input
                  className={INPUT_CLASS}
                  value={String(draft.takeaway || '')}
                  onChange={(e) => setDraft({ ...draft, takeaway: e.target.value })}
                />
              </label>
            </div>
          )}

          {section === 'teachings' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[var(--text-secondary)]">
                Grade Level *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.level || '')}
                  onChange={(e) => setDraft({ ...draft, level: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Curriculum Title *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.title || '')}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Focus Description
                <textarea
                  rows={2}
                  className={INPUT_CLASS}
                  value={String(draft.focus || '')}
                  onChange={(e) => setDraft({ ...draft, focus: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Topics (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={
                    Array.isArray(draft.topics)
                      ? draft.topics.join(', ')
                      : String(draft.topics || '')
                  }
                  onChange={(e) => setDraft({ ...draft, topics: e.target.value })}
                />
              </label>
            </div>
          )}

          {section === 'learning' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[var(--text-secondary)]">
                Title *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.title || '')}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Category *
                <input
                  required
                  className={INPUT_CLASS}
                  placeholder="Mathematics, Machine Learning, Web Systems..."
                  value={String(draft.category || '')}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Index Label
                <input
                  className={INPUT_CLASS}
                  value={String(draft.indexLabel || '')}
                  onChange={(e) => setDraft({ ...draft, indexLabel: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Status
                <input
                  className={INPUT_CLASS}
                  placeholder="Active Study / Ongoing Research"
                  value={String(draft.status || '')}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Focus Description
                <textarea
                  rows={2}
                  className={INPUT_CLASS}
                  value={String(draft.focus || '')}
                  onChange={(e) => setDraft({ ...draft, focus: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Topics &amp; Key Concepts (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={
                    Array.isArray(draft.resources)
                      ? draft.resources.join(', ')
                      : String(draft.resources || '')
                  }
                  onChange={(e) => setDraft({ ...draft, resources: e.target.value })}
                />
              </label>
            </div>
          )}

          {section === 'journey' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[var(--text-secondary)]">
                Milestone Title *
                <input
                  required
                  className={INPUT_CLASS}
                  value={String(draft.title || '')}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Period *
                <input
                  required
                  className={INPUT_CLASS}
                  placeholder="e.g. Oct 2023 — Present"
                  value={String(draft.period || '')}
                  onChange={(e) => setDraft({ ...draft, period: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Phase
                <input
                  className={INPUT_CLASS}
                  placeholder="University, Community Leadership, Teaching..."
                  value={String(draft.phase || '')}
                  onChange={(e) => setDraft({ ...draft, phase: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Organization
                <input
                  className={INPUT_CLASS}
                  value={String(draft.organization || '')}
                  onChange={(e) => setDraft({ ...draft, organization: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Location
                <input
                  className={INPUT_CLASS}
                  value={String(draft.location || '')}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </label>
              <label className="text-xs text-[var(--text-secondary)]">
                Index Label
                <input
                  className={INPUT_CLASS}
                  value={String(draft.indexLabel || '')}
                  onChange={(e) => setDraft({ ...draft, indexLabel: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Summary
                <textarea
                  rows={2}
                  className={INPUT_CLASS}
                  value={String(draft.summary || '')}
                  onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[var(--text-secondary)]">
                Tags (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={
                    Array.isArray(draft.tags) ? draft.tags.join(', ') : String(draft.tags || '')
                  }
                  onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={draft.published !== false}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                className="accent-[var(--accent-primary)]"
              />
              <span>Published on public site</span>
            </label>
            <button type="submit" className={PRIMARY_BTN_CLASS}>
              <Save className="h-3.5 w-3.5" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const heading =
            'title' in item ? item.title : 'degree' in item ? item.degree : 'Entry';
          const sub =
            section === 'learning' && 'category' in item && 'status' in item
              ? `${item.category} · ${item.status}`
              : section === 'journey' && 'phase' in item && 'period' in item
                ? `${item.phase} · ${item.period}`
                : 'domain' in item
                  ? item.domain
                  : 'institution' in item
                    ? `${item.institution} · ${item.period}`
                    : 'organization' in item
                      ? `${item.organization} · ${item.period}`
                      : 'level' in item
                        ? item.level
                        : '';

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-[var(--accent-ink)]">{sub}</p>
                <h3 className="mt-0.5 truncate text-base font-semibold text-[var(--text-primary)]">
                  {heading}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setDraft({ ...item })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--accent-ink)] cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-rose-400/50 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Save, Star, Trash2, X } from 'lucide-react';
import type {
  EducationRecord,
  ExperienceRecord,
  ProfileRecord,
  ProjectRecord,
  SiteSettingsRecord,
  SkillRecord,
  TeachingRecord,
} from '../../types/portfolio';

export type NotifyFn = (type: 'success' | 'error', text: string) => void;

const INPUT_CLASS =
  'mt-1 w-full rounded-lg border border-[#F4F7FF]/15 bg-[#070B18] px-3 py-2 text-sm text-[#F4F7FF] placeholder-[#A6B2C9]/45 focus:border-[#00D9FF] focus:outline-none';

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
  const [sForm, setSForm] = useState({ ...settings });
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
    setSForm({ ...settings });
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
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sForm),
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
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl border border-[#F4F7FF]/12 bg-[#10182B] p-6 space-y-5"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#F4F7FF]/10 pb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">
              Profile Information
            </h2>
            <p className="text-xs text-[#A6B2C9]">
              Public identity, hero rotating roles, academic headline, and story paragraphs.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] hover:bg-[#3CE4FF] disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs text-[#A6B2C9]">
            Full Name
            <input
              className={INPUT_CLASS}
              value={pForm.name}
              onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Initials
            <input
              className={INPUT_CLASS}
              maxLength={4}
              value={pForm.initials}
              onChange={(e) => setPForm({ ...pForm, initials: e.target.value })}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Email
            <input
              className={INPUT_CLASS}
              type="email"
              value={pForm.email}
              onChange={(e) => setPForm({ ...pForm, email: e.target.value })}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Location
            <input
              className={INPUT_CLASS}
              value={pForm.location}
              onChange={(e) => setPForm({ ...pForm, location: e.target.value })}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Coordinates
            <input
              className={INPUT_CLASS}
              value={pForm.coordinates}
              onChange={(e) => setPForm({ ...pForm, coordinates: e.target.value })}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Degree / Semester
            <input
              className={INPUT_CLASS}
              value={pForm.semester}
              onChange={(e) => setPForm({ ...pForm, semester: e.target.value })}
            />
          </label>
        </div>

        <label className="block text-xs text-[#A6B2C9]">
          Hero Tagline
          <textarea
            rows={2}
            className={INPUT_CLASS}
            value={pForm.tagline}
            onChange={(e) => setPForm({ ...pForm, tagline: e.target.value })}
          />
        </label>

        <label className="block text-xs text-[#A6B2C9]">
          Rotating Roles (comma-separated)
          <input
            className={INPUT_CLASS}
            value={pForm.rotatingRolesText}
            onChange={(e) => setPForm({ ...pForm, rotatingRolesText: e.target.value })}
          />
        </label>

        <label className="block text-xs text-[#A6B2C9]">
          Philosophy Quote
          <input
            className={INPUT_CLASS}
            value={pForm.philosophyQuote}
            onChange={(e) => setPForm({ ...pForm, philosophyQuote: e.target.value })}
          />
        </label>

        <label className="block text-xs text-[#A6B2C9]">
          About Story (separate paragraphs with a blank line)
          <textarea
            rows={5}
            className={INPUT_CLASS}
            value={pForm.aboutStoryText}
            onChange={(e) => setPForm({ ...pForm, aboutStoryText: e.target.value })}
          />
        </label>
      </form>

      <form
        onSubmit={handleSaveSettings}
        className="rounded-2xl border border-[#F4F7FF]/12 bg-[#10182B] p-6 space-y-5"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#F4F7FF]/10 pb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">
              Teaching Overview &amp; Muavin AI Settings
            </h2>
            <p className="text-xs text-[#A6B2C9]">
              Control site-wide labels, teaching page metadata, and Muavin AI behavior.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] hover:bg-[#3CE4FF] disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-[#A6B2C9]">
            Teaching Headline
            <input
              className={INPUT_CLASS}
              value={sForm.teachingHeadline}
              onChange={(e) => setSForm({ ...sForm, teachingHeadline: e.target.value })}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Audience Range
            <input
              className={INPUT_CLASS}
              value={sForm.teachingAudience}
              onChange={(e) => setSForm({ ...sForm, teachingAudience: e.target.value })}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Experience Label
            <input
              className={INPUT_CLASS}
              value={sForm.teachingExperienceLabel}
              onChange={(e) => setSForm({ ...sForm, teachingExperienceLabel: e.target.value })}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Teaching Mode
            <input
              className={INPUT_CLASS}
              value={sForm.teachingMode}
              onChange={(e) => setSForm({ ...sForm, teachingMode: e.target.value })}
            />
          </label>
        </div>

        <label className="block text-xs text-[#A6B2C9]">
          Teaching Summary
          <textarea
            rows={2}
            className={INPUT_CLASS}
            value={sForm.teachingSummary}
            onChange={(e) => setSForm({ ...sForm, teachingSummary: e.target.value })}
          />
        </label>

        <div className="rounded-xl border border-[#00D9FF]/25 bg-[#070B18]/75 p-4 space-y-4">
          <label className="flex items-center gap-3 text-sm font-medium text-[#F4F7FF] cursor-pointer">
            <input
              type="checkbox"
              checked={sForm.muavinEnabled}
              onChange={(e) => setSForm({ ...sForm, muavinEnabled: e.target.checked })}
              className="h-4 w-4 accent-[#00D9FF]"
            />
            <span>Enable Muavin AI Public Chat Assistant</span>
          </label>

          <label className="block text-xs text-[#A6B2C9]">
            Muavin Welcome Message
            <textarea
              rows={2}
              className={INPUT_CLASS}
              value={sForm.muavinWelcomeMessage}
              onChange={(e) => setSForm({ ...sForm, muavinWelcomeMessage: e.target.value })}
            />
          </label>

          <label className="block text-xs text-[#A6B2C9]">
            Muavin System Tone Instruction
            <input
              className={INPUT_CLASS}
              value={sForm.muavinSystemTone}
              onChange={(e) => setSForm({ ...sForm, muavinSystemTone: e.target.value })}
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
          <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">
            Projects ({items.length})
          </h2>
          <p className="text-xs text-[#A6B2C9]">
            Add, edit, feature, publish/unpublish, or remove portfolio projects.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] hover:bg-[#3CE4FF] cursor-pointer"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Project</span>
        </button>
      </div>

      {editing && (
        <form
          onSubmit={save}
          className="rounded-2xl border border-[#00D9FF]/35 bg-[#10182B] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#F4F7FF]">
              {editing.id ? `Edit: ${editing.title}` : 'New Project'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-[#A6B2C9] hover:text-[#F4F7FF] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs text-[#A6B2C9]">
              Title *
              <input
                required
                className={INPUT_CLASS}
                value={editing.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
              Slug (optional)
              <input
                className={INPUT_CLASS}
                value={editing.slug || ''}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
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
            <label className="text-xs text-[#A6B2C9]">
              Status
              <input
                className={INPUT_CLASS}
                value={editing.status || ''}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
              Math Symbol
              <input
                className={INPUT_CLASS}
                value={editing.mathSymbol || ''}
                onChange={(e) => setEditing({ ...editing, mathSymbol: e.target.value })}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
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

          <label className="block text-xs text-[#A6B2C9]">
            Tagline *
            <input
              required
              className={INPUT_CLASS}
              value={editing.tagline || ''}
              onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
            />
          </label>
          <label className="block text-xs text-[#A6B2C9]">
            Summary
            <textarea
              rows={2}
              className={INPUT_CLASS}
              value={editing.summary || ''}
              onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs text-[#A6B2C9]">
              Problem
              <textarea
                rows={3}
                className={INPUT_CLASS}
                value={editing.problem || ''}
                onChange={(e) => setEditing({ ...editing, problem: e.target.value })}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
              Approach
              <textarea
                rows={3}
                className={INPUT_CLASS}
                value={editing.approach || ''}
                onChange={(e) => setEditing({ ...editing, approach: e.target.value })}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
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
            <label className="text-xs text-[#A6B2C9]">
              Tech Stack (comma-separated)
              <input
                className={INPUT_CLASS}
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
              Key Features (one per line)
              <textarea
                rows={3}
                className={INPUT_CLASS}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
              GitHub URL
              <input
                className={INPUT_CLASS}
                value={editing.githubUrl || ''}
                onChange={(e) => setEditing({ ...editing, githubUrl: e.target.value })}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
              Live Demo URL
              <input
                className={INPUT_CLASS}
                value={editing.liveUrl || ''}
                onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-[#F4F7FF] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(editing.featured)}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="accent-[#00D9FF]"
              />
              <span>Featured on Home</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#F4F7FF] cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published !== false}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="accent-[#00D9FF]"
              />
              <span>Published</span>
            </label>
            <button
              type="submit"
              className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] cursor-pointer"
            >
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
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#F4F7FF]/10 bg-[#10182B] px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#A6B2C9]">
                <span className="text-[#00D9FF]">{p.indexLabel}</span>
                <span>· {p.category}</span>
                <span>· {p.status}</span>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 text-[#00D9FF]">
                    <Star className="h-3 w-3" /> Featured
                  </span>
                )}
                {!p.published && <span className="text-amber-300">· Draft</span>}
              </div>
              <h3 className="mt-1 truncate text-base font-semibold text-[#F4F7FF]">{p.title}</h3>
              <p className="truncate text-xs text-[#A6B2C9]">{p.tagline}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => togglePublish(p)}
                title={p.published ? 'Unpublish' : 'Publish'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-[#00D9FF]/45 hover:text-[#F4F7FF] cursor-pointer"
              >
                {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => openEdit(p)}
                aria-label={`Edit ${p.title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-[#00D9FF]/45 hover:text-[#00D9FF] cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label={`Delete ${p.title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-rose-400/50 hover:text-rose-400 cursor-pointer"
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

/* ==================== SKILLS, EDUCATION, EXPERIENCE & TEACHING PANEL ==================== */
export function AcademicPanels({
  section,
  onSaved,
  notify,
}: {
  section: 'skills' | 'educations' | 'experiences' | 'teachings';
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const [educations, setEducations] = useState<EducationRecord[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [teachings, setTeachings] = useState<TeachingRecord[]>([]);
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
          : teachings;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold capitalize text-[#F4F7FF]">
          {section} ({items.length})
        </h2>
        <button
          type="button"
          onClick={() =>
            setDraft(
              section === 'skills'
                ? { title: '', domain: '', symbol: '∑', topics: '', contextLabel: 'Active', published: true }
                : section === 'educations'
                  ? { degree: '', institution: '', department: '', location: 'Multan, Pakistan', period: '', semesterOrGrade: '', description: '', published: true }
                  : section === 'experiences'
                    ? { title: '', organization: '', category: 'Experience', period: '', location: 'Multan, Pakistan', summary: '', highlights: '', takeaway: '', published: true }
                    : { level: '', title: '', focus: '', topics: '', published: true },
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {draft && (
        <form
          onSubmit={submitDraft}
          className="rounded-2xl border border-[#00D9FF]/35 bg-[#10182B] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#F4F7FF]">
              {draft.id ? 'Edit Entry' : 'New Entry'}
            </h3>
            <button type="button" onClick={() => setDraft(null)} className="text-[#A6B2C9] cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          {section === 'skills' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[#A6B2C9]">
                Title *
                <input required className={INPUT_CLASS} value={String(draft.title || '')} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Domain *
                <input required className={INPUT_CLASS} value={String(draft.domain || '')} onChange={(e) => setDraft({ ...draft, domain: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Symbol
                <input className={INPUT_CLASS} value={String(draft.symbol || '')} onChange={(e) => setDraft({ ...draft, symbol: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Topics (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={Array.isArray(draft.topics) ? draft.topics.join(', ') : String(draft.topics || '')}
                  onChange={(e) => setDraft({ ...draft, topics: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-xs text-[#A6B2C9]">
                Description
                <textarea rows={2} className={INPUT_CLASS} value={String(draft.description || '')} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </label>
            </div>
          )}

          {section === 'educations' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[#A6B2C9]">
                Degree *
                <input required className={INPUT_CLASS} value={String(draft.degree || '')} onChange={(e) => setDraft({ ...draft, degree: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Institution *
                <input required className={INPUT_CLASS} value={String(draft.institution || '')} onChange={(e) => setDraft({ ...draft, institution: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Department
                <input className={INPUT_CLASS} value={String(draft.department || '')} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Period
                <input className={INPUT_CLASS} value={String(draft.period || '')} onChange={(e) => setDraft({ ...draft, period: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Semester / Grade
                <input className={INPUT_CLASS} value={String(draft.semesterOrGrade || '')} onChange={(e) => setDraft({ ...draft, semesterOrGrade: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Location
                <input className={INPUT_CLASS} value={String(draft.location || '')} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
              </label>
              <label className="sm:col-span-2 text-xs text-[#A6B2C9]">
                Description
                <textarea rows={2} className={INPUT_CLASS} value={String(draft.description || '')} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </label>
            </div>
          )}

          {section === 'experiences' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[#A6B2C9]">
                Role / Title *
                <input required className={INPUT_CLASS} value={String(draft.title || '')} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Organization *
                <input required className={INPUT_CLASS} value={String(draft.organization || '')} onChange={(e) => setDraft({ ...draft, organization: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Category
                <input className={INPUT_CLASS} value={String(draft.category || '')} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Period
                <input className={INPUT_CLASS} value={String(draft.period || '')} onChange={(e) => setDraft({ ...draft, period: e.target.value })} />
              </label>
              <label className="sm:col-span-2 text-xs text-[#A6B2C9]">
                Summary
                <textarea rows={2} className={INPUT_CLASS} value={String(draft.summary || '')} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Highlights (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={Array.isArray(draft.highlights) ? draft.highlights.join(', ') : String(draft.highlights || '')}
                  onChange={(e) => setDraft({ ...draft, highlights: e.target.value })}
                />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Takeaway
                <input className={INPUT_CLASS} value={String(draft.takeaway || '')} onChange={(e) => setDraft({ ...draft, takeaway: e.target.value })} />
              </label>
            </div>
          )}

          {section === 'teachings' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[#A6B2C9]">
                Grade Level *
                <input required className={INPUT_CLASS} value={String(draft.level || '')} onChange={(e) => setDraft({ ...draft, level: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Curriculum Title *
                <input required className={INPUT_CLASS} value={String(draft.title || '')} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </label>
              <label className="sm:col-span-2 text-xs text-[#A6B2C9]">
                Focus Description
                <textarea rows={2} className={INPUT_CLASS} value={String(draft.focus || '')} onChange={(e) => setDraft({ ...draft, focus: e.target.value })} />
              </label>
              <label className="sm:col-span-2 text-xs text-[#A6B2C9]">
                Topics (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={Array.isArray(draft.topics) ? draft.topics.join(', ') : String(draft.topics || '')}
                  onChange={(e) => setDraft({ ...draft, topics: e.target.value })}
                />
              </label>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const heading =
            'title' in item
              ? item.title
              : 'degree' in item
                ? item.degree
                : 'Entry';
          const sub =
            'domain' in item
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
              className="flex items-center justify-between gap-4 rounded-xl border border-[#F4F7FF]/10 bg-[#10182B] px-5 py-4"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-[#00D9FF]">{sub}</p>
                <h3 className="mt-0.5 truncate text-base font-semibold text-[#F4F7FF]">{heading}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setDraft({ ...item })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-[#00D9FF]/45 hover:text-[#00D9FF] cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-rose-400/50 hover:text-rose-400 cursor-pointer"
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

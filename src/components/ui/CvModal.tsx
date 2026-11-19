import { useEffect, useState } from 'react';
import { Download, FileText, Printer, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { ActiveCvSummary } from '../../types/portfolio';

interface CvModalProps {
  open: boolean;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function CvModal({ open, onClose }: CvModalProps) {
  const { portfolio } = usePortfolio();
  const [cvAvailable, setCvAvailable] = useState<boolean | null>(
    portfolio.activeCv ? true : null,
  );
  const [cvMeta, setCvMeta] = useState<ActiveCvSummary | null>(portfolio.activeCv);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    fetch('/api/cv/status')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setCvAvailable(Boolean(data?.available));
          setCvMeta(data?.cv || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCvAvailable(Boolean(portfolio.activeCv));
          setCvMeta(portfolio.activeCv);
        }
      });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelled = true;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, portfolio.activeCv]);

  if (!open) return null;

  const { profile, experiences, projects, skills } = portfolio;
  const githubLink =
    portfolio.socialLinks.find((s) => s.platformKey === 'github')?.handle ||
    'github.com/callmemrsheeqa-oss';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl">
        <div className="no-print flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[var(--accent-ink)]" aria-hidden="true" />
            <div>
              <h2 id="cv-modal-title" className="text-lg font-semibold text-[var(--text-primary)]">
                Curriculum Vitae — {profile.name}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {cvAvailable === true && cvMeta
                  ? `Active PDF ready: ${cvMeta.originalFilename}${cvMeta.fileSize ? ` (${formatBytes(cvMeta.fileSize)})` : ''}`
                  : 'Printable academic CV summary · Upload a PDF in Admin Dashboard to enable direct file download.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close CV dialog"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 text-sm leading-relaxed text-[var(--text-secondary)]">
          {cvAvailable === false && (
            <div className="no-print mb-6 rounded-xl border border-[var(--accent-secondary)]/35 bg-[var(--accent-secondary)]/10 p-4 text-xs text-[var(--text-primary)]">
              <p className="font-semibold text-[var(--accent-ink)]">No Uploaded CV PDF Yet</p>
              <p className="mt-1 text-[var(--text-secondary)]">
                Rather than generating a synthetic placeholder PDF, you can inspect or print this
                verified academic summary below, or upload an official PDF file in the Admin
                Dashboard to enable direct one-click downloads.
              </p>
            </div>
          )}

          <div className="space-y-6 text-[var(--text-primary)]">
            <div className="border-b border-[var(--border-subtle)] pb-4">
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <p className="mt-1 text-sm text-[var(--accent-ink)]">
                {profile.degree} · {profile.semester}
              </p>
              <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
                {profile.email} · {profile.location} · {githubLink}
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ink)]">
                Education
              </h4>
              <p className="mt-2 font-medium text-[var(--text-primary)]">{profile.degree}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {profile.department}, {profile.university} · {profile.educationPeriod} ({profile.semester})
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ink)]">
                Experience &amp; Leadership
              </h4>
              <ul className="mt-2 space-y-2.5">
                {experiences.map((item) => (
                  <li key={item.id}>
                    <span className="font-medium text-[var(--text-primary)]">{item.title}</span> —{' '}
                    <span className="text-[var(--text-secondary)]">
                      {item.organization} ({item.period})
                    </span>
                    <p className="text-xs text-[var(--text-secondary)]">{item.summary}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ink)]">
                Selected Projects
              </h4>
              <ul className="mt-2 space-y-2">
                {projects.slice(0, 6).map((proj) => (
                  <li key={proj.slug} className="text-xs">
                    <span className="font-medium text-[var(--text-primary)]">{proj.title}</span>{' '}
                    <span className="text-[var(--text-secondary)]">
                      ({proj.status}) — {proj.tagline}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ink)]">
                Core Foundations
              </h4>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {skills.map((group) => (
                  <p key={group.id} className="text-xs text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">{group.title}:</span>{' '}
                    {group.topics.join(', ')}
                  </p>
                ))}
                <p className="text-xs text-[var(--text-secondary)]">
                  <span className="font-medium text-[var(--text-primary)]">Languages:</span> Urdu,
                  English
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="no-print flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border-subtle)] px-6 py-4">
          {cvAvailable && (
            <a
              href="/api/cv/download"
              download={cvMeta?.originalFilename || 'Ateeq_Ur_Rehman_CV.pdf'}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download PDF CV</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              cvAvailable
                ? 'border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-accent)]'
                : 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)]'
            }`}
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040711]/85 p-4 sm:p-6"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#F4F7FF]/15 bg-[#10182B] shadow-2xl">
        {/* Header */}
        <div className="no-print flex items-center justify-between gap-4 border-b border-[#F4F7FF]/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#00D9FF]" aria-hidden="true" />
            <div>
              <h2 id="cv-modal-title" className="text-lg font-semibold text-[#F4F7FF]">
                Curriculum Vitae — {profile.name}
              </h2>
              <p className="text-xs text-[#A6B2C9]">
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-[#00D9FF]/40 hover:text-[#F4F7FF] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Academic CV Content */}
        <div className="overflow-y-auto px-6 py-6 text-sm leading-relaxed text-[#A6B2C9]">
          {cvAvailable === false && (
            <div className="no-print mb-6 rounded-xl border border-[#8957FF]/35 bg-[#8957FF]/10 p-4 text-xs text-[#F4F7FF]">
              <p className="font-semibold text-[#00D9FF]">No Uploaded CV PDF Yet</p>
              <p className="mt-1 text-[#A6B2C9]">
                Rather than generating a synthetic placeholder PDF, you can inspect or print this
                verified academic summary below, or upload an official PDF file in the Admin
                Dashboard to enable direct one-click downloads.
              </p>
            </div>
          )}

          <div className="space-y-6 text-[#F4F7FF]">
            <div className="border-b border-[#F4F7FF]/10 pb-4">
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <p className="mt-1 text-sm text-[#00D9FF]">
                {profile.degree} · {profile.semester}
              </p>
              <p className="mt-1 font-mono text-xs text-[#A6B2C9]">
                {profile.email} · {profile.location} · {githubLink}
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#00D9FF]">Education</h4>
              <p className="mt-2 font-medium text-[#F4F7FF]">{profile.degree}</p>
              <p className="text-xs text-[#A6B2C9]">
                {profile.department}, {profile.university} · {profile.educationPeriod} ({profile.semester})
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#00D9FF]">
                Experience &amp; Leadership
              </h4>
              <ul className="mt-2 space-y-2.5">
                {experiences.map((item) => (
                  <li key={item.id}>
                    <span className="font-medium text-[#F4F7FF]">{item.title}</span> —{' '}
                    <span className="text-[#A6B2C9]">
                      {item.organization} ({item.period})
                    </span>
                    <p className="text-xs text-[#A6B2C9]">{item.summary}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#00D9FF]">
                Selected Projects
              </h4>
              <ul className="mt-2 space-y-2">
                {projects.slice(0, 6).map((proj) => (
                  <li key={proj.slug} className="text-xs">
                    <span className="font-medium text-[#F4F7FF]">{proj.title}</span>{' '}
                    <span className="text-[#A6B2C9]">
                      ({proj.status}) — {proj.tagline}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#00D9FF]">
                Core Foundations
              </h4>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {skills.map((group) => (
                  <p key={group.id} className="text-xs text-[#A6B2C9]">
                    <span className="font-medium text-[#F4F7FF]">{group.title}:</span>{' '}
                    {group.topics.join(', ')}
                  </p>
                ))}
                <p className="text-xs text-[#A6B2C9]">
                  <span className="font-medium text-[#F4F7FF]">Languages:</span> Urdu, English
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="no-print flex flex-wrap items-center justify-end gap-3 border-t border-[#F4F7FF]/10 px-6 py-4">
          {cvAvailable && (
            <a
              href="/api/cv/download"
              download={cvMeta?.originalFilename || 'Ateeq_Ur_Rehman_CV.pdf'}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-sm font-semibold text-[#070B18] hover:bg-[#3CE4FF] transition-colors whitespace-nowrap shrink-0"
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
                ? 'border border-[#F4F7FF]/15 text-[#F4F7FF] hover:border-[#00D9FF]/50'
                : 'bg-[#00D9FF] text-[#070B18] hover:bg-[#3CE4FF]'
            }`}
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-lg border border-[#F4F7FF]/15 px-4 py-2 text-sm font-medium text-[#A6B2C9] hover:text-[#F4F7FF] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

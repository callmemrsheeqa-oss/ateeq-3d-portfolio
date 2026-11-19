import { useEffect, useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { usePortfolio } from '../context/PortfolioContext';
import type { ActiveCvSummary } from '../types/portfolio';

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function CvPage() {
  const { portfolio } = usePortfolio();
  const { profile, experiences, projects, skills } = portfolio;
  const [cvAvailable, setCvAvailable] = useState<boolean | null>(
    portfolio.activeCv ? true : null,
  );
  const [cvMeta, setCvMeta] = useState<ActiveCvSummary | null>(portfolio.activeCv);

  useEffect(() => {
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

    return () => {
      cancelled = true;
    };
  }, [portfolio.activeCv]);

  const githubLink =
    portfolio.socialLinks.find((s) => s.platformKey === 'github')?.handle ||
    'github.com/callmemrsheeqa-oss';

  return (
    <>
      <PageMeta
        title="Curriculum Vitae"
        description="Curriculum Vitae of Ateeq Ur Rehman — BS Mathematics at CASPAM (BZU), teaching, projects, and technical foundations."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="no-print flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
                CURRICULUM VITAE
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                {profile.name}
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {cvAvailable && cvMeta
                  ? `Official PDF ready: ${cvMeta.originalFilename}${cvMeta.fileSize ? ` (${formatBytes(cvMeta.fileSize)})` : ''}`
                  : 'Printable academic CV summary · Upload an official PDF in Admin Dashboard to enable direct file download.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {cvAvailable && (
                <a
                  href="/api/cv/download"
                  download={cvMeta?.originalFilename || 'Ateeq_Ur_Rehman_CV.pdf'}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Download PDF CV</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>

          <article className="glass-panel mt-8 rounded-2xl p-6 sm:p-10 space-y-8">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{profile.name}</h2>
                <p className="mt-1 text-sm font-medium text-[var(--accent-ink)]">
                  {profile.degree} · {profile.semester}
                </p>
                <p className="mt-1.5 font-mono text-xs text-[var(--text-secondary)]">
                  {profile.email} · {profile.location} · {githubLink}
                </p>
              </div>
              <FileText
                className="no-print h-6 w-6 text-[var(--accent-secondary-ink)]"
                aria-hidden="true"
              />
            </header>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ink)]">
                Education
              </h3>
              <p className="mt-2 font-semibold text-[var(--text-primary)]">{profile.degree}</p>
              <p className="text-sm text-[var(--text-secondary)]">
                {profile.department}, {profile.university} · {profile.educationPeriod} (
                {profile.semester})
              </p>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                {profile.educationFocus}
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ink)]">
                Experience &amp; Leadership
              </h3>
              <ul className="mt-3 space-y-3.5">
                {experiences.map((item) => (
                  <li key={item.id}>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {item.title}{' '}
                      <span className="font-normal text-[var(--text-secondary)]">
                        — {item.organization} ({item.period})
                      </span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {item.summary}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ink)]">
                Selected Projects
              </h3>
              <ul className="mt-3 space-y-2.5">
                {projects.slice(0, 6).map((proj) => (
                  <li key={proj.slug} className="text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">{proj.title}</span>{' '}
                    <span className="text-xs text-[var(--text-secondary)]">
                      ({proj.status}) — {proj.tagline}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-ink)]">
                Core Foundations &amp; Languages
              </h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {skills.map((group) => (
                  <p key={group.id} className="text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-primary)]">{group.title}:</span>{' '}
                    {group.topics.join(', ')}
                  </p>
                ))}
                <p className="text-xs text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">Languages:</span>{' '}
                  Urdu, English
                </p>
              </div>
            </div>
          </article>
        </RevealSection>
      </section>
    </>
  );
}

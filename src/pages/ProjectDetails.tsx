import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import {
  InteractiveMathArtwork,
  type ArtworkVariant,
} from '../components/three/InteractiveMathArtwork';
import { MagneticButton } from '../components/ui/MagneticButton';
import { usePortfolio } from '../context/PortfolioContext';
import type { ProjectRecord } from '../types/portfolio';

export function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { portfolio } = usePortfolio();
  const [fetchedProject, setFetchedProject] = useState<ProjectRecord | null>(null);

  const index = portfolio.projects.findIndex((p) => p.slug === slug);
  const contextProject = index >= 0 ? portfolio.projects[index] : null;
  const project = contextProject ?? fetchedProject;

  useEffect(() => {
    if (contextProject || !slug) return;
    let cancelled = false;
    fetch(`/api/projects/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok && data?.project) {
          setFetchedProject(data.project);
        }
      })
      .catch(() => {
        // Ignore network errors
      });
    return () => {
      cancelled = true;
    };
  }, [contextProject, slug]);

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <PageMeta title="Project Not Found" description="Requested project could not be located." />
        <p className="font-mono text-xs text-[var(--accent-ink)]">404 · PROJECT NOT FOUND</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-[var(--text-primary)]">
          That project entry does not exist.
        </h1>
        <div className="mt-8">
          <MagneticButton to="/projects" variant="primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Projects</span>
          </MagneticButton>
        </div>
      </div>
    );
  }

  const list = portfolio.projects.length > 0 ? portfolio.projects : [project];
  const safeIdx = index >= 0 ? index : 0;
  const prevProject = list[(safeIdx - 1 + list.length) % list.length];
  const nextProject = list[(safeIdx + 1) % list.length];

  return (
    <>
      <PageMeta title={project.title} description={project.tagline} />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-ink)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>All Projects</span>
        </Link>

        {/* Header & Interactive 3D Visual */}
        <div className="mt-8 grid items-stretch gap-10 lg:grid-cols-12">
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--text-secondary)]">
              <span className="text-[var(--accent-ink)]">{project.indexLabel}</span>
              <span aria-hidden="true">/</span>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.status}</span>
            </div>

            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
              {project.summary}
            </p>

            <p className="mt-5 font-mono text-xs leading-relaxed text-[var(--accent-ink)]">
              {project.techStack.join(' · ')}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              {project.liveUrl && (
                <MagneticButton
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
                  <span>Open Live Application</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </MagneticButton>
              )}

              {project.githubUrl && (
                <MagneticButton
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={project.liveUrl ? 'secondary' : 'primary'}
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  <span>View Repository</span>
                </MagneticButton>
              )}

              {!project.githubUrl && !project.liveUrl && (
                <p className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs text-[var(--text-secondary)]">
                  Local build / private research workspace — no fabricated public URL is listed.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel flex h-full flex-col justify-between rounded-2xl p-4">
              <InteractiveMathArtwork
                variant={(project.motif || 'group-symmetry') as ArtworkVariant}
                className="h-72 w-full sm:h-80"
              />
              <div className="mt-3 flex items-center justify-between px-1 font-mono text-xs text-[var(--text-secondary)]">
                <span>Symbol {project.mathSymbol}</span>
                <span>Drag to orbit 3D manifold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Technical & Mathematical Breakdown */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <section className="glass-panel rounded-2xl p-6">
            <h2 className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
              01 · PROBLEM
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {project.problem}
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
              02 · APPROACH
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {project.approach}
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="font-mono text-xs tracking-wider text-[var(--accent-secondary-ink)]">
              03 · MATHEMATICAL LINK
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {project.mathematicalConnection}
            </p>
          </section>
        </div>

        {/* Features & Transparent Notes */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="glass-panel rounded-2xl p-6 lg:col-span-7">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Key Capabilities &amp; Scope
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--text-secondary)]">
              {project.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="pt-1 font-mono text-xs text-[var(--accent-ink)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-panel rounded-2xl p-6 lg:col-span-5">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Status &amp; Transparency Note
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {project.notes}
            </p>
            <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-secondary)]">
              Interested in discussing this architecture?{' '}
              <Link
                to="/contact"
                className="font-medium text-[var(--accent-ink)] hover:underline"
              >
                Send an enquiry
              </Link>
              .
            </div>
          </section>
        </div>

        {/* Next / Previous Project Navigation */}
        <nav
          aria-label="Adjacent projects"
          className="mt-14 grid gap-4 border-t border-[var(--border-subtle)] pt-8 sm:grid-cols-2"
        >
          <Link
            to={`/projects/${prevProject.slug}`}
            className="glass-panel glass-panel-hover flex items-center gap-3 rounded-xl p-4"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-[var(--accent-ink)]" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-mono text-xs text-[var(--text-secondary)]">Previous</p>
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {prevProject.title}
              </p>
            </div>
          </Link>

          <Link
            to={`/projects/${nextProject.slug}`}
            className="glass-panel glass-panel-hover flex items-center justify-end gap-3 rounded-xl p-4 text-right"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs text-[var(--text-secondary)]">Next</p>
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {nextProject.title}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent-ink)]" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </>
  );
}

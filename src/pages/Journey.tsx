import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { usePortfolio } from '../context/PortfolioContext';

export function Journey() {
  const { portfolio } = usePortfolio();
  const { journeyMilestones } = portfolio;

  return (
    <>
      <PageMeta
        title="Journey"
        description="Chronological academic, teaching, industry, and leadership journey of Ateeq Ur Rehman."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealSection>
          <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
            CHRONOLOGICAL TIMELINE
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Academic &amp; Leadership Journey
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            Key steps connecting formal mathematical study at BZU Multan, classroom teaching,
            student debating, industry exposure, and developer community leadership.
          </p>

          <div className="relative mt-12 space-y-6 before:absolute before:left-5 before:top-4 before:bottom-4 before:hidden before:w-px before:bg-[var(--border-subtle)] sm:pl-14 sm:before:block">
            {journeyMilestones.map((milestone) => (
              <article
                key={milestone.id}
                className="glass-panel relative rounded-2xl p-6 sm:p-7"
              >
                {/* Node dot on desktop timeline rail */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.85rem] top-7 hidden h-3 w-3 rounded-full border-2 border-[var(--bg-base)] bg-[var(--accent-ink)] sm:block"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-[var(--accent-ink)]">
                    {milestone.indexLabel} · {milestone.phase}
                  </span>
                  <span className="text-[var(--accent-secondary-ink)]">{milestone.period}</span>
                </div>

                <h2 className="mt-2.5 text-xl font-bold text-[var(--text-primary)]">
                  {milestone.title}
                </h2>
                <p className="mt-1 text-sm font-medium text-[var(--text-primary)]/90">
                  {milestone.organization}
                  {milestone.location ? ` · ${milestone.location}` : ''}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {milestone.summary}
                </p>

                {milestone.tags.length > 0 && (
                  <p className="mt-4 border-t border-[var(--border-subtle)] pt-3 font-mono text-xs text-[var(--text-secondary)]">
                    {milestone.tags.join(' · ')}
                  </p>
                )}
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-8 text-sm font-medium">
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-[var(--accent-ink)] hover:opacity-80"
            >
              <span>Read personal story on About</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/cv"
              className="inline-flex items-center gap-1.5 text-[var(--accent-secondary-ink)] hover:opacity-80"
            >
              <span>View / Download Curriculum Vitae</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </RevealSection>
      </section>
    </>
  );
}

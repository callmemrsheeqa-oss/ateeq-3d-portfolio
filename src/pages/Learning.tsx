import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { usePortfolio } from '../context/PortfolioContext';

export function Learning() {
  const { portfolio } = usePortfolio();
  const { learningItems } = portfolio;

  return (
    <>
      <PageMeta
        title="Learning"
        description="Active learning focus of Ateeq Ur Rehman across BS Mathematics, AI/ML retrieval systems, scientific Python, and interactive 3D web engineering."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealSection>
          <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
            ACTIVE STUDY &amp; EXPLORATION
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            What I Am Currently Learning
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            {portfolio.profile.philosophyQuote}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {learningItems.map((item) => (
              <article
                key={item.id}
                className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 font-mono text-xs">
                    <span className="text-[var(--accent-ink)]">
                      {item.indexLabel} / {item.category}
                    </span>
                    <span className="text-[var(--accent-secondary-ink)]">{item.status}</span>
                  </div>

                  <h2 className="mt-3 text-xl font-bold text-[var(--text-primary)]">
                    {item.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.focus}
                  </p>
                </div>

                {item.resources.length > 0 && (
                  <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                      Key Topics
                    </p>
                    <p className="mt-1.5 font-mono text-xs text-[var(--text-primary)]">
                      {item.resources.join(' · ')}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="mt-14">
          <div className="glass-panel flex flex-col items-start justify-between gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-accent)] bg-[var(--accent-primary)]/12 text-[var(--accent-ink)]">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  Putting concepts into code
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Inspect how these subjects translate into interactive builds and mathematical
                  experiments.
                </p>
              </div>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-ink)] hover:opacity-80 whitespace-nowrap shrink-0"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </RevealSection>
      </section>
    </>
  );
}

import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { usePortfolio } from '../context/PortfolioContext';

export function Skills() {
  const { portfolio } = usePortfolio();
  const { skills } = portfolio;

  return (
    <>
      <PageMeta
        title="Skills"
        description="Technical, mathematical, and communication capabilities of Ateeq Ur Rehman across mathematics, Python, AI/ML, and interactive 3D web engineering."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealSection>
          <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
            CAPABILITIES &amp; DISCIPLINES
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Skills &amp; Technical Foundations
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            Tools, analytical frameworks, and engineering practices developed through university
            mathematics, independent builds, and classroom teaching.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <article
                key={skill.id}
                className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="font-mono">
                      {skill.indexLabel} / {skill.domain}
                    </span>
                    <span
                      className="font-mono text-xl font-semibold text-[var(--accent-secondary-ink)]"
                      aria-hidden="true"
                    >
                      {skill.symbol}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
                    {skill.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {skill.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
                  <p className="font-mono text-xs leading-relaxed text-[var(--text-primary)]">
                    {skill.topics.join(' · ')}
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] text-[var(--accent-ink)]">
                    {skill.contextLabel}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="mt-14">
          <div className="grid gap-6 md:grid-cols-2">
            <article className="glass-panel rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
                LANGUAGES
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)]">
                Communication Languages
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                  <p className="font-semibold text-[var(--text-primary)]">Urdu</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Native fluency for teaching, tutoring, and everyday collaboration.
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                  <p className="font-semibold text-[var(--text-primary)]">English</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Academic, technical documentation, and software engineering communication.
                  </p>
                </div>
              </div>
            </article>

            <article className="glass-panel flex flex-col justify-between rounded-2xl p-6 sm:p-8">
              <div>
                <p className="font-mono text-xs tracking-wider text-[var(--accent-secondary-ink)]">
                  CONTINUOUS GROWTH
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)]">
                  Explore active learning &amp; teaching
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  See what topics I am actively studying this semester or inspect the mathematics
                  curricula I teach across Class 1 to Class 12.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-5 text-sm font-medium">
                <Link
                  to="/learning"
                  className="inline-flex items-center gap-1.5 text-[var(--accent-ink)] hover:opacity-80"
                >
                  <span>Current Learning</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/teaching"
                  className="inline-flex items-center gap-1.5 text-[var(--accent-secondary-ink)] hover:opacity-80"
                >
                  <span>Mathematics Teaching</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </RevealSection>
      </section>
    </>
  );
}

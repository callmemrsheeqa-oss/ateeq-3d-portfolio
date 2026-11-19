import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { usePortfolio } from '../context/PortfolioContext';

export function Education() {
  const { portfolio } = usePortfolio();
  const { profile, educations, teachings } = portfolio;

  const visibleEducations = educations.filter((e) => !e.isPlaceholder);

  return (
    <>
      <PageMeta
        title="Education"
        description="Academic education of Ateeq Ur Rehman — BS Mathematics at CASPAM, Bahauddin Zakariya University (BZU), Multan."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealSection>
          <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
            ACADEMIC BACKGROUND
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Education &amp; Mathematical Study
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            A grounded foundation in pure and applied mathematics, logical proof, and analytical
            modeling at {profile.university}.
          </p>

          <div className="mt-12 space-y-6">
            {visibleEducations.map((edu, idx) => (
              <article key={edu.id} className="glass-panel rounded-2xl p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-accent)] bg-[var(--accent-primary)]/12 text-[var(--accent-ink)]">
                      <GraduationCap className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-mono text-xs text-[var(--accent-ink)]">
                        {String(idx + 1).padStart(2, '0')} · {edu.period}
                      </p>
                      <h2 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                        {edu.degree}
                      </h2>
                    </div>
                  </div>
                  {edu.semesterOrGrade && (
                    <span className="font-mono text-xs font-medium text-[var(--accent-secondary-ink)]">
                      {edu.semesterOrGrade}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm font-medium text-[var(--text-primary)]">
                  {edu.department ? `${edu.department}, ` : ''}
                  {edu.institution}
                  {edu.location ? ` · ${edu.location}` : ''}
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
                  {edu.description}
                </p>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="mt-16">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-wider text-[var(--accent-secondary-ink)]">
                  MATHEMATICS INSTRUCTION
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)]">
                  Teaching alongside university study
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
                  {portfolio.settings.teachingSummary}
                </p>
              </div>
              <Link
                to="/teaching"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-ink)] hover:opacity-80 whitespace-nowrap shrink-0"
              >
                <span>Inspect teaching levels ({teachings.length})</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>
    </>
  );
}

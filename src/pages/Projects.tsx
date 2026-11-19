import { useMemo, useState } from 'react';
import { Github } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { TiltProjectCard } from '../components/ui/TiltProjectCard';
import { usePortfolio } from '../context/PortfolioContext';

export function Projects() {
  const { portfolio } = usePortfolio();
  const { projects, socialLinks } = portfolio;
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const unique = new Set<string>(['All']);
    projects.forEach((p) => {
      if (p.category) unique.add(p.category);
    });
    return Array.from(unique);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory, projects]);

  const githubUrl =
    socialLinks.find((s) => s.platformKey === 'github')?.href ||
    'https://github.com/callmemrsheeqa-oss';

  return (
    <>
      <PageMeta
        title="Projects"
        description="Selected projects and explorations by Ateeq Ur Rehman spanning Finite Group Theory, AI assistants, Machine Learning, and Full-Stack Web Applications."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
              PROJECT WORKBENCH
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Builds, experiments &amp; concepts.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Every entry below reflects its real stage—finished local or live applications are
              labeled as built, while ongoing studies and architectural concepts are marked
              transparently.
            </p>
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-surface-hover)] transition-colors whitespace-nowrap shrink-0"
          >
            <Github className="h-4 w-4 text-[var(--accent-ink)]" aria-hidden="true" />
            <span>GitHub Profile</span>
          </a>
        </header>

        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter projects by domain"
          className="mt-10 inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5"
        >
          {categories.map((category) => {
            const selected = activeCategory === category;
            const count =
              category === 'All'
                ? projects.length
                : projects.filter((p) => p.category === category).length;

            return (
              <button
                key={category}
                role="tab"
                aria-selected={selected}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selected
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{category}</span>
                <span className="ml-1.5 font-mono tabular-nums opacity-75">{count}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Tilt Cards Grid */}
        <RevealSection className="mt-8">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <TiltProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </RevealSection>
      </div>
    </>
  );
}

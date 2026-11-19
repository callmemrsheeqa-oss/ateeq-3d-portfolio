import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Compass, Download, Github, Linkedin, Mail } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { MagneticButton } from '../components/ui/MagneticButton';
import { TiltProjectCard } from '../components/ui/TiltProjectCard';
import { CvModal } from '../components/ui/CvModal';
import { usePortfolio } from '../context/PortfolioContext';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export function Home() {
  const { portfolio } = usePortfolio();
  const { profile, projects, skills, socialLinks, activeCv } = portfolio;
  const [roleIndex, setRoleIndex] = useState(0);
  const [cvOpen, setCvOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { reducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    setAvatarError(false);
  }, [profile.avatarUrl]);

  const roles =
    profile.rotatingRoles && profile.rotatingRoles.length > 0
      ? profile.rotatingRoles
      : ['BS Mathematics Student (7th Semester, BZU)'];

  useEffect(() => {
    if (reducedMotion || roles.length <= 1) return;
    const interval = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, [reducedMotion, roles.length]);

  const currentRole = roles[roleIndex % roles.length];
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);
  const portraitSrc = profile.avatarUrl || '/images/profile.jpg';

  return (
    <>
      <PageMeta
        title="Home"
        description="Ateeq Ur Rehman — BS Mathematics student at CASPAM, BZU Multan, building practical systems across AI, machine learning, and creative 3D web engineering."
      />

      {/* Cinematic 3D Hero with Balanced Two-Column Portrait Composition */}
      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pt-14">
        <div className="my-auto grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
              MATHEMATICS · ARTIFICIAL INTELLIGENCE · CREATIVE SYSTEMS
            </p>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>

            {/* Animated Rotating Subtitle */}
            <div className="mt-4 flex min-h-[2.25rem] items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentRole}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg font-medium text-gradient-accent sm:text-xl"
                >
                  {currentRole}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
              {profile.tagline}
            </p>

            {/* Primary CTA Trio */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <MagneticButton to="/projects" variant="primary">
                <span>Explore My Projects</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </MagneticButton>

              <MagneticButton to="/journey" variant="secondary">
                <Compass className="h-4 w-4 text-[var(--accent-ink)]" aria-hidden="true" />
                <span>Explore Journey</span>
              </MagneticButton>

              <MagneticButton onClick={() => setCvOpen(true)} variant="ghost">
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>{activeCv ? 'Download CV' : 'View / Print CV'}</span>
              </MagneticButton>
            </div>

            {/* Clean Social Row */}
            <div className="mt-9 flex flex-wrap items-center gap-6 text-xs text-[var(--text-secondary)]">
              <span className="font-mono tracking-wider opacity-80">CHANNELS</span>
              {socialLinks
                .filter((s) => ['github', 'linkedin', 'email'].includes(s.platformKey))
                .map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--accent-ink)] transition-colors"
                  >
                    {social.platformKey === 'github' && (
                      <Github className="h-4 w-4" aria-hidden="true" />
                    )}
                    {social.platformKey === 'linkedin' && (
                      <Linkedin className="h-4 w-4" aria-hidden="true" />
                    )}
                    {social.platformKey === 'email' && (
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{social.label}</span>
                  </a>
                ))}
            </div>
          </div>

          {/* Right Column: Hero Profile Photograph integrated cleanly with 3D atmosphere */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-[320px] sm:max-w-[350px]">
              {/* Subtle dual-accent gradient perimeter */}
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-3xl opacity-75 blur-[10px]"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-primary) 0%, transparent 50%, var(--accent-secondary) 100%)',
                }}
              />
              <div
                className="relative overflow-hidden rounded-2xl p-1.5 shadow-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-primary), var(--border-subtle), var(--accent-secondary))',
                }}
              >
                <div className="relative overflow-hidden rounded-xl bg-[var(--bg-surface)]">
                  {avatarError ? (
                    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center bg-[var(--bg-surface)] text-center p-6">
                      <span className="font-display text-5xl font-bold text-[var(--accent-ink)]">
                        {profile.initials || 'AR'}
                      </span>
                      <span className="mt-2 font-mono text-xs text-[var(--text-secondary)]">
                        {profile.name}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={portraitSrc}
                      alt={`${profile.name} portrait`}
                      onError={() => setAvatarError(true)}
                      className="aspect-[4/5] w-full object-cover object-top"
                    />
                  )}

                  <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-4 py-3">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-ink)]">
                      {profile.semester} · CASPAM, BZU
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-[var(--text-primary)]">
                      {profile.degree}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Cue */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-5 text-xs text-[var(--text-secondary)]">
          <a
            href="#overview"
            className="inline-flex items-center gap-2 font-mono hover:text-[var(--accent-ink)] transition-colors"
          >
            <ArrowDown
              className={`h-3.5 w-3.5 text-[var(--accent-ink)] ${reducedMotion ? '' : 'animate-bounce'}`}
              aria-hidden="true"
            />
            <span>Scroll to explore</span>
          </a>
          <div className="hidden h-px flex-1 bg-[var(--border-subtle)] sm:block" />
          <span className="font-mono tabular-nums">{profile.coordinates} · Multan, PK</span>
        </div>
      </section>

      {/* Snapshot Section */}
      <section id="overview" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">AT A GLANCE</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Mathematical rigor meets practical engineering.
              </h2>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-ink)] hover:opacity-80 whitespace-nowrap shrink-0"
            >
              <span>Read full background</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="glass-panel glass-panel-hover rounded-2xl p-6">
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                <span className="text-[var(--accent-ink)]">01</span> · Education
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
                {profile.degree}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Currently in the {profile.semester} at {profile.department}, {profile.university} (
                {profile.educationPeriod}).
              </p>
              <Link
                to="/education"
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-ink)] hover:opacity-80"
              >
                <span>Education details</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>

            <article className="glass-panel glass-panel-hover rounded-2xl p-6">
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                <span className="text-[var(--accent-ink)]">02</span> · Teaching
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
                {portfolio.settings.teachingExperienceLabel}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Guiding learners across {portfolio.settings.teachingAudience} to understand
                mathematics intuitively, step by step.
              </p>
              <Link
                to="/teaching"
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-ink)] hover:opacity-80"
              >
                <span>Teaching &amp; subjects</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>

            <article className="glass-panel glass-panel-hover rounded-2xl p-6">
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                <span className="text-[var(--accent-ink)]">03</span> · Leadership
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
                VP, Zakariyan Google Developer Club
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Contributing to campus technology initiatives alongside prior executive work in the
                Zakarian Debating Society.
              </p>
              <Link
                to="/journey"
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-ink)] hover:opacity-80"
              >
                <span>View full journey</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </RevealSection>
      </section>

      <div className="hairline-divider mx-auto max-w-6xl" />

      {/* Featured Projects */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
                SELECTED WORK
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Projects across mathematics, AI &amp; software.
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-ink)] hover:opacity-80 whitespace-nowrap shrink-0"
            >
              <span>View all {projects.length} projects</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {displayProjects.map((project) => (
              <TiltProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </RevealSection>
      </section>

      <div className="hairline-divider mx-auto max-w-6xl" />

      {/* Selected Skills */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
                FOUNDATIONS
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Tools for thinking, modeling &amp; building.
              </h2>
            </div>
            <Link
              to="/skills"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-ink)] hover:opacity-80 whitespace-nowrap shrink-0"
            >
              <span>Explore all skills</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <article key={skill.id} className="glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span className="font-mono">
                    {skill.indexLabel} / {skill.domain}
                  </span>
                  <span
                    className="font-mono text-lg text-[var(--accent-secondary-ink)]"
                    aria-hidden="true"
                  >
                    {skill.symbol}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">
                  {skill.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {skill.description}
                </p>
                <p className="mt-4 font-mono text-xs text-[var(--text-secondary)]/85">
                  {skill.topics.join(' · ')}
                </p>
              </article>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="glass-panel flex flex-col items-start justify-between gap-8 rounded-2xl p-8 sm:p-10 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-xs tracking-wider text-[var(--accent-secondary-ink)]">
                COLLABORATION &amp; ENQUIRIES
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                Have a mathematical problem, project idea, or tutoring enquiry?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
                Reach out directly via the contact form or email me to discuss software
                collaborations, research explorations, or mathematics tuition.
              </p>
            </div>
            <MagneticButton to="/contact" variant="primary">
              <span>Start a Conversation</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
          </div>
        </RevealSection>
      </section>

      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  );
}

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
  const { reducedMotion } = useDeviceCapabilities();

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

  return (
    <>
      <PageMeta
        title="Home"
        description="Ateeq Ur Rehman — BS Mathematics student at CASPAM, BZU Multan, building practical systems across AI, machine learning, and creative 3D web engineering."
      />

      {/* Cinematic 3D Hero */}
      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="my-auto grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs tracking-wider text-[#00D9FF]">
              MATHEMATICS · ARTIFICIAL INTELLIGENCE · CREATIVE SYSTEMS
            </p>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#F4F7FF] sm:text-5xl lg:text-6xl">
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

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#A6B2C9]">
              {profile.tagline}
            </p>

            {/* Primary CTA Trio */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <MagneticButton to="/projects" variant="primary">
                <span>Explore My Projects</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </MagneticButton>

              <MagneticButton to="/about" variant="secondary">
                <Compass className="h-4 w-4 text-[#00D9FF]" aria-hidden="true" />
                <span>Discover My Journey</span>
              </MagneticButton>

              <MagneticButton onClick={() => setCvOpen(true)} variant="ghost">
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>{activeCv ? 'Download CV' : 'View / Print CV'}</span>
              </MagneticButton>
            </div>

            {/* Clean Social Row */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-[#A6B2C9]">
              <span className="font-mono tracking-wider text-[#A6B2C9]/75">CHANNELS</span>
              {socialLinks
                .filter((s) => ['github', 'linkedin', 'email'].includes(s.platformKey))
                .map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1.5 font-medium text-[#A6B2C9] hover:text-[#00D9FF] transition-colors"
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

          {/* Right column leaves unobstructed breathing room for the live 3D GeometricScene */}
          <div className="hidden lg:col-span-5 lg:flex lg:min-h-[380px] lg:flex-col lg:items-end lg:justify-end">
            <div className="rounded-xl border border-[#F4F7FF]/10 bg-[#070B18]/65 px-4 py-3 text-right">
              <p className="font-mono text-xs text-[#00D9FF]">Interactive 3D Field</p>
              <p className="mt-1 text-xs text-[#A6B2C9]">
                Move cursor to shift orbital parallax &amp; symbol vectors
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Cue */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-[#F4F7FF]/10 pt-5 text-xs text-[#A6B2C9]">
          <a
            href="#overview"
            className="inline-flex items-center gap-2 font-mono hover:text-[#00D9FF] transition-colors"
          >
            <ArrowDown
              className={`h-3.5 w-3.5 text-[#00D9FF] ${reducedMotion ? '' : 'animate-bounce'}`}
              aria-hidden="true"
            />
            <span>Scroll to explore</span>
          </a>
          <div className="hidden h-px flex-1 bg-[#F4F7FF]/10 sm:block" />
          <span className="font-mono tabular-nums">{profile.coordinates} · Multan, PK</span>
        </div>
      </section>

      {/* Snapshot Section */}
      <section id="overview" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs tracking-wider text-[#00D9FF]">AT A GLANCE</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F7FF] sm:text-4xl">
                Mathematical rigor meets practical engineering.
              </h2>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00D9FF] hover:text-[#7CE8FF] whitespace-nowrap shrink-0"
            >
              <span>Read full background</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="glass-panel glass-panel-hover rounded-2xl p-6">
              <p className="font-mono text-xs text-[#A6B2C9]">
                <span className="text-[#00D9FF]">01</span> · Education
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[#F4F7FF]">{profile.degree}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">
                Currently in the {profile.semester} at {profile.department}, {profile.university} (
                {profile.educationPeriod}).
              </p>
              <Link
                to="/about"
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[#00D9FF] hover:text-[#7CE8FF]"
              >
                <span>Academic timeline</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>

            <article className="glass-panel glass-panel-hover rounded-2xl p-6">
              <p className="font-mono text-xs text-[#A6B2C9]">
                <span className="text-[#00D9FF]">02</span> · Teaching
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[#F4F7FF]">
                {portfolio.settings.teachingExperienceLabel}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">
                Guiding learners across {portfolio.settings.teachingAudience} to understand
                mathematics intuitively, step by step.
              </p>
              <Link
                to="/teaching"
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[#00D9FF] hover:text-[#7CE8FF]"
              >
                <span>Teaching &amp; subjects</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>

            <article className="glass-panel glass-panel-hover rounded-2xl p-6">
              <p className="font-mono text-xs text-[#A6B2C9]">
                <span className="text-[#00D9FF]">03</span> · Leadership
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[#F4F7FF]">
                VP, Zakariyan Google Developer Club
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">
                Contributing to campus technology initiatives alongside prior executive work in the
                Zakarian Debating Society.
              </p>
              <Link
                to="/about"
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[#00D9FF] hover:text-[#7CE8FF]"
              >
                <span>Experience details</span>
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
              <p className="font-mono text-xs tracking-wider text-[#00D9FF]">SELECTED WORK</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F7FF] sm:text-4xl">
                Projects across mathematics, AI &amp; software.
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00D9FF] hover:text-[#7CE8FF] whitespace-nowrap shrink-0"
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
          <div>
            <p className="font-mono text-xs tracking-wider text-[#00D9FF]">FOUNDATIONS</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F7FF] sm:text-4xl">
              Tools for thinking, modeling &amp; building.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <article key={skill.id} className="glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between text-xs text-[#A6B2C9]">
                  <span className="font-mono">
                    {skill.indexLabel} / {skill.domain}
                  </span>
                  <span className="font-mono text-lg text-[#00D9FF]" aria-hidden="true">
                    {skill.symbol}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[#F4F7FF]">{skill.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">{skill.description}</p>
                <p className="mt-4 font-mono text-xs text-[#A6B2C9]/85">
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
              <p className="font-mono text-xs tracking-wider text-[#8957FF]">COLLABORATION &amp; ENQUIRIES</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#F4F7FF] sm:text-3xl">
                Have a mathematical problem, project idea, or tutoring enquiry?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#A6B2C9]">
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

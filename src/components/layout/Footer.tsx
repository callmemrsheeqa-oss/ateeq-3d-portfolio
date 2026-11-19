import { Link } from 'react-router-dom';
import { ArrowUp, Github, Globe, Instagram, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Footer() {
  const { portfolio } = usePortfolio();
  const { profile, socialLinks } = portfolio;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print relative z-10 mt-24 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/92">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="font-display text-xl font-semibold text-[var(--text-primary)]">
              {profile.name}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
              Exploring the intersection of pure mathematics, artificial intelligence, and thoughtful
              software engineering from {profile.location}.
            </p>
            <p className="mt-4 font-mono text-xs text-[var(--text-secondary)]/85">
              {profile.coordinates}
            </p>
            <div className="mt-5">
              <ThemeToggle />
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Explore
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/about" className="hover:text-[var(--accent-ink)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-[var(--accent-ink)] transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-[var(--accent-ink)] transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[var(--accent-ink)] transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/learning" className="hover:text-[var(--accent-ink)] transition-colors">
                  Learning
                </Link>
              </li>
              <li>
                <Link to="/journey" className="hover:text-[var(--accent-ink)] transition-colors">
                  Journey
                </Link>
              </li>
              <li>
                <Link to="/teaching" className="hover:text-[var(--accent-ink)] transition-colors">
                  Teaching
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[var(--accent-ink)] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/interests" className="hover:text-[var(--accent-ink)] transition-colors">
                  Interests
                </Link>
              </li>
              <li>
                <Link to="/cv" className="hover:text-[var(--accent-ink)] transition-colors">
                  CV
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Connect
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--text-secondary)]">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2.5 hover:text-[var(--accent-ink)] transition-colors"
                  >
                    {link.platformKey === 'github' && (
                      <Github className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    {link.platformKey === 'linkedin' && (
                      <Linkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    {link.platformKey === 'instagram' && (
                      <Instagram className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    {link.platformKey === 'email' && (
                      <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    {!['github', 'linkedin', 'instagram', 'email'].includes(link.platformKey) && (
                      <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {link.label} —{' '}
                      <span className="text-xs text-[var(--text-secondary)]/85">{link.handle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--text-secondary)]">
          <div className="flex flex-wrap items-center gap-4">
            <p>
              © {new Date().getFullYear()} {profile.name}. Built with React, Three.js &amp; Express.
            </p>
            <Link
              to="/admin"
              className="font-mono text-[11px] text-[var(--text-secondary)]/75 hover:text-[var(--accent-ink)] transition-colors"
            >
              Admin
            </Link>
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--accent-ink)] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

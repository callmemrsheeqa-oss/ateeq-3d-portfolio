import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { ThemeToggle } from '../ui/ThemeToggle';

const PRIMARY_NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/education', label: 'Education' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/learning', label: 'Learning' },
  { to: '/journey', label: 'Journey' },
  { to: '/interests', label: 'Interests' },
  { to: '/contact', label: 'Contact' },
  { to: '/cv', label: 'CV' },
];

const EXTRA_MOBILE_LINKS = [
  { to: '/teaching', label: 'Teaching' },
  { to: '/gallery', label: 'Gallery' },
];

export function Navbar() {
  const { portfolio } = usePortfolio();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { reducedMotion } = useDeviceCapabilities();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`no-print sticky top-0 z-40 w-full transition-colors duration-200 ${
        scrolled
          ? 'border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/94'
          : 'border-b border-transparent bg-[var(--bg-base)]/75'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line brand wordmark */}
        <Link
          to="/"
          className="font-display text-base xl:text-lg font-semibold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent-ink)] transition-colors whitespace-nowrap shrink-0"
        >
          {portfolio.profile.name}
        </Link>

        {/* Zone 2: Exact 10-item navigation */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-3.5 xl:gap-5">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative py-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'text-[var(--accent-ink)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={
                        reducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                      }
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[var(--accent-ink)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Theme Switcher + Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden xl:block">
            <ThemeToggle />
          </div>
          <div className="hidden lg:block xl:hidden">
            <ThemeToggle compact />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-accent)] lg:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-50 max-h-screen overflow-y-auto border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 pb-6 pt-3 shadow-2xl lg:hidden"
          >
            <div className="flex h-12 items-center justify-between gap-3">
              <span className="font-display text-lg font-semibold text-[var(--text-primary)]">
                {portfolio.profile.name}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  menuButtonRef.current?.focus();
                }}
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2">
              <span className="font-mono text-xs text-[var(--text-secondary)]">Appearance</span>
              <ThemeToggle />
            </div>

            <nav aria-label="Mobile links" className="mt-4 grid grid-cols-2 gap-1.5">
              {[...PRIMARY_NAV_ITEMS, ...EXTRA_MOBILE_LINKS].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)]'
                        : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

import { usePortfolio } from '../../context/PortfolioContext';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/teaching', label: 'Teaching' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/interests', label: 'Interests' },
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
          ? 'border-b border-[#F4F7FF]/10 bg-[#070B18]/92'
          : 'border-b border-transparent bg-[#070B18]/65'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line brand wordmark */}
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-[#F4F7FF] hover:text-[#00D9FF] transition-colors whitespace-nowrap shrink-0"
        >
          {portfolio.profile.name}
        </Link>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-[#00D9FF]' : 'text-[#A6B2C9] hover:text-[#F4F7FF]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#00D9FF]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] hover:bg-[#3CE4FF] transition-colors whitespace-nowrap shrink-0"
          >
            Get in Touch
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label="Open navigation menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#F4F7FF]/12 bg-[#10182B]/80 text-[#F4F7FF] hover:border-[#00D9FF]/45 md:hidden cursor-pointer"
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
            className="fixed inset-x-0 top-0 z-50 border-b border-[#F4F7FF]/12 bg-[#070B18] px-4 pb-6 pt-3 shadow-2xl md:hidden"
          >
            <div className="flex h-12 items-center justify-between">
              <span className="font-display text-lg font-semibold text-[#F4F7FF]">
                Ateeq Ur Rehman
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  menuButtonRef.current?.focus();
                }}
                aria-label="Close navigation menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#F4F7FF]/12 bg-[#10182B] text-[#F4F7FF] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile links" className="mt-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#10182B] text-[#00D9FF]'
                        : 'text-[#A6B2C9] hover:bg-[#10182B]/60 hover:text-[#F4F7FF]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                className="mt-3 flex min-h-[44px] items-center justify-center rounded-lg bg-[#00D9FF] px-4 text-sm font-semibold text-[#070B18]"
              >
                Get in Touch
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

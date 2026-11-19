import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { MuavinWidget } from '../chatbot/MuavinWidget';
import { MathUniverse } from '../three/MathUniverse';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { reducedMotion } = useDeviceCapabilities();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--accent-on-primary)]"
      >
        Skip to main content
      </a>

      <MathUniverse showHeroSculpture={isHome} />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <motion.main
          id="main-content"
          key={location.pathname}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          {children}
        </motion.main>

        <Footer />
      </div>

      <MuavinWidget />
    </div>
  );
}

import { ArrowLeft } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { MagneticButton } from '../components/ui/MagneticButton';

export function NotFound() {
  return (
    <>
      <PageMeta
        title="Page Not Found"
        description="The requested route could not be found in Ateeq Ur Rehman's portfolio."
      />

      <div className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <p className="font-mono text-sm text-[var(--accent-ink)]">∅ · ERROR 404</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
          This coordinate lies outside the domain.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
          The page you requested could not be found. Return to the main mathematical universe or
          browse selected projects.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton to="/" variant="primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Return Home</span>
          </MagneticButton>
          <MagneticButton to="/projects" variant="secondary">
            <span>View Projects</span>
          </MagneticButton>
        </div>
      </div>
    </>
  );
}

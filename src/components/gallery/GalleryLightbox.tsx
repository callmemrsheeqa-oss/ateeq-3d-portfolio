import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImageRecord } from '../../types/portfolio';

interface GalleryLightboxProps {
  images: GalleryImageRecord[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}

export function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) {
  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < images.length;
  const current = isOpen ? images[activeIndex] : null;

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        onChangeIndex((activeIndex + 1) % images.length);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        onChangeIndex((activeIndex - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose, onChangeIndex]);

  if (!isOpen || !current || activeIndex === null) return null;

  const hasMultiple = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${current.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-5 py-3.5">
          <div className="min-w-0">
            <p className="font-mono text-xs text-[var(--accent-ink)]">
              {current.category} · {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(images.length).padStart(2, '0')}
            </p>
            <h2 className="truncate text-base font-semibold text-[var(--text-primary)]">
              {current.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black/90 p-2 sm:p-4">
          <img
            src={current.imageUrl}
            alt={current.title}
            className="max-h-[68vh] w-auto max-w-full rounded-lg object-contain"
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => onChangeIndex((activeIndex - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white hover:border-[var(--accent-ink)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChangeIndex((activeIndex + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white hover:border-[var(--accent-ink)] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {current.caption && (
          <div className="border-t border-[var(--border-subtle)] px-5 py-3.5 text-sm text-[var(--text-secondary)]">
            {current.caption}
          </div>
        )}
      </div>
    </div>
  );
}

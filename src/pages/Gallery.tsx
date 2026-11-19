import { useMemo, useState } from 'react';
import { Expand, Image as ImageIcon } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { GalleryLightbox } from '../components/gallery/GalleryLightbox';
import { usePortfolio } from '../context/PortfolioContext';

export function Gallery() {
  const { portfolio, loading } = usePortfolio();
  const images = portfolio.gallery;
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    images.forEach((img) => {
      if (img.category) set.add(img.category);
    });
    return Array.from(set);
  }, [images]);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return images;
    return images.filter((img) => img.category === activeCategory);
  }, [activeCategory, images]);

  return (
    <>
      <PageMeta
        title="Photo Gallery"
        description="Curated photography, campus moments, academic events, and technical visuals uploaded by Ateeq Ur Rehman."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <header>
          <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">VISUAL ARCHIVE</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Photo Gallery
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            Moments from university life at CASPAM (BZU), developer community sessions, teaching,
            and project showcases.
          </p>
        </header>

        {images.length > 0 && (
          <div
            role="tablist"
            aria-label="Filter gallery by category"
            className="mt-10 inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5"
          >
            {categories.map((cat) => {
              const selected = activeCategory === cat;
              const count =
                cat === 'All' ? images.length : images.filter((img) => img.category === cat).length;

              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={selected}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setLightboxIndex(null);
                  }}
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="ml-1.5 font-mono tabular-nums opacity-75">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        <RevealSection className="mt-10">
          {filtered.length === 0 ? (
            <div className="glass-panel flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--accent-ink)]">
                <ImageIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold text-[var(--text-primary)]">
                {loading ? 'Loading gallery...' : 'No gallery photos published yet'}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                This gallery displays only authentic photographs uploaded through the portfolio
                dashboard—no stock or placeholder photos are ever inserted.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, idx) => (
                <article
                  key={item.id}
                  className="group glass-panel glass-panel-hover flex flex-col overflow-hidden rounded-2xl"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Open ${item.title} in fullscreen lightbox`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-base)] text-left cursor-pointer focus:outline-none"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 text-[var(--text-primary)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Expand className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <p className="font-mono text-xs text-[var(--accent-ink)]">{item.category}</p>
                      <h2 className="mt-1.5 text-lg font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h2>
                      {item.caption && (
                        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </RevealSection>
      </div>

      <GalleryLightbox
        images={filtered}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </>
  );
}

import { useState } from 'react';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { InteractiveMathArtwork } from '../components/three/InteractiveMathArtwork';
import { INTEREST_DOMAINS } from '../data/interests';

export function Interests() {
  const [selectedId, setSelectedId] = useState(INTEREST_DOMAINS[0].id);
  const [knotP, setKnotP] = useState(2);
  const [knotQ, setKnotQ] = useState(3);

  const activeInterest =
    INTEREST_DOMAINS.find((item) => item.id === selectedId) ?? INTEREST_DOMAINS[0];

  return (
    <>
      <PageMeta
        title="Interests & 3D Lab"
        description="Interactive Three.js mathematical visualizations exploring Ateeq Ur Rehman's core interests across pure mathematics, AI/ML dynamical systems, and creative technology."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <header>
          <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
            INTERACTIVE 3D EXPLORATIONS
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Ideas that keep me curious.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            Select any domain below to inspect its real-time Three.js mathematical representation.
            Drag across the canvas to orbit the geometry in three dimensions.
          </p>
        </header>

        {/* Interactive 3D Showcase Stage */}
        <section className="mt-10 grid items-stretch gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="glass-panel flex h-full flex-col justify-between rounded-2xl p-4">
              <InteractiveMathArtwork
                variant={activeInterest.artworkMode}
                parameterP={knotP}
                parameterQ={knotQ}
                className="h-80 w-full sm:h-96"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 font-mono text-xs text-[var(--text-secondary)]">
                <span className="text-[var(--accent-ink)]">{activeInterest.formulaLabel}</span>
                <span>Drag to rotate · {activeInterest.symbol}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6">
              <p className="font-mono text-xs text-[var(--accent-secondary-ink)]">
                {activeInterest.index} · ACTIVE SPECIMEN
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)]">
                {activeInterest.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-[var(--accent-ink)]">
                {activeInterest.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                {activeInterest.description}
              </p>
              <p className="mt-4 font-mono text-xs text-[var(--text-secondary)] opacity-85">
                {activeInterest.tags.join(' · ')}
              </p>

              {/* Interactive Torus Knot Harmonic Controls */}
              {activeInterest.artworkMode === 'torus-knot' && (
                <div className="mt-6 space-y-3 border-t border-[var(--border-subtle)] pt-4">
                  <p className="font-mono text-xs text-[var(--text-primary)]">
                    Harmonic Knot Parameters (p = {knotP}, q = {knotQ})
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-xs text-[var(--text-secondary)]">
                      <span className="block font-mono">p winding: {knotP}</span>
                      <input
                        type="range"
                        min={1}
                        max={7}
                        value={knotP}
                        onChange={(e) => setKnotP(Number(e.target.value))}
                        className="mt-1.5 w-full accent-[var(--accent-primary)]"
                      />
                    </label>
                    <label className="text-xs text-[var(--text-secondary)]">
                      <span className="block font-mono">q winding: {knotQ}</span>
                      <input
                        type="range"
                        min={1}
                        max={9}
                        value={knotQ}
                        onChange={(e) => setKnotQ(Number(e.target.value))}
                        className="mt-1.5 w-full accent-[var(--accent-secondary)]"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Domain Switcher Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {INTEREST_DOMAINS.map((domain) => {
                const active = domain.id === activeInterest.id;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => setSelectedId(domain.id)}
                    className={`rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/12 text-[var(--text-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span>{domain.index}</span>
                      <span
                        className={
                          active
                            ? 'text-[var(--accent-ink)]'
                            : 'text-[var(--accent-secondary-ink)]'
                        }
                      >
                        {domain.symbol}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-xs font-semibold">{domain.title}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Domains Overview Grid */}
        <section className="mt-16">
          <RevealSection>
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              All Core Focus Areas
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {INTEREST_DOMAINS.map((domain) => {
                const isSelected = domain.id === activeInterest.id;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(domain.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`glass-panel glass-panel-hover rounded-2xl p-6 text-left cursor-pointer ${
                      isSelected ? 'border-[var(--border-accent)]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
                      <span>
                        <span className="text-[var(--accent-ink)]">{domain.index}</span> ·{' '}
                        {domain.subtitle}
                      </span>
                      <span className="text-base text-[var(--accent-secondary-ink)]">
                        {domain.symbol}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
                      {domain.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {domain.description}
                    </p>
                    <p className="mt-4 font-mono text-xs text-[var(--accent-ink)]">
                      Inspect 3D model ↑
                    </p>
                  </button>
                );
              })}
            </div>
          </RevealSection>
        </section>
      </div>
    </>
  );
}

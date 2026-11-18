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
          <p className="font-mono text-xs tracking-wider text-[#00D9FF]">
            INTERACTIVE 3D EXPLORATIONS
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#F4F7FF] sm:text-5xl">
            Ideas that keep me curious.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#A6B2C9]">
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

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 font-mono text-xs text-[#A6B2C9]">
                <span className="text-[#00D9FF]">{activeInterest.formulaLabel}</span>
                <span>Drag to rotate · {activeInterest.symbol}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6">
              <p className="font-mono text-xs text-[#8957FF]">
                {activeInterest.index} · ACTIVE SPECIMEN
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#F4F7FF]">
                {activeInterest.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#00D9FF]">{activeInterest.subtitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#A6B2C9]">
                {activeInterest.description}
              </p>
              <p className="mt-4 font-mono text-xs text-[#A6B2C9]/85">
                {activeInterest.tags.join(' · ')}
              </p>

              {/* Interactive Torus Knot Harmonic Controls */}
              {activeInterest.artworkMode === 'torus-knot' && (
                <div className="mt-6 space-y-3 border-t border-[#F4F7FF]/10 pt-4">
                  <p className="font-mono text-xs text-[#F4F7FF]">
                    Harmonic Knot Parameters (p = {knotP}, q = {knotQ})
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-xs text-[#A6B2C9]">
                      <span className="block font-mono">p winding: {knotP}</span>
                      <input
                        type="range"
                        min={1}
                        max={7}
                        value={knotP}
                        onChange={(e) => setKnotP(Number(e.target.value))}
                        className="mt-1.5 w-full accent-[#00D9FF]"
                      />
                    </label>
                    <label className="text-xs text-[#A6B2C9]">
                      <span className="block font-mono">q winding: {knotQ}</span>
                      <input
                        type="range"
                        min={1}
                        max={9}
                        value={knotQ}
                        onChange={(e) => setKnotQ(Number(e.target.value))}
                        className="mt-1.5 w-full accent-[#8957FF]"
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
                        ? 'border-[#00D9FF] bg-[#00D9FF]/12 text-[#F4F7FF]'
                        : 'border-[#F4F7FF]/10 bg-[#10182B]/70 text-[#A6B2C9] hover:border-[#F4F7FF]/30 hover:text-[#F4F7FF]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span>{domain.index}</span>
                      <span className={active ? 'text-[#00D9FF]' : 'text-[#8957FF]'}>
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
            <h2 className="font-display text-2xl font-bold text-[#F4F7FF]">
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
                      isSelected ? 'border-[#00D9FF]/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs text-[#A6B2C9]">
                      <span>
                        <span className="text-[#00D9FF]">{domain.index}</span> · {domain.subtitle}
                      </span>
                      <span className="text-base text-[#8957FF]">{domain.symbol}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-[#F4F7FF]">{domain.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">
                      {domain.description}
                    </p>
                    <p className="mt-4 font-mono text-xs text-[#00D9FF]">
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

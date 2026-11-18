import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Compass, GraduationCap } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { MagneticButton } from '../components/ui/MagneticButton';
import { usePortfolio } from '../context/PortfolioContext';
import { TEACHING_METHODOLOGY } from '../data/teaching';

export function Teaching() {
  const navigate = useNavigate();
  const { portfolio } = usePortfolio();
  const { settings, teachings } = portfolio;

  const [selectedLevel, setSelectedLevel] = useState(
    teachings[2]?.level || teachings[0]?.level || 'Matric (Class 9–10)',
  );

  useEffect(() => {
    if (teachings.length > 0 && !teachings.some((t) => t.level === selectedLevel)) {
      setSelectedLevel(teachings[0].level);
    }
  }, [teachings, selectedLevel]);

  const handleEnquiry = (level: string, title?: string) => {
    const subject = title
      ? `Mathematics Tuition Enquiry (${level} — ${title})`
      : `Mathematics Tuition Enquiry (${level})`;
    navigate(`/contact?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <>
      <PageMeta
        title="Teaching"
        description="Mathematics tutoring and instruction by Ateeq Ur Rehman for Class 1 through Class 12 — building intuition, visual clarity, and stepwise problem-solving confidence."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        {/* Header */}
        <header className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="font-mono text-xs tracking-wider text-[#00D9FF]">
              MATHEMATICS INSTRUCTION
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#F4F7FF] sm:text-5xl">
              {settings.teachingHeadline}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#A6B2C9]">
              {settings.teachingSummary}
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-5 lg:col-span-4">
            <div className="space-y-2 text-xs text-[#A6B2C9]">
              <p className="font-mono text-[#00D9FF]">{settings.teachingExperienceLabel}</p>
              <p className="text-sm font-semibold text-[#F4F7FF]">{settings.teachingAudience}</p>
              <p>{settings.teachingMode}</p>
              <p className="pt-1 font-mono text-[11px] text-[#A6B2C9]/80">
                {settings.teachingLocation}
              </p>
            </div>
          </div>
        </header>

        {/* Subject Tiers */}
        <section className="mt-16">
          <RevealSection>
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[#00D9FF]">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>CURRICULUM COVERAGE</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#F4F7FF]">
              Subjects &amp; Grade Levels
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {teachings.map((tier) => (
                <article
                  key={tier.id}
                  className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-[#A6B2C9]">
                      <span>
                        <span className="text-[#00D9FF]">{tier.indexLabel}</span> · {tier.level}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-[#F4F7FF]">{tier.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">{tier.focus}</p>
                    <p className="mt-4 font-mono text-xs text-[#A6B2C9]/85">
                      {tier.topics.join(' · ')}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#F4F7FF]/10 pt-4">
                    <button
                      type="button"
                      onClick={() => handleEnquiry(tier.level, tier.title)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00D9FF] hover:text-[#7CE8FF] transition-colors cursor-pointer"
                    >
                      <span>Enquire about {tier.level}</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* Teaching Methodology */}
        <section className="mt-20">
          <RevealSection>
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[#8957FF]">
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>PEDAGOGICAL APPROACH</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#F4F7FF]">
              How lessons are structured.
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {TEACHING_METHODOLOGY.map((step) => (
                <article key={step.index} className="glass-panel rounded-2xl p-6">
                  <span className="font-mono text-xs text-[#00D9FF]">{step.index}</span>
                  <h3 className="mt-3 text-lg font-semibold text-[#F4F7FF]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">{step.description}</p>
                </article>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* Student Enquiry Launchpad */}
        <section className="mt-20">
          <RevealSection>
            <div className="glass-panel rounded-2xl p-8 sm:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#00D9FF]">
                    <GraduationCap className="h-4 w-4" aria-hidden="true" />
                    <span>STUDENT &amp; PARENT ENQUIRY</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold text-[#F4F7FF] sm:text-3xl">
                    Looking for structured mathematics guidance?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#A6B2C9]">
                    Select a grade level below to open a pre-filled enquiry on the contact
                    page—ideal for exam preparation, foundational strengthening, or regular
                    tutoring.
                  </p>

                  <div
                    role="radiogroup"
                    aria-label="Select student grade level"
                    className="mt-6 flex flex-wrap gap-2"
                  >
                    {teachings.map((tier) => {
                      const active = selectedLevel === tier.level;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedLevel(tier.level)}
                          className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            active
                              ? 'border-[#00D9FF] bg-[#00D9FF]/15 text-[#00D9FF]'
                              : 'border-[#F4F7FF]/12 bg-[#070B18]/60 text-[#A6B2C9] hover:text-[#F4F7FF]'
                          }`}
                        >
                          {tier.level}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:items-end">
                  <MagneticButton onClick={() => handleEnquiry(selectedLevel)} variant="primary">
                    <span>Send Enquiry for {selectedLevel}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </MagneticButton>
                  <p className="font-mono text-xs text-[#A6B2C9]">
                    Redirects to /contact with subject pre-filled
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>
        </section>
      </div>
    </>
  );
}

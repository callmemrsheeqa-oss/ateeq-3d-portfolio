import { useState } from 'react';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { RevealSection } from '../components/animations/RevealSection';
import { MagneticButton } from '../components/ui/MagneticButton';
import { CvModal } from '../components/ui/CvModal';
import { usePortfolio } from '../context/PortfolioContext';

export function About() {
  const { portfolio } = usePortfolio();
  const { profile, educations, experiences, skills, awards, certificates } = portfolio;
  const [imgError, setImgError] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);

  const primaryEdu = educations.find((e) => !e.isPlaceholder) || educations[0];
  const secondaryEdu = educations.filter((e) => !primaryEdu || e.id !== primaryEdu.id);
  const hasAwardsOrCerts = awards.length > 0 || certificates.length > 0;

  return (
    <>
      <PageMeta
        title="About & Journey"
        description="Educational background at CASPAM, Bahauddin Zakariya University Multan, leadership at ZGDC and ZDS, and Ateeq Ur Rehman's path across mathematics and technology."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        {/* Hero Split with Profile Portrait */}
        <section className="grid items-stretch gap-10 lg:grid-cols-12">
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="font-mono text-xs tracking-wider text-[#00D9FF]">ABOUT ME</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#F4F7FF] sm:text-5xl">
              Curious by nature. Analytical by training.
            </h1>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-[#A6B2C9]">
              {profile.aboutStory.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <blockquote className="mt-6 rounded-xl border border-[#F4F7FF]/12 bg-[#10182B]/70 p-5 text-sm italic leading-relaxed text-[#F4F7FF]">
              “{profile.philosophyQuote}”
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <MagneticButton onClick={() => setCvOpen(true)} variant="primary">
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>View / Download CV</span>
              </MagneticButton>
              <MagneticButton to="/projects" variant="secondary">
                <span>Explore Projects</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel flex h-full flex-col justify-between overflow-hidden rounded-2xl p-4">
              <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded-xl bg-[#070B18]">
                {!imgError && profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={`Portrait of ${profile.name}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#10182B] to-[#070B18] p-6 text-center">
                    <span className="font-display text-5xl font-bold text-[#00D9FF]">
                      {profile.initials}
                    </span>
                    <span className="mt-2 font-mono text-xs text-[#A6B2C9]">{profile.name}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#A6B2C9]">
                <div>
                  <p className="text-sm font-semibold text-[#F4F7FF]">{profile.name}</p>
                  <p className="mt-0.5">
                    {profile.degree} · {profile.semester}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[#A6B2C9]">
                    Languages: <span className="text-[#F4F7FF]">Urdu</span> ·{' '}
                    <span className="text-[#F4F7FF]">English</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[#00D9FF]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Multan, PK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mt-20">
          <RevealSection>
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[#00D9FF]">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              <span>EDUCATION</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#F4F7FF]">
              Academic Foundation at CASPAM
            </h2>

            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              {primaryEdu && (
                <div className="glass-panel rounded-2xl p-6 sm:p-8 lg:col-span-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#A6B2C9]">
                    <span className="text-[#00D9FF]">
                      {primaryEdu.period}
                      {primaryEdu.semesterOrGrade ? ` · ${primaryEdu.semesterOrGrade}` : ''}
                    </span>
                    <span>{primaryEdu.institution}</span>
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold text-[#F4F7FF]">
                    {primaryEdu.degree}
                  </h3>
                  {primaryEdu.department && (
                    <p className="mt-1.5 text-sm font-medium text-[#A6B2C9]">
                      {primaryEdu.department}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-[#A6B2C9]">{primaryEdu.location}</p>

                  <p className="mt-5 text-sm leading-relaxed text-[#A6B2C9]">
                    {primaryEdu.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-6 lg:col-span-4">
                {secondaryEdu.map((edu) => (
                  <div
                    key={edu.id}
                    className="glass-panel flex flex-1 flex-col justify-between rounded-2xl p-6"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-[#8957FF]">
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        <span>{edu.period || 'PRIOR QUALIFICATIONS'}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-[#F4F7FF]">{edu.degree}</h3>
                      {!edu.isPlaceholder && (
                        <p className="mt-1 text-xs font-medium text-[#00D9FF]">{edu.institution}</p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">
                        {edu.description}
                      </p>
                    </div>
                    <p className="mt-6 font-mono text-xs text-[#A6B2C9]/80">
                      {edu.isPlaceholder
                        ? 'Verified data only · No assumed dates or grades'
                        : edu.semesterOrGrade || edu.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </section>

        {/* Experience & Leadership Timeline */}
        <section className="mt-20">
          <RevealSection>
            <p className="font-mono text-xs tracking-wider text-[#00D9FF]">EXPERIENCE &amp; LEADERSHIP</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#F4F7FF]">
              Learning through teaching, leadership &amp; practice.
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {experiences.map((item) => (
                <article key={item.id} className="glass-panel rounded-2xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#A6B2C9]">
                    <span>
                      <span className="text-[#00D9FF]">{item.indexLabel}</span> · {item.category}
                    </span>
                    <span className="tabular-nums">{item.period}</span>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold text-[#F4F7FF]">{item.title}</h3>
                  <p className="mt-1 text-sm font-medium text-[#00D9FF]">
                    {item.organization} · <span className="text-[#A6B2C9]">{item.location}</span>
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[#A6B2C9]">{item.summary}</p>

                  {item.highlights.length > 0 && (
                    <p className="mt-4 font-mono text-xs text-[#A6B2C9]/85">
                      {item.highlights.join(' · ')}
                    </p>
                  )}

                  {item.takeaway && (
                    <p className="mt-4 border-t border-[#F4F7FF]/10 pt-3 text-xs text-[#F4F7FF]/90">
                      Takeaway: {item.takeaway}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* Conditional Awards & Certificates Section — Hidden when empty */}
        {hasAwardsOrCerts && (
          <section className="mt-20">
            <RevealSection>
              <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[#00D9FF]">
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>HONORS &amp; CREDENTIALS</span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#F4F7FF]">
                Awards &amp; Certificates
              </h2>

              {awards.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {awards.map((award) => (
                    <article key={award.id} className="glass-panel flex flex-col justify-between rounded-2xl p-6">
                      <div>
                        {award.imageUrl && (
                          <div className="mb-4 overflow-hidden rounded-xl border border-[#F4F7FF]/10 bg-[#070B18]">
                            <img
                              src={award.imageUrl}
                              alt={award.title}
                              loading="lazy"
                              className="h-44 w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#A6B2C9]">
                          <span className="text-[#00D9FF]">{award.issuer}</span>
                          {award.awardDate && <span>{award.awardDate}</span>}
                        </div>
                        <h3 className="mt-2 text-xl font-semibold text-[#F4F7FF]">{award.title}</h3>
                        {award.description && (
                          <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">
                            {award.description}
                          </p>
                        )}
                      </div>
                      {(award.certificatePdfUrl || award.verificationUrl) && (
                        <div className="mt-4 flex flex-wrap gap-4 border-t border-[#F4F7FF]/10 pt-3 text-xs font-medium">
                          {award.certificatePdfUrl && (
                            <a
                              href={award.certificatePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#00D9FF] hover:text-[#7CE8FF]"
                            >
                              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>View PDF</span>
                            </a>
                          )}
                          {award.verificationUrl && (
                            <a
                              href={award.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#A6B2C9] hover:text-[#F4F7FF]"
                            >
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Verify Credential</span>
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {certificates.length > 0 && (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((cert) => (
                    <article key={cert.id} className="glass-panel flex flex-col justify-between rounded-2xl p-6">
                      <div>
                        {cert.imageUrl && (
                          <div className="mb-4 overflow-hidden rounded-xl border border-[#F4F7FF]/10 bg-[#070B18]">
                            <img
                              src={cert.imageUrl}
                              alt={cert.title}
                              loading="lazy"
                              className="h-40 w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#A6B2C9]">
                          <span className="text-[#8957FF]">{cert.issuer}</span>
                          {cert.issueDate && <span>{cert.issueDate}</span>}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-[#F4F7FF]">{cert.title}</h3>
                        {cert.description && (
                          <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">
                            {cert.description}
                          </p>
                        )}
                      </div>
                      {(cert.pdfUrl || cert.verificationUrl) && (
                        <div className="mt-4 flex flex-wrap gap-4 border-t border-[#F4F7FF]/10 pt-3 text-xs font-medium">
                          {cert.pdfUrl && (
                            <a
                              href={cert.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#00D9FF] hover:text-[#7CE8FF]"
                            >
                              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Certificate PDF</span>
                            </a>
                          )}
                          {cert.verificationUrl && (
                            <a
                              href={cert.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#A6B2C9] hover:text-[#F4F7FF]"
                            >
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Verify</span>
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </RevealSection>
          </section>
        )}

        {/* Skills & Working Principles */}
        <section className="mt-20">
          <RevealSection>
            <p className="font-mono text-xs tracking-wider text-[#00D9FF]">CAPABILITIES &amp; PRINCIPLES</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#F4F7FF]">
              Technical foundations &amp; habits.
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <article key={skill.id} className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center justify-between font-mono text-xs text-[#A6B2C9]">
                    <span>{skill.contextLabel}</span>
                    <span className="text-base text-[#00D9FF]">{skill.symbol}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[#F4F7FF]">{skill.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A6B2C9]">{skill.description}</p>
                  <p className="mt-4 font-mono text-xs text-[#A6B2C9]/80">
                    {skill.topics.join(' · ')}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {profile.principles.map((p) => (
                <div key={p.index} className="rounded-2xl border border-[#F4F7FF]/10 bg-[#10182B]/45 p-6">
                  <span className="font-mono text-xs text-[#8957FF]">{p.index}</span>
                  <h3 className="mt-2 text-lg font-semibold text-[#F4F7FF]">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#A6B2C9]">{p.body}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </section>
      </div>

      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  );
}

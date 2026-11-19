import { useState } from 'react';
import { Link } from 'react-router-dom';
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
            <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">ABOUT ME</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Curious by nature. Analytical by training.
            </h1>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
              {profile.aboutStory.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <blockquote className="mt-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-sm italic leading-relaxed text-[var(--text-primary)]">
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
              <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]">
                {!imgError && profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={`Portrait of ${profile.name}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--bg-surface)] p-6 text-center">
                    <span className="font-display text-5xl font-bold text-[var(--accent-ink)]">
                      {profile.initials}
                    </span>
                    <span className="mt-2 font-mono text-xs text-[var(--text-secondary)]">
                      {profile.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[var(--text-secondary)]">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{profile.name}</p>
                  <p className="mt-0.5">
                    {profile.degree} · {profile.semester}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--text-secondary)]">
                    Languages: <span className="text-[var(--text-primary)]">Urdu</span> ·{' '}
                    <span className="text-[var(--text-primary)]">English</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[var(--accent-ink)]">
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
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[var(--accent-ink)]">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  <span>EDUCATION</span>
                </div>
                <h2 className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)]">
                  Academic Foundation at CASPAM
                </h2>
              </div>
              <Link
                to="/education"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-ink)] hover:text-[var(--accent-secondary-ink)] transition-colors"
              >
                <span>Full Education View</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              {primaryEdu && (
                <div className="glass-panel rounded-2xl p-6 sm:p-8 lg:col-span-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-ink)]">
                      {primaryEdu.period}
                      {primaryEdu.semesterOrGrade ? ` · ${primaryEdu.semesterOrGrade}` : ''}
                    </span>
                    <span>{primaryEdu.institution}</span>
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
                    {primaryEdu.degree}
                  </h3>
                  {primaryEdu.department && (
                    <p className="mt-1.5 text-sm font-medium text-[var(--text-secondary)]">
                      {primaryEdu.department}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{primaryEdu.location}</p>

                  <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
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
                      <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-secondary-ink)]">
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        <span>{edu.period || 'PRIOR QUALIFICATIONS'}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">
                        {edu.degree}
                      </h3>
                      {!edu.isPlaceholder && (
                        <p className="mt-1 text-xs font-medium text-[var(--accent-ink)]">
                          {edu.institution}
                        </p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {edu.description}
                      </p>
                    </div>
                    <p className="mt-6 font-mono text-xs text-[var(--text-secondary)] opacity-85">
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
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
                  EXPERIENCE &amp; LEADERSHIP
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)]">
                  Learning through teaching, leadership &amp; practice.
                </h2>
              </div>
              <Link
                to="/journey"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-ink)] hover:text-[var(--accent-secondary-ink)] transition-colors"
              >
                <span>Open Journey Timeline</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {experiences.map((item) => (
                <article key={item.id} className="glass-panel rounded-2xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--text-secondary)]">
                    <span>
                      <span className="text-[var(--accent-ink)]">{item.indexLabel}</span> ·{' '}
                      {item.category}
                    </span>
                    <span className="tabular-nums">{item.period}</span>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[var(--accent-ink)]">
                    {item.organization} ·{' '}
                    <span className="text-[var(--text-secondary)]">{item.location}</span>
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.summary}
                  </p>

                  {item.highlights.length > 0 && (
                    <p className="mt-4 font-mono text-xs text-[var(--text-secondary)] opacity-85">
                      {item.highlights.join(' · ')}
                    </p>
                  )}

                  {item.takeaway && (
                    <p className="mt-4 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-primary)]">
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
              <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[var(--accent-ink)]">
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>HONORS &amp; CREDENTIALS</span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)]">
                Awards &amp; Certificates
              </h2>

              {awards.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {awards.map((award) => (
                    <article
                      key={award.id}
                      className="glass-panel flex flex-col justify-between rounded-2xl p-6"
                    >
                      <div>
                        {award.imageUrl && (
                          <div className="mb-4 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]">
                            <img
                              src={award.imageUrl}
                              alt={award.title}
                              loading="lazy"
                              className="h-44 w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--text-secondary)]">
                          <span className="text-[var(--accent-ink)]">{award.issuer}</span>
                          {award.awardDate && <span>{award.awardDate}</span>}
                        </div>
                        <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                          {award.title}
                        </h3>
                        {award.description && (
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {award.description}
                          </p>
                        )}
                      </div>
                      {(award.certificatePdfUrl || award.verificationUrl) && (
                        <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--border-subtle)] pt-3 text-xs font-medium">
                          {award.certificatePdfUrl && (
                            <a
                              href={award.certificatePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[var(--accent-ink)] hover:underline"
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
                              className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
                    <article
                      key={cert.id}
                      className="glass-panel flex flex-col justify-between rounded-2xl p-6"
                    >
                      <div>
                        {cert.imageUrl && (
                          <div className="mb-4 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]">
                            <img
                              src={cert.imageUrl}
                              alt={cert.title}
                              loading="lazy"
                              className="h-40 w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--text-secondary)]">
                          <span className="text-[var(--accent-secondary-ink)]">{cert.issuer}</span>
                          {cert.issueDate && <span>{cert.issueDate}</span>}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                          {cert.title}
                        </h3>
                        {cert.description && (
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {cert.description}
                          </p>
                        )}
                      </div>
                      {(cert.pdfUrl || cert.verificationUrl) && (
                        <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--border-subtle)] pt-3 text-xs font-medium">
                          {cert.pdfUrl && (
                            <a
                              href={cert.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[var(--accent-ink)] hover:underline"
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
                              className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-wider text-[var(--accent-ink)]">
                  CAPABILITIES &amp; PRINCIPLES
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)]">
                  Technical foundations &amp; habits.
                </h2>
              </div>
              <Link
                to="/skills"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-ink)] hover:text-[var(--accent-secondary-ink)] transition-colors"
              >
                <span>Open Skills View</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <article key={skill.id} className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
                    <span>{skill.contextLabel}</span>
                    <span className="text-base text-[var(--accent-ink)]">{skill.symbol}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">
                    {skill.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {skill.description}
                  </p>
                  <p className="mt-4 font-mono text-xs text-[var(--text-secondary)] opacity-85">
                    {skill.topics.join(' · ')}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {profile.principles.map((p) => (
                <div
                  key={p.index}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
                >
                  <span className="font-mono text-xs text-[var(--accent-secondary-ink)]">
                    {p.index}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{p.body}</p>
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

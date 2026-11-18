import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  EXPERIENCE_TIMELINE,
  PROFILE,
  SKILL_GROUPS,
  SOCIAL_LINKS,
} from '../data/profile';
import { PORTFOLIO_PROJECTS } from '../data/projects';
import { TEACHING_PROFILE, TEACHING_SUBJECTS } from '../data/teaching';
import type { PublicPortfolioBundle } from '../types/portfolio';

const FALLBACK_BUNDLE: PublicPortfolioBundle = {
  profile: {
    id: 1,
    name: PROFILE.name,
    initials: PROFILE.initials,
    tagline: PROFILE.tagline,
    rotatingRoles: PROFILE.rotatingRoles,
    location: PROFILE.location,
    coordinates: PROFILE.coordinates,
    email: PROFILE.email,
    avatarUrl: PROFILE.avatarPath,
    degree: PROFILE.education.degree,
    semester: PROFILE.education.semester,
    educationPeriod: PROFILE.education.period,
    department: PROFILE.education.department,
    university: PROFILE.education.university,
    educationFocus: PROFILE.education.focus,
    previousNote: PROFILE.education.previousNote,
    philosophyQuote: PROFILE.philosophyQuote,
    aboutStory: PROFILE.aboutStory,
    principles: PROFILE.principles,
  },
  settings: {
    id: 1,
    siteTitle: 'Ateeq Ur Rehman — Mathematics, AI & Creative Technology',
    siteTagline: 'A Mathematical Mind in a Futuristic Digital Universe',
    muavinEnabled: true,
    muavinWelcomeMessage:
      'Hello! I am Muavin AI, Ateeq Ur Rehman’s portfolio assistant. Ask me about his BS Mathematics studies at CASPAM (BZU), projects, teaching experience, skills, or contact details.',
    muavinSystemTone: 'Concise, accurate, and grounded.',
    teachingHeadline: TEACHING_PROFILE.headline,
    teachingSummary: TEACHING_PROFILE.summary,
    teachingAudience: TEACHING_PROFILE.audienceRange,
    teachingExperienceLabel: TEACHING_PROFILE.experienceDuration,
    teachingMode: TEACHING_PROFILE.mode,
    teachingLocation: TEACHING_PROFILE.location,
  },
  projects: PORTFOLIO_PROJECTS.map((p, idx) => ({
    id: idx + 1,
    slug: p.slug,
    indexLabel: p.index,
    title: p.title,
    shortTitle: p.shortTitle,
    category: p.category,
    status: p.status,
    mathSymbol: p.mathSymbol,
    motif: p.motif,
    tagline: p.tagline,
    summary: p.summary,
    problem: p.problem,
    approach: p.approach,
    mathematicalConnection: p.mathematicalConnection,
    notes: p.notes,
    techStack: p.techStack,
    features: p.features,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    featured: p.featured,
    published: true,
    sortOrder: idx + 1,
  })),
  skills: SKILL_GROUPS.map((s, idx) => ({
    id: idx + 1,
    slug: s.id,
    indexLabel: s.index,
    symbol: s.symbol,
    domain: s.domain,
    title: s.title,
    description: s.description,
    topics: s.topics,
    contextLabel: s.contextLabel,
    published: true,
    sortOrder: idx + 1,
  })),
  educations: [
    {
      id: 1,
      degree: PROFILE.education.degree,
      institution: PROFILE.education.university,
      department: PROFILE.education.department,
      location: PROFILE.location,
      period: PROFILE.education.period,
      semesterOrGrade: PROFILE.education.semester,
      description: PROFILE.education.focus,
      isPlaceholder: false,
      published: true,
      sortOrder: 1,
    },
    {
      id: 2,
      degree: 'Earlier Academic History',
      institution: 'To Be Updated',
      department: '',
      location: PROFILE.location,
      period: 'Prior Qualifications',
      semesterOrGrade: '',
      description: PROFILE.education.previousNote,
      isPlaceholder: true,
      published: true,
      sortOrder: 2,
    },
  ],
  experiences: EXPERIENCE_TIMELINE.map((e, idx) => ({
    id: idx + 1,
    indexLabel: e.index,
    category: e.category,
    title: e.title,
    organization: e.organization,
    period: e.period,
    location: e.location,
    summary: e.summary,
    highlights: e.highlights,
    takeaway: e.takeaway,
    published: true,
    sortOrder: idx + 1,
  })),
  teachings: TEACHING_SUBJECTS.map((t, idx) => ({
    id: idx + 1,
    indexLabel: t.index,
    level: t.level,
    title: t.title,
    focus: t.focus,
    topics: t.topics,
    published: true,
    sortOrder: idx + 1,
  })),
  awards: [],
  certificates: [],
  gallery: [],
  activeCv: null,
  socialLinks: SOCIAL_LINKS.map((s, idx) => ({
    id: idx + 1,
    platformKey: s.id,
    label: s.label,
    handle: s.handle,
    href: s.href,
    description: s.description,
    external: s.external,
    published: true,
    sortOrder: idx + 1,
  })),
};

interface PortfolioContextValue {
  portfolio: PublicPortfolioBundle;
  loading: boolean;
  refreshPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue>({
  portfolio: FALLBACK_BUNDLE,
  loading: false,
  refreshPortfolio: async () => {},
});

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<PublicPortfolioBundle>(FALLBACK_BUNDLE);
  const [loading, setLoading] = useState(true);

  const refreshPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio', { credentials: 'include' });
      if (!res.ok) return;
      const json = await res.json();
      if (json?.ok && json?.data) {
        const d = json.data as Partial<PublicPortfolioBundle>;
        setPortfolio((prev) => ({
          profile: d.profile || prev.profile,
          settings: d.settings || prev.settings,
          projects: Array.isArray(d.projects) ? d.projects : prev.projects,
          skills: Array.isArray(d.skills) ? d.skills : prev.skills,
          educations: Array.isArray(d.educations) ? d.educations : prev.educations,
          experiences: Array.isArray(d.experiences) ? d.experiences : prev.experiences,
          teachings: Array.isArray(d.teachings) ? d.teachings : prev.teachings,
          awards: Array.isArray(d.awards) ? d.awards : [],
          certificates: Array.isArray(d.certificates) ? d.certificates : [],
          gallery: Array.isArray(d.gallery) ? d.gallery : [],
          activeCv: d.activeCv ?? null,
          socialLinks: Array.isArray(d.socialLinks) ? d.socialLinks : prev.socialLinks,
        }));
      }
    } catch {
      // Keep verified baseline content available if API is temporarily unreachable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  return (
    <PortfolioContext.Provider value={{ portfolio, loading, refreshPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}

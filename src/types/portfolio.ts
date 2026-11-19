export interface ProfilePrincipleRecord {
  index: string;
  title: string;
  body: string;
}

export interface ProfileRecord {
  id: number;
  name: string;
  initials: string;
  tagline: string;
  rotatingRoles: string[];
  location: string;
  coordinates: string;
  email: string;
  avatarUrl: string;
  degree: string;
  semester: string;
  educationPeriod: string;
  department: string;
  university: string;
  educationFocus: string;
  previousNote: string;
  philosophyQuote: string;
  aboutStory: string[];
  principles: ProfilePrincipleRecord[];
}

export interface SiteSettingsRecord {
  id: number;
  siteTitle: string;
  siteTagline: string;
  muavinEnabled: boolean;
  muavinWelcomeMessage: string;
  muavinSystemTone: string;
  muavinSuggestedQuestions: string[];
  teachingHeadline: string;
  teachingSummary: string;
  teachingAudience: string;
  teachingExperienceLabel: string;
  teachingMode: string;
  teachingLocation: string;
}

export interface ProjectRecord {
  id: number;
  slug: string;
  indexLabel: string;
  title: string;
  shortTitle: string;
  category: string;
  status: string;
  mathSymbol: string;
  motif: string;
  tagline: string;
  summary: string;
  problem: string;
  approach: string;
  mathematicalConnection: string;
  notes: string;
  techStack: string[];
  features: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export interface SkillRecord {
  id: number;
  slug: string;
  indexLabel: string;
  symbol: string;
  domain: string;
  title: string;
  description: string;
  topics: string[];
  contextLabel: string;
  published: boolean;
  sortOrder: number;
}

export interface EducationRecord {
  id: number;
  degree: string;
  institution: string;
  department: string;
  location: string;
  period: string;
  semesterOrGrade: string;
  description: string;
  isPlaceholder: boolean;
  published: boolean;
  sortOrder: number;
}

export interface ExperienceRecord {
  id: number;
  indexLabel: string;
  category: string;
  title: string;
  organization: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  takeaway: string;
  published: boolean;
  sortOrder: number;
}

export interface TeachingRecord {
  id: number;
  indexLabel: string;
  level: string;
  title: string;
  focus: string;
  topics: string[];
  published: boolean;
  sortOrder: number;
}

export interface AwardRecord {
  id: number;
  title: string;
  issuer: string;
  awardDate: string;
  description: string;
  imageUrl: string | null;
  certificatePdfUrl: string | null;
  verificationUrl: string | null;
  published: boolean;
  sortOrder: number;
}

export interface CertificateRecord {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  imageUrl: string | null;
  pdfUrl: string | null;
  verificationUrl: string | null;
  published: boolean;
  sortOrder: number;
}

export interface GalleryImageRecord {
  id: number;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  storedFilename: string;
  mimeType: string;
  fileSize: number;
  isProfilePhoto: boolean;
  published: boolean;
  sortOrder: number;
}

export interface ActiveCvSummary {
  id: number;
  title: string;
  originalFilename: string;
  fileSize: number;
  updatedAt: string;
}

export interface SocialLinkRecord {
  id: number;
  platformKey: string;
  label: string;
  handle: string;
  href: string;
  description: string;
  external: boolean;
  published: boolean;
  sortOrder: number;
}

export interface LearningItemRecord {
  id: number;
  indexLabel: string;
  category: string;
  title: string;
  focus: string;
  resources: string[];
  status: string;
  published: boolean;
  sortOrder: number;
}

export interface JourneyMilestoneRecord {
  id: number;
  indexLabel: string;
  period: string;
  phase: string;
  title: string;
  organization: string;
  location: string;
  summary: string;
  tags: string[];
  published: boolean;
  sortOrder: number;
}

export interface PublicPortfolioBundle {
  profile: ProfileRecord;
  settings: SiteSettingsRecord;
  projects: ProjectRecord[];
  skills: SkillRecord[];
  educations: EducationRecord[];
  experiences: ExperienceRecord[];
  teachings: TeachingRecord[];
  learningItems: LearningItemRecord[];
  journeyMilestones: JourneyMilestoneRecord[];
  awards: AwardRecord[];
  certificates: CertificateRecord[];
  gallery: GalleryImageRecord[];
  activeCv: ActiveCvSummary | null;
  socialLinks: SocialLinkRecord[];
}

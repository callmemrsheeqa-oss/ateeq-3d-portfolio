import { count, eq } from 'drizzle-orm';
import { db } from '../../src/db/index.ts';
import {
  adminUsers,
  aiKnowledge,
  educations,
  experiences,
  profiles,
  projects,
  siteSettings,
  skills,
  socialLinks,
  teachings,
} from '../../src/db/schema.ts';
import {
  EXPERIENCE_TIMELINE,
  PROFILE,
  SKILL_GROUPS,
  SOCIAL_LINKS,
} from '../../src/data/profile.ts';
import { PORTFOLIO_PROJECTS } from '../../src/data/projects.ts';
import { TEACHING_PROFILE, TEACHING_SUBJECTS } from '../../src/data/teaching.ts';
import { hashPassword } from '../utils/crypto.ts';

let seedPromise: Promise<void> | null = null;

async function runIdempotentSeed(): Promise<void> {
  try {
    // 1. Ensure Profile row exists
    const [{ value: profileCount }] = await db.select({ value: count() }).from(profiles);
    if (profileCount === 0) {
      await db.insert(profiles).values({
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
      });
    }

    // 2. Ensure SiteSettings row exists
    const [{ value: settingsCount }] = await db.select({ value: count() }).from(siteSettings);
    if (settingsCount === 0) {
      await db.insert(siteSettings).values({
        siteTitle: 'Ateeq Ur Rehman — Mathematics, AI & Creative Technology',
        siteTagline: 'A Mathematical Mind in a Futuristic Digital Universe',
        muavinEnabled: true,
        muavinWelcomeMessage:
          'Hello! I am Muavin AI, Ateeq Ur Rehman’s portfolio assistant. Ask me about his BS Mathematics studies at CASPAM (BZU), projects, teaching experience, skills, or contact details.',
        muavinSystemTone:
          'Concise, accurate, respectful, mathematically literate, and strictly grounded in Ateeq Ur Rehman’s published portfolio database.',
        teachingHeadline: TEACHING_PROFILE.headline,
        teachingSummary: TEACHING_PROFILE.summary,
        teachingAudience: TEACHING_PROFILE.audienceRange,
        teachingExperienceLabel: TEACHING_PROFILE.experienceDuration,
        teachingMode: TEACHING_PROFILE.mode,
        teachingLocation: TEACHING_PROFILE.location,
      });
    }

    // 3. Migrate verified Educations if empty
    const [{ value: eduCount }] = await db.select({ value: count() }).from(educations);
    if (eduCount === 0) {
      await db.insert(educations).values([
        {
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
      ]);
    }

    // 4. Migrate verified Projects if empty
    const [{ value: projCount }] = await db.select({ value: count() }).from(projects);
    if (projCount === 0) {
      await db.insert(projects).values(
        PORTFOLIO_PROJECTS.map((p, idx) => ({
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
      );
    }

    // 5. Migrate verified Skills if empty
    const [{ value: skillCount }] = await db.select({ value: count() }).from(skills);
    if (skillCount === 0) {
      await db.insert(skills).values(
        SKILL_GROUPS.map((s, idx) => ({
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
      );
    }

    // 6. Migrate verified Experiences if empty
    const [{ value: expCount }] = await db.select({ value: count() }).from(experiences);
    if (expCount === 0) {
      await db.insert(experiences).values(
        EXPERIENCE_TIMELINE.map((e, idx) => ({
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
      );
    }

    // 7. Migrate verified Teachings if empty
    const [{ value: teachCount }] = await db.select({ value: count() }).from(teachings);
    if (teachCount === 0) {
      await db.insert(teachings).values(
        TEACHING_SUBJECTS.map((t, idx) => ({
          indexLabel: t.index,
          level: t.level,
          title: t.title,
          focus: t.focus,
          topics: t.topics,
          published: true,
          sortOrder: idx + 1,
        })),
      );
    }

    // 8. Migrate verified Social Links if empty
    const [{ value: socialCount }] = await db.select({ value: count() }).from(socialLinks);
    if (socialCount === 0) {
      await db.insert(socialLinks).values(
        SOCIAL_LINKS.map((s, idx) => ({
          platformKey: s.id,
          label: s.label,
          handle: s.handle,
          href: s.href,
          description: s.description,
          external: s.external,
          published: true,
          sortOrder: idx + 1,
        })),
      );
    }

    // 9. Migrate baseline AI Knowledge entries if empty
    const [{ value: aiCount }] = await db.select({ value: count() }).from(aiKnowledge);
    if (aiCount === 0) {
      await db.insert(aiKnowledge).values([
        {
          title: 'Portfolio Navigation Guide',
          category: 'Navigation',
          content:
            'Visitors can explore Home (/), About & Journey (/about), Projects (/projects), Teaching (/teaching), Interactive 3D Interests (/interests), Photo Gallery (/gallery), and Contact (/contact).',
          keywords: ['pages', 'routes', 'navigation', 'gallery', 'contact', 'teaching'],
          published: true,
          sortOrder: 1,
        },
        {
          title: 'CV & Awards Policy',
          category: 'Transparency',
          content:
            'If no CV PDF or published awards have been uploaded yet by Ateeq, state honestly that they have not been uploaded or published yet rather than inventing credentials.',
          keywords: ['cv', 'resume', 'awards', 'certificates'],
          published: true,
          sortOrder: 2,
        },
        {
          title: 'Languages',
          category: 'Profile',
          content: 'Ateeq Ur Rehman’s languages are Urdu and English.',
          keywords: ['languages', 'urdu', 'english'],
          published: true,
          sortOrder: 3,
        },
      ]);
    }

    // 10. Optional environment-based initial admin bootstrap (never hardcoded password)
    const adminEmail = (
      process.env.ADMIN_INITIAL_EMAIL ||
      process.env.ADMIN_EMAIL ||
      PROFILE.email
    )
      .trim()
      .toLowerCase();
    const adminPass = process.env.ADMIN_INITIAL_PASSWORD?.trim();

    if (adminEmail) {
      const existing = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, adminEmail));

      if (existing.length === 0) {
        await db.insert(adminUsers).values({
          email: adminEmail,
          displayName: PROFILE.name,
          passwordHash: adminPass ? hashPassword(adminPass) : null,
          role: 'admin',
          isActive: true,
        });
      } else if (adminPass && !existing[0].passwordHash) {
        await db
          .update(adminUsers)
          .set({ passwordHash: hashPassword(adminPass), updatedAt: new Date() })
          .where(eq(adminUsers.id, existing[0].id));
      }
    }
  } catch (error) {
    console.error('Database seed failed:', error);
    throw new Error('Failed to initialize portfolio database records.', { cause: error });
  }
}

export async function ensureInitialDataSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runIdempotentSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

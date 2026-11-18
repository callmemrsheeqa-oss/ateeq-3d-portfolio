import type { Response } from 'express';
import fs from 'node:fs';
import { asc, count, desc, eq } from 'drizzle-orm';
import { db } from '../../src/db/index.ts';
import {
  aiKnowledge,
  awards,
  certificates,
  contactMessages,
  cvDocuments,
  educations,
  experiences,
  galleryImages,
  profiles,
  projects,
  siteSettings,
  skills,
  socialLinks,
  teachings,
} from '../../src/db/schema.ts';
import type { AdminRequest } from '../middleware/auth.ts';
import { ensureInitialDataSeeded } from '../services/seedService.ts';
import { deleteStoredFile, verifyPdfMagicBytes } from '../utils/storage.ts';

function parseId(raw: string | string[] | undefined): number | null {
  const str = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(str);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getAdminOverview(_req: AdminRequest, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const [
      [projCount],
      [skillCount],
      [eduCount],
      [expCount],
      [teachCount],
      [awardCount],
      [certCount],
      [galleryCount],
      [unreadMsgCount],
      [totalMsgCount],
      [aiCount],
      activeCvRows,
      profileRows,
      settingsRows,
    ] = await Promise.all([
      db.select({ value: count() }).from(projects),
      db.select({ value: count() }).from(skills),
      db.select({ value: count() }).from(educations),
      db.select({ value: count() }).from(experiences),
      db.select({ value: count() }).from(teachings),
      db.select({ value: count() }).from(awards),
      db.select({ value: count() }).from(certificates),
      db.select({ value: count() }).from(galleryImages),
      db
        .select({ value: count() })
        .from(contactMessages)
        .where(eq(contactMessages.isRead, false)),
      db.select({ value: count() }).from(contactMessages),
      db.select({ value: count() }).from(aiKnowledge),
      db
        .select()
        .from(cvDocuments)
        .where(eq(cvDocuments.isActive, true))
        .orderBy(desc(cvDocuments.updatedAt))
        .limit(1),
      db.select().from(profiles).limit(1),
      db.select().from(siteSettings).limit(1),
    ]);

    res.status(200).json({
      ok: true,
      counts: {
        projects: projCount.value,
        skills: skillCount.value,
        educations: eduCount.value,
        experiences: expCount.value,
        teachings: teachCount.value,
        awards: awardCount.value,
        certificates: certCount.value,
        gallery: galleryCount.value,
        unreadMessages: unreadMsgCount.value,
        totalMessages: totalMsgCount.value,
        aiKnowledge: aiCount.value,
      },
      activeCv: activeCvRows[0] || null,
      profile: profileRows[0] || null,
      settings: settingsRows[0] || null,
    });
  } catch (error) {
    console.error('getAdminOverview error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load dashboard overview.' });
  }
}

export async function updateAdminProfile(req: AdminRequest, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const b = req.body as Record<string, unknown>;
    const existing = await db.select().from(profiles).limit(1);
    if (existing.length === 0) {
      res.status(404).json({ ok: false, error: 'Profile record not found.' });
      return;
    }

    const current = existing[0];
    const [updated] = await db
      .update(profiles)
      .set({
        name: typeof b.name === 'string' && b.name.trim() ? b.name.trim() : current.name,
        initials:
          typeof b.initials === 'string' && b.initials.trim()
            ? b.initials.trim().slice(0, 4)
            : current.initials,
        tagline:
          typeof b.tagline === 'string' && b.tagline.trim() ? b.tagline.trim() : current.tagline,
        rotatingRoles:
          b.rotatingRoles !== undefined ? asStringArray(b.rotatingRoles) : current.rotatingRoles,
        location:
          typeof b.location === 'string' && b.location.trim()
            ? b.location.trim()
            : current.location,
        coordinates:
          typeof b.coordinates === 'string' && b.coordinates.trim()
            ? b.coordinates.trim()
            : current.coordinates,
        email: typeof b.email === 'string' && b.email.trim() ? b.email.trim() : current.email,
        degree: typeof b.degree === 'string' && b.degree.trim() ? b.degree.trim() : current.degree,
        semester:
          typeof b.semester === 'string' && b.semester.trim()
            ? b.semester.trim()
            : current.semester,
        educationPeriod:
          typeof b.educationPeriod === 'string' && b.educationPeriod.trim()
            ? b.educationPeriod.trim()
            : current.educationPeriod,
        department:
          typeof b.department === 'string' && b.department.trim()
            ? b.department.trim()
            : current.department,
        university:
          typeof b.university === 'string' && b.university.trim()
            ? b.university.trim()
            : current.university,
        educationFocus:
          typeof b.educationFocus === 'string'
            ? b.educationFocus.trim()
            : current.educationFocus,
        previousNote:
          typeof b.previousNote === 'string' ? b.previousNote.trim() : current.previousNote,
        philosophyQuote:
          typeof b.philosophyQuote === 'string'
            ? b.philosophyQuote.trim()
            : current.philosophyQuote,
        aboutStory:
          Array.isArray(b.aboutStory)
            ? b.aboutStory.map((s) => String(s).trim()).filter(Boolean)
            : current.aboutStory,
        principles: Array.isArray(b.principles)
          ? (b.principles as typeof current.principles)
          : current.principles,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, current.id))
      .returning();

    res.status(200).json({ ok: true, profile: updated });
  } catch (error) {
    console.error('updateAdminProfile error:', error);
    res.status(500).json({ ok: false, error: 'Failed to update profile.' });
  }
}

export async function updateAdminSettings(req: AdminRequest, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const b = req.body as Record<string, unknown>;
    const existing = await db.select().from(siteSettings).limit(1);
    if (existing.length === 0) {
      res.status(404).json({ ok: false, error: 'Site settings not found.' });
      return;
    }

    const current = existing[0];
    const [updated] = await db
      .update(siteSettings)
      .set({
        siteTitle:
          typeof b.siteTitle === 'string' && b.siteTitle.trim()
            ? b.siteTitle.trim()
            : current.siteTitle,
        siteTagline:
          typeof b.siteTagline === 'string' && b.siteTagline.trim()
            ? b.siteTagline.trim()
            : current.siteTagline,
        muavinEnabled:
          typeof b.muavinEnabled === 'boolean' ? b.muavinEnabled : current.muavinEnabled,
        muavinWelcomeMessage:
          typeof b.muavinWelcomeMessage === 'string' && b.muavinWelcomeMessage.trim()
            ? b.muavinWelcomeMessage.trim()
            : current.muavinWelcomeMessage,
        muavinSystemTone:
          typeof b.muavinSystemTone === 'string' && b.muavinSystemTone.trim()
            ? b.muavinSystemTone.trim()
            : current.muavinSystemTone,
        teachingHeadline:
          typeof b.teachingHeadline === 'string' && b.teachingHeadline.trim()
            ? b.teachingHeadline.trim()
            : current.teachingHeadline,
        teachingSummary:
          typeof b.teachingSummary === 'string' && b.teachingSummary.trim()
            ? b.teachingSummary.trim()
            : current.teachingSummary,
        teachingAudience:
          typeof b.teachingAudience === 'string' && b.teachingAudience.trim()
            ? b.teachingAudience.trim()
            : current.teachingAudience,
        teachingExperienceLabel:
          typeof b.teachingExperienceLabel === 'string' && b.teachingExperienceLabel.trim()
            ? b.teachingExperienceLabel.trim()
            : current.teachingExperienceLabel,
        teachingMode:
          typeof b.teachingMode === 'string' && b.teachingMode.trim()
            ? b.teachingMode.trim()
            : current.teachingMode,
        teachingLocation:
          typeof b.teachingLocation === 'string' && b.teachingLocation.trim()
            ? b.teachingLocation.trim()
            : current.teachingLocation,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, current.id))
      .returning();

    res.status(200).json({ ok: true, settings: updated });
  } catch (error) {
    console.error('updateAdminSettings error:', error);
    res.status(500).json({ ok: false, error: 'Failed to update settings.' });
  }
}

/* ==================== PROJECTS CRUD ==================== */
export async function listAdminProjects(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), asc(projects.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminProject(req: AdminRequest, res: Response): Promise<void> {
  try {
    const b = req.body as Record<string, unknown>;
    const title = typeof b.title === 'string' ? b.title.trim() : '';
    const tagline = typeof b.tagline === 'string' ? b.tagline.trim() : '';
    if (!title || !tagline) {
      res.status(400).json({ ok: false, error: 'Project title and tagline are required.' });
      return;
    }

    const baseSlug = slugify(typeof b.slug === 'string' && b.slug.trim() ? b.slug : title);
    const uniqueSlug = baseSlug || `project-${Date.now()}`;

    const [created] = await db
      .insert(projects)
      .values({
        slug: uniqueSlug,
        indexLabel:
          typeof b.indexLabel === 'string' && b.indexLabel.trim() ? b.indexLabel.trim() : '11',
        title,
        shortTitle:
          typeof b.shortTitle === 'string' && b.shortTitle.trim()
            ? b.shortTitle.trim()
            : title.slice(0, 24),
        category:
          typeof b.category === 'string' && b.category.trim() ? b.category.trim() : 'Web & Apps',
        status: typeof b.status === 'string' && b.status.trim() ? b.status.trim() : 'Built',
        mathSymbol:
          typeof b.mathSymbol === 'string' && b.mathSymbol.trim() ? b.mathSymbol.trim() : '∑',
        motif:
          typeof b.motif === 'string' && b.motif.trim() ? b.motif.trim() : 'group-symmetry',
        tagline,
        summary: typeof b.summary === 'string' && b.summary.trim() ? b.summary.trim() : tagline,
        problem: typeof b.problem === 'string' ? b.problem.trim() : '',
        approach: typeof b.approach === 'string' ? b.approach.trim() : '',
        mathematicalConnection:
          typeof b.mathematicalConnection === 'string' ? b.mathematicalConnection.trim() : '',
        notes: typeof b.notes === 'string' ? b.notes.trim() : '',
        techStack: asStringArray(b.techStack),
        features: Array.isArray(b.features)
          ? b.features.map((f) => String(f).trim()).filter(Boolean)
          : typeof b.features === 'string'
            ? b.features
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        githubUrl:
          typeof b.githubUrl === 'string' && b.githubUrl.trim() ? b.githubUrl.trim() : null,
        liveUrl: typeof b.liveUrl === 'string' && b.liveUrl.trim() ? b.liveUrl.trim() : null,
        featured: Boolean(b.featured),
        published: b.published === undefined ? true : Boolean(b.published),
        sortOrder: Number(b.sortOrder) || 99,
      })
      .returning();

    res.status(201).json({ ok: true, item: created });
  } catch (error) {
    console.error('createAdminProject error:', error);
    res.status(500).json({ ok: false, error: 'Failed to create project (check unique slug).' });
  }
}

export async function updateAdminProject(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid project ID.' });
    return;
  }
  try {
    const b = req.body as Record<string, unknown>;
    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (existing.length === 0) {
      res.status(404).json({ ok: false, error: 'Project not found.' });
      return;
    }
    const c = existing[0];
    const [updated] = await db
      .update(projects)
      .set({
        slug: typeof b.slug === 'string' && b.slug.trim() ? slugify(b.slug) : c.slug,
        indexLabel: typeof b.indexLabel === 'string' ? b.indexLabel.trim() : c.indexLabel,
        title: typeof b.title === 'string' && b.title.trim() ? b.title.trim() : c.title,
        shortTitle: typeof b.shortTitle === 'string' ? b.shortTitle.trim() : c.shortTitle,
        category: typeof b.category === 'string' ? b.category.trim() : c.category,
        status: typeof b.status === 'string' ? b.status.trim() : c.status,
        mathSymbol: typeof b.mathSymbol === 'string' ? b.mathSymbol.trim() : c.mathSymbol,
        motif: typeof b.motif === 'string' ? b.motif.trim() : c.motif,
        tagline: typeof b.tagline === 'string' ? b.tagline.trim() : c.tagline,
        summary: typeof b.summary === 'string' ? b.summary.trim() : c.summary,
        problem: typeof b.problem === 'string' ? b.problem.trim() : c.problem,
        approach: typeof b.approach === 'string' ? b.approach.trim() : c.approach,
        mathematicalConnection:
          typeof b.mathematicalConnection === 'string'
            ? b.mathematicalConnection.trim()
            : c.mathematicalConnection,
        notes: typeof b.notes === 'string' ? b.notes.trim() : c.notes,
        techStack: b.techStack !== undefined ? asStringArray(b.techStack) : c.techStack,
        features:
          b.features !== undefined
            ? Array.isArray(b.features)
              ? b.features.map((f) => String(f).trim()).filter(Boolean)
              : String(b.features)
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean)
            : c.features,
        githubUrl:
          b.githubUrl === undefined
            ? c.githubUrl
            : typeof b.githubUrl === 'string' && b.githubUrl.trim()
              ? b.githubUrl.trim()
              : null,
        liveUrl:
          b.liveUrl === undefined
            ? c.liveUrl
            : typeof b.liveUrl === 'string' && b.liveUrl.trim()
              ? b.liveUrl.trim()
              : null,
        featured: b.featured === undefined ? c.featured : Boolean(b.featured),
        published: b.published === undefined ? c.published : Boolean(b.published),
        sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) || 0 : c.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    res.status(200).json({ ok: true, item: updated });
  } catch (error) {
    console.error('updateAdminProject error:', error);
    res.status(500).json({ ok: false, error: 'Failed to update project.' });
  }
}

export async function deleteAdminProject(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid project ID.' });
    return;
  }
  await db.delete(projects).where(eq(projects.id, id));
  res.status(200).json({ ok: true });
}

/* ==================== SKILLS CRUD ==================== */
export async function listAdminSkills(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminSkill(req: AdminRequest, res: Response): Promise<void> {
  try {
    const b = req.body as Record<string, unknown>;
    const title = typeof b.title === 'string' ? b.title.trim() : '';
    const domain = typeof b.domain === 'string' ? b.domain.trim() : '';
    if (!title || !domain) {
      res.status(400).json({ ok: false, error: 'Skill title and domain are required.' });
      return;
    }

    const [created] = await db
      .insert(skills)
      .values({
        slug: slugify(`${title}-${Date.now()}`),
        indexLabel:
          typeof b.indexLabel === 'string' && b.indexLabel.trim() ? b.indexLabel.trim() : '07',
        symbol: typeof b.symbol === 'string' && b.symbol.trim() ? b.symbol.trim() : '∑',
        domain,
        title,
        description: typeof b.description === 'string' ? b.description.trim() : '',
        topics: asStringArray(b.topics),
        contextLabel:
          typeof b.contextLabel === 'string' && b.contextLabel.trim()
            ? b.contextLabel.trim()
            : 'Active Practice',
        published: b.published === undefined ? true : Boolean(b.published),
        sortOrder: Number(b.sortOrder) || 99,
      })
      .returning();

    res.status(201).json({ ok: true, item: created });
  } catch (error) {
    console.error('createAdminSkill error:', error);
    res.status(500).json({ ok: false, error: 'Failed to create skill.' });
  }
}

export async function updateAdminSkill(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid skill ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Skill not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(skills)
    .set({
      indexLabel: typeof b.indexLabel === 'string' ? b.indexLabel.trim() : c.indexLabel,
      symbol: typeof b.symbol === 'string' ? b.symbol.trim() : c.symbol,
      domain: typeof b.domain === 'string' ? b.domain.trim() : c.domain,
      title: typeof b.title === 'string' ? b.title.trim() : c.title,
      description: typeof b.description === 'string' ? b.description.trim() : c.description,
      topics: b.topics !== undefined ? asStringArray(b.topics) : c.topics,
      contextLabel: typeof b.contextLabel === 'string' ? b.contextLabel.trim() : c.contextLabel,
      published: b.published === undefined ? c.published : Boolean(b.published),
      sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) || 0 : c.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(skills.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminSkill(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid skill ID.' });
    return;
  }
  await db.delete(skills).where(eq(skills.id, id));
  res.status(200).json({ ok: true });
}

/* ==================== EDUCATION & EXPERIENCE CRUD ==================== */
export async function listAdminEducations(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(educations)
    .orderBy(asc(educations.sortOrder), asc(educations.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminEducation(req: AdminRequest, res: Response): Promise<void> {
  const b = req.body as Record<string, unknown>;
  const degree = typeof b.degree === 'string' ? b.degree.trim() : '';
  const institution = typeof b.institution === 'string' ? b.institution.trim() : '';
  if (!degree || !institution) {
    res.status(400).json({ ok: false, error: 'Degree and institution are required.' });
    return;
  }
  const [created] = await db
    .insert(educations)
    .values({
      degree,
      institution,
      department: typeof b.department === 'string' ? b.department.trim() : '',
      location: typeof b.location === 'string' ? b.location.trim() : '',
      period: typeof b.period === 'string' ? b.period.trim() : '',
      semesterOrGrade: typeof b.semesterOrGrade === 'string' ? b.semesterOrGrade.trim() : '',
      description: typeof b.description === 'string' ? b.description.trim() : '',
      isPlaceholder: Boolean(b.isPlaceholder),
      published: b.published === undefined ? true : Boolean(b.published),
      sortOrder: Number(b.sortOrder) || 10,
    })
    .returning();
  res.status(201).json({ ok: true, item: created });
}

export async function updateAdminEducation(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid education ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(educations).where(eq(educations.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Education record not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(educations)
    .set({
      degree: typeof b.degree === 'string' ? b.degree.trim() : c.degree,
      institution: typeof b.institution === 'string' ? b.institution.trim() : c.institution,
      department: typeof b.department === 'string' ? b.department.trim() : c.department,
      location: typeof b.location === 'string' ? b.location.trim() : c.location,
      period: typeof b.period === 'string' ? b.period.trim() : c.period,
      semesterOrGrade:
        typeof b.semesterOrGrade === 'string' ? b.semesterOrGrade.trim() : c.semesterOrGrade,
      description: typeof b.description === 'string' ? b.description.trim() : c.description,
      isPlaceholder: b.isPlaceholder === undefined ? c.isPlaceholder : Boolean(b.isPlaceholder),
      published: b.published === undefined ? c.published : Boolean(b.published),
      sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) || 0 : c.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(educations.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminEducation(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid education ID.' });
    return;
  }
  await db.delete(educations).where(eq(educations.id, id));
  res.status(200).json({ ok: true });
}

export async function listAdminExperiences(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(experiences)
    .orderBy(asc(experiences.sortOrder), asc(experiences.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminExperience(req: AdminRequest, res: Response): Promise<void> {
  const b = req.body as Record<string, unknown>;
  const title = typeof b.title === 'string' ? b.title.trim() : '';
  const organization = typeof b.organization === 'string' ? b.organization.trim() : '';
  if (!title || !organization) {
    res.status(400).json({ ok: false, error: 'Title and organization are required.' });
    return;
  }
  const [created] = await db
    .insert(experiences)
    .values({
      indexLabel:
        typeof b.indexLabel === 'string' && b.indexLabel.trim() ? b.indexLabel.trim() : '05',
      category: typeof b.category === 'string' ? b.category.trim() : 'Experience',
      title,
      organization,
      period: typeof b.period === 'string' ? b.period.trim() : '',
      location: typeof b.location === 'string' ? b.location.trim() : 'Multan, Pakistan',
      summary: typeof b.summary === 'string' ? b.summary.trim() : '',
      highlights: asStringArray(b.highlights),
      takeaway: typeof b.takeaway === 'string' ? b.takeaway.trim() : '',
      published: b.published === undefined ? true : Boolean(b.published),
      sortOrder: Number(b.sortOrder) || 10,
    })
    .returning();
  res.status(201).json({ ok: true, item: created });
}

export async function updateAdminExperience(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid experience ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Experience record not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(experiences)
    .set({
      indexLabel: typeof b.indexLabel === 'string' ? b.indexLabel.trim() : c.indexLabel,
      category: typeof b.category === 'string' ? b.category.trim() : c.category,
      title: typeof b.title === 'string' ? b.title.trim() : c.title,
      organization: typeof b.organization === 'string' ? b.organization.trim() : c.organization,
      period: typeof b.period === 'string' ? b.period.trim() : c.period,
      location: typeof b.location === 'string' ? b.location.trim() : c.location,
      summary: typeof b.summary === 'string' ? b.summary.trim() : c.summary,
      highlights: b.highlights !== undefined ? asStringArray(b.highlights) : c.highlights,
      takeaway: typeof b.takeaway === 'string' ? b.takeaway.trim() : c.takeaway,
      published: b.published === undefined ? c.published : Boolean(b.published),
      sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) || 0 : c.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(experiences.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminExperience(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid experience ID.' });
    return;
  }
  await db.delete(experiences).where(eq(experiences.id, id));
  res.status(200).json({ ok: true });
}

/* ==================== TEACHING CRUD ==================== */
export async function listAdminTeachings(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(teachings)
    .orderBy(asc(teachings.sortOrder), asc(teachings.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminTeaching(req: AdminRequest, res: Response): Promise<void> {
  const b = req.body as Record<string, unknown>;
  const level = typeof b.level === 'string' ? b.level.trim() : '';
  const title = typeof b.title === 'string' ? b.title.trim() : '';
  if (!level || !title) {
    res.status(400).json({ ok: false, error: 'Teaching level and title are required.' });
    return;
  }
  const [created] = await db
    .insert(teachings)
    .values({
      indexLabel:
        typeof b.indexLabel === 'string' && b.indexLabel.trim() ? b.indexLabel.trim() : '05',
      level,
      title,
      focus: typeof b.focus === 'string' ? b.focus.trim() : '',
      topics: asStringArray(b.topics),
      published: b.published === undefined ? true : Boolean(b.published),
      sortOrder: Number(b.sortOrder) || 10,
    })
    .returning();
  res.status(201).json({ ok: true, item: created });
}

export async function updateAdminTeaching(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid teaching ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(teachings).where(eq(teachings.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Teaching record not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(teachings)
    .set({
      indexLabel: typeof b.indexLabel === 'string' ? b.indexLabel.trim() : c.indexLabel,
      level: typeof b.level === 'string' ? b.level.trim() : c.level,
      title: typeof b.title === 'string' ? b.title.trim() : c.title,
      focus: typeof b.focus === 'string' ? b.focus.trim() : c.focus,
      topics: b.topics !== undefined ? asStringArray(b.topics) : c.topics,
      published: b.published === undefined ? c.published : Boolean(b.published),
      sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) || 0 : c.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(teachings.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminTeaching(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid teaching ID.' });
    return;
  }
  await db.delete(teachings).where(eq(teachings.id, id));
  res.status(200).json({ ok: true });
}

/* ==================== CV UPLOAD & MANAGEMENT ==================== */
export async function listAdminCvs(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db.select().from(cvDocuments).orderBy(desc(cvDocuments.updatedAt));
  res.status(200).json({ ok: true, items: rows });
}

export async function uploadAdminCv(req: AdminRequest, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ ok: false, error: 'Please select a valid PDF file to upload.' });
    return;
  }

  if (!verifyPdfMagicBytes(file.path)) {
    try {
      fs.unlinkSync(file.path);
    } catch {
      // ignore
    }
    res.status(400).json({
      ok: false,
      error: 'Uploaded file failed PDF header validation (%PDF- signature required).',
    });
    return;
  }

  try {
    const title =
      typeof req.body?.title === 'string' && req.body.title.trim()
        ? req.body.title.trim()
        : 'Ateeq Ur Rehman — Curriculum Vitae';

    // Deactivate previously active CVs
    await db.update(cvDocuments).set({ isActive: false, updatedAt: new Date() });

    const [created] = await db
      .insert(cvDocuments)
      .values({
        title,
        originalFilename: file.originalname || 'Ateeq_Ur_Rehman_CV.pdf',
        storedFilename: file.filename,
        fileUrl: '/api/cv/download',
        mimeType: 'application/pdf',
        fileSize: file.size,
        isActive: true,
        uploadedByEmail: req.adminUser?.email || 'admin',
      })
      .returning();

    res.status(201).json({ ok: true, item: created });
  } catch (error) {
    deleteStoredFile('cv', file.filename);
    console.error('uploadAdminCv error:', error);
    res.status(500).json({ ok: false, error: 'Failed to save CV metadata.' });
  }
}

export async function activateAdminCv(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid CV ID.' });
    return;
  }
  await db.update(cvDocuments).set({ isActive: false });
  const [updated] = await db
    .update(cvDocuments)
    .set({ isActive: true, updatedAt: new Date() })
    .where(eq(cvDocuments.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminCv(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid CV ID.' });
    return;
  }
  const existing = await db.select().from(cvDocuments).where(eq(cvDocuments.id, id)).limit(1);
  if (existing.length > 0) {
    deleteStoredFile('cv', existing[0].storedFilename);
    await db.delete(cvDocuments).where(eq(cvDocuments.id, id));
  }
  res.status(200).json({ ok: true });
}

/* ==================== GALLERY & PROFILE PHOTO ==================== */
export async function listAdminGallery(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder), desc(galleryImages.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function uploadAdminGalleryImages(req: AdminRequest, res: Response): Promise<void> {
  const files = (req.files as Express.Multer.File[] | undefined) || [];
  if (files.length === 0) {
    res.status(400).json({ ok: false, error: 'Please select at least one image to upload.' });
    return;
  }

  try {
    const baseTitle =
      typeof req.body?.title === 'string' && req.body.title.trim() ? req.body.title.trim() : '';
    const caption = typeof req.body?.caption === 'string' ? req.body.caption.trim() : '';
    const category =
      typeof req.body?.category === 'string' && req.body.category.trim()
        ? req.body.category.trim()
        : 'Portfolio';
    const published = req.body?.published === 'false' ? false : true;

    const existingCountRows = await db.select({ value: count() }).from(galleryImages);
    const baseOrder = existingCountRows[0]?.value || 0;

    const inserted = await db
      .insert(galleryImages)
      .values(
        files.map((f, idx) => ({
          title:
            baseTitle && files.length === 1
              ? baseTitle
              : baseTitle
                ? `${baseTitle} (${idx + 1})`
                : f.originalname.replace(/\.[^.]+$/, ''),
          caption,
          category,
          imageUrl: `/api/media/gallery/${f.filename}`,
          storedFilename: f.filename,
          mimeType: f.mimetype,
          fileSize: f.size,
          isProfilePhoto: false,
          published,
          sortOrder: baseOrder + idx + 1,
        })),
      )
      .returning();

    res.status(201).json({ ok: true, items: inserted });
  } catch (error) {
    files.forEach((f) => deleteStoredFile('gallery', f.filename));
    console.error('uploadAdminGalleryImages error:', error);
    res.status(500).json({ ok: false, error: 'Failed to save gallery images.' });
  }
}

export async function uploadAdminProfilePhoto(req: AdminRequest, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ ok: false, error: 'Please select an image file.' });
    return;
  }

  try {
    const imageUrl = `/api/media/gallery/${file.filename}`;
    const existingProfiles = await db.select().from(profiles).limit(1);
    if (existingProfiles.length > 0) {
      await db
        .update(profiles)
        .set({ avatarUrl: imageUrl, updatedAt: new Date() })
        .where(eq(profiles.id, existingProfiles[0].id));
    }

    // Mark prior profile photo records inactive/non-profile and insert new record
    await db.update(galleryImages).set({ isProfilePhoto: false });
    const [photoRecord] = await db
      .insert(galleryImages)
      .values({
        title: 'Profile Portrait',
        caption: 'Active portfolio profile photograph',
        category: 'Profile',
        imageUrl,
        storedFilename: file.filename,
        mimeType: file.mimetype,
        fileSize: file.size,
        isProfilePhoto: true,
        published: true,
        sortOrder: 0,
      })
      .returning();

    res.status(201).json({ ok: true, avatarUrl: imageUrl, item: photoRecord });
  } catch (error) {
    deleteStoredFile('gallery', file.filename);
    console.error('uploadAdminProfilePhoto error:', error);
    res.status(500).json({ ok: false, error: 'Failed to update profile photo.' });
  }
}

export async function updateAdminGalleryImage(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid gallery image ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Image not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(galleryImages)
    .set({
      title: typeof b.title === 'string' ? b.title.trim() : c.title,
      caption: typeof b.caption === 'string' ? b.caption.trim() : c.caption,
      category: typeof b.category === 'string' ? b.category.trim() : c.category,
      published: b.published === undefined ? c.published : Boolean(b.published),
      sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) || 0 : c.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(galleryImages.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function reorderAdminGallery(req: AdminRequest, res: Response): Promise<void> {
  const orderedIds = Array.isArray(req.body?.orderedIds) ? req.body.orderedIds : [];
  for (let i = 0; i < orderedIds.length; i++) {
    const id = Number(orderedIds[i]);
    if (Number.isInteger(id) && id > 0) {
      await db
        .update(galleryImages)
        .set({ sortOrder: i + 1, updatedAt: new Date() })
        .where(eq(galleryImages.id, id));
    }
  }
  res.status(200).json({ ok: true });
}

export async function deleteAdminGalleryImage(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid gallery image ID.' });
    return;
  }
  const existing = await db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
  if (existing.length > 0) {
    deleteStoredFile('gallery', existing[0].storedFilename);
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }
  res.status(200).json({ ok: true });
}

/* ==================== AWARDS & CERTIFICATES ==================== */
export async function listAdminAwards(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db.select().from(awards).orderBy(asc(awards.sortOrder), desc(awards.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminAward(req: AdminRequest, res: Response): Promise<void> {
  const files = (req.files as Record<string, Express.Multer.File[]> | undefined) || {};
  const imageFile = files.image?.[0];
  const pdfFile = files.pdf?.[0];

  try {
    const b = req.body as Record<string, unknown>;
    const title = typeof b.title === 'string' ? b.title.trim() : '';
    const issuer = typeof b.issuer === 'string' ? b.issuer.trim() : '';
    if (!title || !issuer) {
      if (imageFile) deleteStoredFile('awards', imageFile.filename);
      if (pdfFile) deleteStoredFile('awards', pdfFile.filename);
      res.status(400).json({ ok: false, error: 'Award title and issuing organization are required.' });
      return;
    }

    if (pdfFile && !verifyPdfMagicBytes(pdfFile.path)) {
      if (imageFile) deleteStoredFile('awards', imageFile.filename);
      deleteStoredFile('awards', pdfFile.filename);
      res.status(400).json({ ok: false, error: 'Certificate attachment must be a valid PDF.' });
      return;
    }

    const [created] = await db
      .insert(awards)
      .values({
        title,
        issuer,
        awardDate: typeof b.awardDate === 'string' ? b.awardDate.trim() : '',
        description: typeof b.description === 'string' ? b.description.trim() : '',
        imageUrl: imageFile ? `/api/media/awards/${imageFile.filename}` : null,
        certificatePdfUrl: pdfFile ? `/api/media/awards/${pdfFile.filename}` : null,
        verificationUrl:
          typeof b.verificationUrl === 'string' && b.verificationUrl.trim()
            ? b.verificationUrl.trim()
            : null,
        published: b.published === true || b.published === 'true',
        sortOrder: Number(b.sortOrder) || 0,
      })
      .returning();

    res.status(201).json({ ok: true, item: created });
  } catch (error) {
    if (imageFile) deleteStoredFile('awards', imageFile.filename);
    if (pdfFile) deleteStoredFile('awards', pdfFile.filename);
    console.error('createAdminAward error:', error);
    res.status(500).json({ ok: false, error: 'Failed to save award.' });
  }
}

export async function updateAdminAward(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid award ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(awards).where(eq(awards.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Award not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(awards)
    .set({
      title: typeof b.title === 'string' ? b.title.trim() : c.title,
      issuer: typeof b.issuer === 'string' ? b.issuer.trim() : c.issuer,
      awardDate: typeof b.awardDate === 'string' ? b.awardDate.trim() : c.awardDate,
      description: typeof b.description === 'string' ? b.description.trim() : c.description,
      verificationUrl:
        b.verificationUrl === undefined
          ? c.verificationUrl
          : typeof b.verificationUrl === 'string' && b.verificationUrl.trim()
            ? b.verificationUrl.trim()
            : null,
      published: b.published === undefined ? c.published : Boolean(b.published),
      updatedAt: new Date(),
    })
    .where(eq(awards.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminAward(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid award ID.' });
    return;
  }
  const existing = await db.select().from(awards).where(eq(awards.id, id)).limit(1);
  if (existing.length > 0) {
    const img = existing[0].imageUrl?.split('/').pop();
    const pdf = existing[0].certificatePdfUrl?.split('/').pop();
    if (img) deleteStoredFile('awards', img);
    if (pdf) deleteStoredFile('awards', pdf);
    await db.delete(awards).where(eq(awards.id, id));
  }
  res.status(200).json({ ok: true });
}

export async function listAdminCertificates(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(certificates)
    .orderBy(asc(certificates.sortOrder), desc(certificates.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminCertificate(req: AdminRequest, res: Response): Promise<void> {
  const files = (req.files as Record<string, Express.Multer.File[]> | undefined) || {};
  const imageFile = files.image?.[0];
  const pdfFile = files.pdf?.[0];

  try {
    const b = req.body as Record<string, unknown>;
    const title = typeof b.title === 'string' ? b.title.trim() : '';
    const issuer = typeof b.issuer === 'string' ? b.issuer.trim() : '';
    if (!title || !issuer) {
      if (imageFile) deleteStoredFile('certificates', imageFile.filename);
      if (pdfFile) deleteStoredFile('certificates', pdfFile.filename);
      res.status(400).json({ ok: false, error: 'Certificate title and issuer are required.' });
      return;
    }

    if (pdfFile && !verifyPdfMagicBytes(pdfFile.path)) {
      if (imageFile) deleteStoredFile('certificates', imageFile.filename);
      deleteStoredFile('certificates', pdfFile.filename);
      res.status(400).json({ ok: false, error: 'Certificate PDF attachment is invalid.' });
      return;
    }

    const [created] = await db
      .insert(certificates)
      .values({
        title,
        issuer,
        issueDate: typeof b.issueDate === 'string' ? b.issueDate.trim() : '',
        description: typeof b.description === 'string' ? b.description.trim() : '',
        imageUrl: imageFile ? `/api/media/certificates/${imageFile.filename}` : null,
        pdfUrl: pdfFile ? `/api/media/certificates/${pdfFile.filename}` : null,
        verificationUrl:
          typeof b.verificationUrl === 'string' && b.verificationUrl.trim()
            ? b.verificationUrl.trim()
            : null,
        published: b.published === true || b.published === 'true',
        sortOrder: Number(b.sortOrder) || 0,
      })
      .returning();

    res.status(201).json({ ok: true, item: created });
  } catch (error) {
    if (imageFile) deleteStoredFile('certificates', imageFile.filename);
    if (pdfFile) deleteStoredFile('certificates', pdfFile.filename);
    console.error('createAdminCertificate error:', error);
    res.status(500).json({ ok: false, error: 'Failed to save certificate.' });
  }
}

export async function updateAdminCertificate(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid certificate ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Certificate not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(certificates)
    .set({
      title: typeof b.title === 'string' ? b.title.trim() : c.title,
      issuer: typeof b.issuer === 'string' ? b.issuer.trim() : c.issuer,
      issueDate: typeof b.issueDate === 'string' ? b.issueDate.trim() : c.issueDate,
      description: typeof b.description === 'string' ? b.description.trim() : c.description,
      verificationUrl:
        b.verificationUrl === undefined
          ? c.verificationUrl
          : typeof b.verificationUrl === 'string' && b.verificationUrl.trim()
            ? b.verificationUrl.trim()
            : null,
      published: b.published === undefined ? c.published : Boolean(b.published),
      updatedAt: new Date(),
    })
    .where(eq(certificates.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminCertificate(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid certificate ID.' });
    return;
  }
  const existing = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  if (existing.length > 0) {
    const img = existing[0].imageUrl?.split('/').pop();
    const pdf = existing[0].pdfUrl?.split('/').pop();
    if (img) deleteStoredFile('certificates', img);
    if (pdf) deleteStoredFile('certificates', pdf);
    await db.delete(certificates).where(eq(certificates.id, id));
  }
  res.status(200).json({ ok: true });
}

/* ==================== SOCIAL LINKS, CONTACT MESSAGES & AI KNOWLEDGE ==================== */
export async function listAdminSocials(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(socialLinks)
    .orderBy(asc(socialLinks.sortOrder), asc(socialLinks.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminSocial(req: AdminRequest, res: Response): Promise<void> {
  const b = req.body as Record<string, unknown>;
  const label = typeof b.label === 'string' ? b.label.trim() : '';
  const href = typeof b.href === 'string' ? b.href.trim() : '';
  if (!label || !href) {
    res.status(400).json({ ok: false, error: 'Label and URL/href are required.' });
    return;
  }
  const [created] = await db
    .insert(socialLinks)
    .values({
      platformKey: slugify(typeof b.platformKey === 'string' && b.platformKey ? b.platformKey : label),
      label,
      handle: typeof b.handle === 'string' ? b.handle.trim() : label,
      href,
      description: typeof b.description === 'string' ? b.description.trim() : '',
      external: b.external === undefined ? true : Boolean(b.external),
      published: b.published === undefined ? true : Boolean(b.published),
      sortOrder: Number(b.sortOrder) || 10,
    })
    .returning();
  res.status(201).json({ ok: true, item: created });
}

export async function updateAdminSocial(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid social link ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(socialLinks).where(eq(socialLinks.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Social link not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(socialLinks)
    .set({
      label: typeof b.label === 'string' ? b.label.trim() : c.label,
      handle: typeof b.handle === 'string' ? b.handle.trim() : c.handle,
      href: typeof b.href === 'string' ? b.href.trim() : c.href,
      description: typeof b.description === 'string' ? b.description.trim() : c.description,
      external: b.external === undefined ? c.external : Boolean(b.external),
      published: b.published === undefined ? c.published : Boolean(b.published),
      sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) || 0 : c.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(socialLinks.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminSocial(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid social link ID.' });
    return;
  }
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
  res.status(200).json({ ok: true });
}

export async function listAdminMessages(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));
  res.status(200).json({ ok: true, items: rows });
}

export async function toggleAdminMessageRead(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid message ID.' });
    return;
  }
  const isRead = Boolean(req.body?.isRead);
  const [updated] = await db
    .update(contactMessages)
    .set({ isRead })
    .where(eq(contactMessages.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminMessage(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid message ID.' });
    return;
  }
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  res.status(200).json({ ok: true });
}

export async function listAdminAiKnowledge(_req: AdminRequest, res: Response): Promise<void> {
  const rows = await db
    .select()
    .from(aiKnowledge)
    .orderBy(asc(aiKnowledge.sortOrder), asc(aiKnowledge.id));
  res.status(200).json({ ok: true, items: rows });
}

export async function createAdminAiKnowledge(req: AdminRequest, res: Response): Promise<void> {
  const b = req.body as Record<string, unknown>;
  const title = typeof b.title === 'string' ? b.title.trim() : '';
  const content = typeof b.content === 'string' ? b.content.trim() : '';
  if (!title || !content) {
    res.status(400).json({ ok: false, error: 'Knowledge title and content are required.' });
    return;
  }
  const [created] = await db
    .insert(aiKnowledge)
    .values({
      title,
      category: typeof b.category === 'string' && b.category.trim() ? b.category.trim() : 'Custom',
      content,
      keywords: asStringArray(b.keywords),
      published: b.published === undefined ? true : Boolean(b.published),
      sortOrder: Number(b.sortOrder) || 10,
    })
    .returning();
  res.status(201).json({ ok: true, item: created });
}

export async function updateAdminAiKnowledge(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid knowledge ID.' });
    return;
  }
  const b = req.body as Record<string, unknown>;
  const existing = await db.select().from(aiKnowledge).where(eq(aiKnowledge.id, id)).limit(1);
  if (existing.length === 0) {
    res.status(404).json({ ok: false, error: 'Knowledge entry not found.' });
    return;
  }
  const c = existing[0];
  const [updated] = await db
    .update(aiKnowledge)
    .set({
      title: typeof b.title === 'string' ? b.title.trim() : c.title,
      category: typeof b.category === 'string' ? b.category.trim() : c.category,
      content: typeof b.content === 'string' ? b.content.trim() : c.content,
      keywords: b.keywords !== undefined ? asStringArray(b.keywords) : c.keywords,
      published: b.published === undefined ? c.published : Boolean(b.published),
      updatedAt: new Date(),
    })
    .where(eq(aiKnowledge.id, id))
    .returning();
  res.status(200).json({ ok: true, item: updated });
}

export async function deleteAdminAiKnowledge(req: AdminRequest, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ ok: false, error: 'Invalid knowledge ID.' });
    return;
  }
  await db.delete(aiKnowledge).where(eq(aiKnowledge.id, id));
  res.status(200).json({ ok: true });
}

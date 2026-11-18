import { asc, desc, eq } from 'drizzle-orm';
import { db } from '../../src/db/index.ts';
import {
  aiKnowledge,
  awards,
  certificates,
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
import { ensureInitialDataSeeded } from './seedService.ts';

export async function getPublicPortfolioBundle() {
  try {
    await ensureInitialDataSeeded();

    const [
      profileRows,
      settingsRows,
      projectRows,
      skillRows,
      educationRows,
      experienceRows,
      teachingRows,
      awardRows,
      certificateRows,
      galleryRows,
      activeCvRows,
      socialRows,
    ] = await Promise.all([
      db.select().from(profiles).limit(1),
      db.select().from(siteSettings).limit(1),
      db
        .select()
        .from(projects)
        .where(eq(projects.published, true))
        .orderBy(asc(projects.sortOrder), asc(projects.id)),
      db
        .select()
        .from(skills)
        .where(eq(skills.published, true))
        .orderBy(asc(skills.sortOrder), asc(skills.id)),
      db
        .select()
        .from(educations)
        .where(eq(educations.published, true))
        .orderBy(asc(educations.sortOrder), asc(educations.id)),
      db
        .select()
        .from(experiences)
        .where(eq(experiences.published, true))
        .orderBy(asc(experiences.sortOrder), asc(experiences.id)),
      db
        .select()
        .from(teachings)
        .where(eq(teachings.published, true))
        .orderBy(asc(teachings.sortOrder), asc(teachings.id)),
      db
        .select()
        .from(awards)
        .where(eq(awards.published, true))
        .orderBy(asc(awards.sortOrder), desc(awards.id)),
      db
        .select()
        .from(certificates)
        .where(eq(certificates.published, true))
        .orderBy(asc(certificates.sortOrder), desc(certificates.id)),
      db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.published, true))
        .orderBy(asc(galleryImages.sortOrder), desc(galleryImages.id)),
      db
        .select({
          id: cvDocuments.id,
          title: cvDocuments.title,
          originalFilename: cvDocuments.originalFilename,
          fileSize: cvDocuments.fileSize,
          updatedAt: cvDocuments.updatedAt,
        })
        .from(cvDocuments)
        .where(eq(cvDocuments.isActive, true))
        .orderBy(desc(cvDocuments.updatedAt))
        .limit(1),
      db
        .select()
        .from(socialLinks)
        .where(eq(socialLinks.published, true))
        .orderBy(asc(socialLinks.sortOrder), asc(socialLinks.id)),
    ]);

    return {
      profile: profileRows[0] || null,
      settings: settingsRows[0] || null,
      projects: projectRows,
      skills: skillRows,
      educations: educationRows,
      experiences: experienceRows,
      teachings: teachingRows,
      awards: awardRows,
      certificates: certificateRows,
      gallery: galleryRows.filter((img) => !img.isProfilePhoto),
      activeCv: activeCvRows[0] || null,
      socialLinks: socialRows,
    };
  } catch (error) {
    console.error('Database query failed in getPublicPortfolioBundle:', error);
    throw new Error('Unable to load portfolio data from database.', { cause: error });
  }
}

export async function getActiveCvRecord() {
  try {
    await ensureInitialDataSeeded();
    const rows = await db
      .select()
      .from(cvDocuments)
      .where(eq(cvDocuments.isActive, true))
      .orderBy(desc(cvDocuments.updatedAt))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in getActiveCvRecord:', error);
    throw new Error('Unable to check active CV document.', { cause: error });
  }
}

export async function getPublishedAiContext() {
  try {
    await ensureInitialDataSeeded();

    const [bundle, customKnowledge] = await Promise.all([
      getPublicPortfolioBundle(),
      db
        .select()
        .from(aiKnowledge)
        .where(eq(aiKnowledge.published, true))
        .orderBy(asc(aiKnowledge.sortOrder), asc(aiKnowledge.id)),
    ]);

    return { ...bundle, customKnowledge };
  } catch (error) {
    console.error('Database query failed in getPublishedAiContext:', error);
    throw new Error('Unable to gather Muavin AI knowledge context.', { cause: error });
  }
}

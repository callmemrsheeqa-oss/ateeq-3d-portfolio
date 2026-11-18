import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { asc, desc, eq } from 'drizzle-orm';
import { db } from '../../src/db/index.ts';
import {
  awards,
  certificates,
  galleryImages,
  projects,
  skills,
} from '../../src/db/schema.ts';
import {
  getActiveCvRecord,
  getPublicPortfolioBundle,
} from '../services/portfolioService.ts';
import { ensureInitialDataSeeded } from '../services/seedService.ts';
import { resolveSafeFilePath, type UploadBucket } from '../utils/storage.ts';

const PUBLIC_MEDIA_BUCKETS = new Set<UploadBucket>(['gallery', 'awards', 'certificates']);

export async function getPortfolio(_req: Request, res: Response): Promise<void> {
  try {
    const bundle = await getPublicPortfolioBundle();
    res.status(200).json({ ok: true, data: bundle });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to load portfolio.',
    });
  }
}

export async function getPublicProfile(_req: Request, res: Response): Promise<void> {
  try {
    const bundle = await getPublicPortfolioBundle();
    res.status(200).json({
      ok: true,
      profile: bundle.profile,
      educations: bundle.educations,
      experiences: bundle.experiences,
      socialLinks: bundle.socialLinks,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to load profile.',
    });
  }
}

export async function getPublicProjects(_req: Request, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(asc(projects.sortOrder), asc(projects.id));
    res.status(200).json({ ok: true, projects: rows });
  } catch (error) {
    console.error('getPublicProjects error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load projects.' });
  }
}

export async function getPublicProjectBySlug(req: Request, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const slug = String(req.params.slug || '').trim();
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);

    if (rows.length === 0 || !rows[0].published) {
      res.status(404).json({ ok: false, error: 'Project not found.' });
      return;
    }
    res.status(200).json({ ok: true, project: rows[0] });
  } catch (error) {
    console.error('getPublicProjectBySlug error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load project details.' });
  }
}

export async function getPublicSkills(_req: Request, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const rows = await db
      .select()
      .from(skills)
      .where(eq(skills.published, true))
      .orderBy(asc(skills.sortOrder), asc(skills.id));
    res.status(200).json({ ok: true, skills: rows });
  } catch (error) {
    console.error('getPublicSkills error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load skills.' });
  }
}

export async function getPublicGallery(_req: Request, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const rows = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.published, true))
      .orderBy(asc(galleryImages.sortOrder), desc(galleryImages.id));
    res.status(200).json({
      ok: true,
      images: rows.filter((r) => !r.isProfilePhoto),
    });
  } catch (error) {
    console.error('getPublicGallery error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load gallery.' });
  }
}

export async function getPublicAwards(_req: Request, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const [awardRows, certificateRows] = await Promise.all([
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
    ]);
    res.status(200).json({ ok: true, awards: awardRows, certificates: certificateRows });
  } catch (error) {
    console.error('getPublicAwards error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load awards and certificates.' });
  }
}

export async function getCvStatus(_req: Request, res: Response): Promise<void> {
  try {
    const active = await getActiveCvRecord();
    if (active) {
      const filePath = resolveSafeFilePath('cv', active.storedFilename);
      if (filePath && fs.existsSync(filePath)) {
        res.status(200).json({
          ok: true,
          available: true,
          cv: {
            id: active.id,
            title: active.title,
            originalFilename: active.originalFilename,
            fileSize: active.fileSize,
            updatedAt: active.updatedAt,
            downloadUrl: '/api/cv/download',
          },
        });
        return;
      }
    }

    const staticResume = path.resolve(process.cwd(), 'public', 'resume.pdf');
    if (fs.existsSync(staticResume)) {
      const stat = fs.statSync(staticResume);
      res.status(200).json({
        ok: true,
        available: true,
        cv: {
          id: 0,
          title: 'Ateeq Ur Rehman CV',
          originalFilename: 'Ateeq_Ur_Rehman_CV.pdf',
          fileSize: stat.size,
          updatedAt: stat.mtime,
          downloadUrl: '/api/cv/download',
        },
      });
      return;
    }

    res.status(200).json({ ok: true, available: false, cv: null });
  } catch (error) {
    console.error('getCvStatus error:', error);
    res.status(500).json({ ok: false, error: 'Failed to check CV status.' });
  }
}

export async function downloadActiveCv(_req: Request, res: Response): Promise<void> {
  try {
    const active = await getActiveCvRecord();
    if (active) {
      const filePath = resolveSafeFilePath('cv', active.storedFilename);
      if (filePath && fs.existsSync(filePath)) {
        const downloadName = active.originalFilename.toLowerCase().endsWith('.pdf')
          ? active.originalFilename
          : 'Ateeq_Ur_Rehman_CV.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${downloadName.replace(/[^a-zA-Z0-9._-]/g, '_')}"`,
        );
        res.sendFile(filePath);
        return;
      }
    }

    const staticResume = path.resolve(process.cwd(), 'public', 'resume.pdf');
    if (fs.existsSync(staticResume)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Ateeq_Ur_Rehman_CV.pdf"');
      res.sendFile(staticResume);
      return;
    }

    res.status(404).json({
      ok: false,
      code: 'CV_NOT_AVAILABLE',
      error: 'No CV PDF has been uploaded yet.',
    });
  } catch (error) {
    console.error('downloadActiveCv error:', error);
    res.status(500).json({ ok: false, error: 'Failed to download CV.' });
  }
}

export function serveMediaFile(req: Request, res: Response): void {
  const bucket = String(req.params.bucket || '') as UploadBucket;
  const filename = String(req.params.filename || '');

  if (!PUBLIC_MEDIA_BUCKETS.has(bucket)) {
    res.status(404).json({ ok: false, error: 'Media bucket not found.' });
    return;
  }

  const filePath = resolveSafeFilePath(bucket, filename);
  if (!filePath || !fs.existsSync(filePath)) {
    res.status(404).json({ ok: false, error: 'Media file not found.' });
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(filePath);
}

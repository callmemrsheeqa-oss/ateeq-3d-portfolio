import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { db } from '../../src/db/index.ts';
import { contactMessages } from '../../src/db/schema.ts';
import { getActiveCvRecord } from '../services/portfolioService.ts';
import { ensureInitialDataSeeded } from '../services/seedService.ts';
import { resolveSafeFilePath } from '../utils/storage.ts';
import {
  isSmtpConfigured,
  sendContactEmail,
  SmtpNotConfiguredError,
} from '../utils/mailer.ts';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized?: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
}

function validateContactBody(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      errors: { form: 'Request body must be a JSON object.' },
    };
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === 'string' ? record.name.trim() : '';
  const email = typeof record.email === 'string' ? record.email.trim() : '';
  const subject = typeof record.subject === 'string' ? record.subject.trim() : '';
  const message = typeof record.message === 'string' ? record.message.trim() : '';
  const website = typeof record.website === 'string' ? record.website.trim() : '';

  if (website.length > 0) {
    return {
      valid: false,
      errors: { form: 'Invalid submission detected.' },
    };
  }

  const errors: Record<string, string> = {};

  if (name.length < 2 || name.length > 100) {
    errors.name = 'Please enter your name (2 to 100 characters).';
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    errors.email = 'Please provide a valid email address.';
  }

  if (subject.length < 3 || subject.length > 150) {
    errors.subject = 'Please enter a subject (3 to 150 characters).';
  }

  if (message.length < 10 || message.length > 4000) {
    errors.message = 'Please enter a message (10 to 4000 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: { name, email, subject, message },
  };
}

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const staticResumePath = path.resolve(process.cwd(), 'public', 'resume.pdf');
  let resumeAvailable = fs.existsSync(staticResumePath);
  let activeCvTitle: string | null = null;

  try {
    const activeCv = await getActiveCvRecord();
    if (activeCv) {
      const storedPath = resolveSafeFilePath('cv', activeCv.storedFilename);
      if (storedPath && fs.existsSync(storedPath)) {
        resumeAvailable = true;
        activeCvTitle = activeCv.originalFilename;
      }
    }
  } catch (error) {
    console.error('Health CV lookup failed:', error);
  }

  res.status(200).json({
    status: 'ok',
    service: 'ateeq-portfolio-api',
    timestamp: new Date().toISOString(),
    smtpConfigured: isSmtpConfigured(),
    resumeAvailable,
    activeCvTitle,
  });
}

export async function postContact(req: Request, res: Response): Promise<void> {
  const validation = validateContactBody(req.body);
  if (!validation.valid || !validation.sanitized) {
    res.status(400).json({
      ok: false,
      code: 'VALIDATION_ERROR',
      error: 'Please check the highlighted fields and try again.',
      fields: validation.errors,
    });
    return;
  }

  const payload = validation.sanitized;
  let savedId: number | null = null;

  try {
    await ensureInitialDataSeeded();
    const [inserted] = await db
      .insert(contactMessages)
      .values({
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        isRead: false,
        emailDelivered: false,
        deliveryNote: 'Pending email dispatch',
      })
      .returning({ id: contactMessages.id });
    savedId = inserted.id;
  } catch (dbErr) {
    console.error('Failed to persist contact message to PostgreSQL:', dbErr);
    res.status(500).json({
      ok: false,
      code: 'DATABASE_ERROR',
      error: 'Unable to save your message right now. Please email sunbulbroter@gmail.com directly.',
    });
    return;
  }

  try {
    const result = await sendContactEmail(payload);
    if (savedId !== null) {
      const { eq } = await import('drizzle-orm');
      await db
        .update(contactMessages)
        .set({
          emailDelivered: true,
          deliveryNote: `Delivered via SMTP (${result.messageId})`,
        })
        .where(eq(contactMessages.id, savedId));
    }

    res.status(200).json({
      ok: true,
      saved: true,
      emailDelivered: true,
      message: 'Your message has been saved and emailed successfully.',
      messageId: result.messageId,
    });
  } catch (error) {
    const { eq } = await import('drizzle-orm');

    if (error instanceof SmtpNotConfiguredError) {
      if (savedId !== null) {
        await db
          .update(contactMessages)
          .set({
            emailDelivered: false,
            deliveryNote: 'Saved in admin inbox; SMTP credentials not configured.',
          })
          .where(eq(contactMessages.id, savedId));
      }

      res.status(201).json({
        ok: true,
        saved: true,
        emailDelivered: false,
        code: 'SAVED_WITHOUT_SMTP',
        message:
          'Your message was saved to Ateeq’s portfolio inbox. Note: automatic SMTP email notification is not configured on this server, so feel free to also send an email draft to sunbulbroter@gmail.com.',
      });
      return;
    }

    console.error('Failed to deliver contact email:', error);
    if (savedId !== null) {
      await db
        .update(contactMessages)
        .set({
          emailDelivered: false,
          deliveryNote: 'Saved in admin inbox; SMTP email delivery failed.',
        })
        .where(eq(contactMessages.id, savedId));
    }

    res.status(201).json({
      ok: true,
      saved: true,
      emailDelivered: false,
      code: 'SAVED_EMAIL_FAILED',
      message:
        'Your message was saved to Ateeq’s portfolio inbox, but email notification could not be sent right now. You may also reach out at sunbulbroter@gmail.com.',
    });
  }
}

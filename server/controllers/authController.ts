import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/index.ts';
import { adminSessions, adminUsers } from '../../src/db/schema.ts';
import { adminAuth } from '../lib/firebase-admin.ts';
import {
  ADMIN_SESSION_COOKIE,
  getAuthorizedAdminEmails,
  type AdminRequest,
} from '../middleware/auth.ts';
import { ensureInitialDataSeeded } from '../services/seedService.ts';
import {
  generateSessionToken,
  hashSessionToken,
  verifyPassword,
} from '../utils/crypto.ts';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function setSessionCookie(res: Response, token: string): void {
  res.cookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DURATION_MS,
    path: '/',
  });
}

async function createDbSession(adminUserId: number): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  await db.insert(adminSessions).values({
    tokenHash,
    adminUserId,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
  });
  return token;
}

export async function loginWithGoogle(req: Request, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const body = req.body as Record<string, unknown> | undefined;
    const idToken = typeof body?.idToken === 'string' ? body.idToken.trim() : '';

    if (!idToken) {
      res.status(400).json({ ok: false, error: 'Missing Firebase ID token.' });
      return;
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const email = decoded.email?.trim().toLowerCase();

    if (!email || !decoded.email_verified) {
      res.status(403).json({
        ok: false,
        error: 'A verified Google email address is required.',
      });
      return;
    }

    const existing = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email));
    const allowedEmails = getAuthorizedAdminEmails();

    const authorized =
      (existing.length > 0 && existing[0].isActive) || allowedEmails.has(email);

    if (!authorized) {
      res.status(403).json({
        ok: false,
        error: `Account ${email} is not authorized for admin access.`,
      });
      return;
    }

    const [admin] = await db
      .insert(adminUsers)
      .values({
        uid: decoded.uid,
        email,
        displayName: decoded.name || 'Ateeq Ur Rehman',
        role: 'admin',
        isActive: true,
        lastLoginAt: new Date(),
      })
      .onConflictDoUpdate({
        target: adminUsers.email,
        set: {
          uid: decoded.uid,
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    const token = await createDbSession(admin.id);
    setSessionCookie(res, token);

    res.status(200).json({
      ok: true,
      admin: {
        id: admin.id,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Google admin login error:', error);
    res.status(401).json({
      ok: false,
      error: 'Unable to verify Google authentication token.',
    });
  }
}

export async function loginWithPassword(req: Request, res: Response): Promise<void> {
  try {
    await ensureInitialDataSeeded();
    const body = req.body as Record<string, unknown> | undefined;
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      res.status(400).json({
        ok: false,
        error: 'Email and password are required.',
      });
      return;
    }

    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (rows.length === 0 || !rows[0].isActive || !rows[0].passwordHash) {
      res.status(401).json({
        ok: false,
        error:
          'Invalid credentials or password login has not been configured for this account (use Google Sign-In or run the CLI admin setup script).',
      });
      return;
    }

    const valid = verifyPassword(password, rows[0].passwordHash);
    if (!valid) {
      res.status(401).json({ ok: false, error: 'Invalid email or password.' });
      return;
    }

    await db
      .update(adminUsers)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(adminUsers.id, rows[0].id));

    const token = await createDbSession(rows[0].id);
    setSessionCookie(res, token);

    res.status(200).json({
      ok: true,
      admin: {
        id: rows[0].id,
        email: rows[0].email,
        displayName: rows[0].displayName,
        role: rows[0].role,
      },
    });
  } catch (error) {
    console.error('Password admin login error:', error);
    res.status(500).json({ ok: false, error: 'Unable to sign in right now.' });
  }
}

export async function logoutAdmin(req: Request, res: Response): Promise<void> {
  try {
    const cookieToken = req.cookies?.[ADMIN_SESSION_COOKIE];
    if (typeof cookieToken === 'string' && cookieToken.length > 10) {
      const tokenHash = hashSessionToken(cookieToken);
      await db.delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash));
    }
  } catch (error) {
    console.error('Logout cleanup error:', error);
  }

  res.clearCookie(ADMIN_SESSION_COOKIE, { path: '/' });
  res.status(200).json({ ok: true });
}

export function getAdminMe(req: AdminRequest, res: Response): void {
  res.status(200).json({
    ok: true,
    admin: req.adminUser || null,
  });
}

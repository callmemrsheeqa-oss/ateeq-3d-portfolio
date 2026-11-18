import type { NextFunction, Request, Response } from 'express';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '../../src/db/index.ts';
import { adminSessions, adminUsers } from '../../src/db/schema.ts';
import { adminAuth } from '../lib/firebase-admin.ts';
import { hashSessionToken } from '../utils/crypto.ts';
import { ensureInitialDataSeeded } from '../services/seedService.ts';

export const ADMIN_SESSION_COOKIE = 'ateeq_admin_session';

export interface AuthenticatedAdmin {
  id: number;
  email: string;
  displayName: string;
  role: string;
}

export interface AdminRequest extends Request {
  adminUser?: AuthenticatedAdmin;
}

export function getAuthorizedAdminEmails(): Set<string> {
  const raw =
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_INITIAL_EMAIL ||
    'sunbulbroter@gmail.com';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function requireAdminAuth(
  req: AdminRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await ensureInitialDataSeeded();

    // 1. Check HTTP-only session cookie
    const sessionCookie = req.cookies?.[ADMIN_SESSION_COOKIE];
    if (typeof sessionCookie === 'string' && sessionCookie.length > 10) {
      const tokenHash = hashSessionToken(sessionCookie);
      const rows = await db
        .select({
          sessionId: adminSessions.id,
          userId: adminUsers.id,
          email: adminUsers.email,
          displayName: adminUsers.displayName,
          role: adminUsers.role,
          isActive: adminUsers.isActive,
        })
        .from(adminSessions)
        .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
        .where(
          and(
            eq(adminSessions.tokenHash, tokenHash),
            gt(adminSessions.expiresAt, new Date()),
          ),
        );

      if (rows.length > 0 && rows[0].isActive) {
        req.adminUser = {
          id: rows[0].userId,
          email: rows[0].email,
          displayName: rows[0].displayName,
          role: rows[0].role,
        };
        next();
        return;
      }
    }

    // 2. Fallback / Direct check for Firebase Bearer ID Token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.slice('Bearer '.length).trim();
      const decoded = await adminAuth.verifyIdToken(idToken);
      const email = decoded.email?.trim().toLowerCase();

      if (!email || !decoded.email_verified) {
        res.status(403).json({
          ok: false,
          error: 'Verified email address is required for admin access.',
        });
        return;
      }

      const existing = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, email));

      const allowedEmails = getAuthorizedAdminEmails();
      const isAllowed =
        (existing.length > 0 && existing[0].isActive) || allowedEmails.has(email);

      if (!isAllowed) {
        res.status(403).json({
          ok: false,
          error: 'This account is not authorized to manage this portfolio.',
        });
        return;
      }

      const [upserted] = await db
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

      req.adminUser = {
        id: upserted.id,
        email: upserted.email,
        displayName: upserted.displayName,
        role: upserted.role,
      };
      next();
      return;
    }

    res.status(401).json({
      ok: false,
      error: 'Authentication required to access admin endpoints.',
    });
  } catch (error) {
    console.error('Admin auth verification failed:', error);
    res.status(401).json({
      ok: false,
      error: 'Invalid or expired authentication session.',
    });
  }
}

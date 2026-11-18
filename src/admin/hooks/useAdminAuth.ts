import { useCallback, useEffect, useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../lib/firebase';

export interface AdminUserInfo {
  id: number;
  email: string;
  displayName: string;
  role: string;
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUserInfo | null>(null);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/admin/auth/me', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.ok && data?.admin) {
          setAdmin(data.admin);
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setSubmitting(true);
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await cred.user.getIdToken();
      const res = await fetch('/api/admin/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setAuthError(data?.error || 'Google sign-in is not authorized for admin access.');
        return false;
      }
      setAdmin(data.admin);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in cancelled or failed.';
      setAuthError(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setAuthError(data?.error || 'Invalid credentials.');
        return false;
      }
      setAdmin(data.admin);
      return true;
    } catch {
      setAuthError('Unable to reach authentication server.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      await signOut(auth).catch(() => {});
    } finally {
      setAdmin(null);
    }
  }, []);

  return {
    admin,
    checking,
    submitting,
    authError,
    setAuthError,
    signInWithGoogle,
    signInWithPassword,
    logout,
    checkSession,
  };
}

"use client";

import { useEffect, useState } from "react";
import {
  restoreSession,
  logout as apiLogout,
  type SessionUser,
} from "./api";
import { useAuth } from "./useAuth";

export type { SessionUser };

/**
 * Real auth session — thin adapter over lib/api.ts.
 *
 * - Access token lives in api.ts module memory (never localStorage).
 * - The rotating refresh token is an HttpOnly cookie; restoreSession()
 *   uses it to re-establish the session after a page reload.
 * - useSession() returns { user, loading }; loading is true until the
 *   first restore attempt has finished.
 */

/** Idempotent bootstrap — call once on app mount (see AuthBootstrap). */
let restorePromise: Promise<SessionUser | null> | null = null;
let restoreDone = false;

export function bootstrapAuth(): Promise<SessionUser | null> {
  if (!restorePromise) {
    restorePromise = restoreSession().finally(() => {
      restoreDone = true;
    });
  }
  return restorePromise;
}

export function useSession(): { user: SessionUser | null; loading: boolean } {
  const { user } = useAuth();
  const [loading, setLoading] = useState(!restoreDone);

  useEffect(() => {
    let alive = true;
    bootstrapAuth().finally(() => {
      if (alive) setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { user, loading };
}

export async function signOut(): Promise<void> {
  await apiLogout();
}


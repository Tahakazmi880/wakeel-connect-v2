"use client";

/**
 * useAuth() React hook — subscribes to the in-memory auth state in ./api.
 *
 * Kept in its own "use client" module on purpose: ./api.ts must stay
 * importable from React Server Components (public SEO pages fetch public
 * endpoints through it), and a module-level react hook import would break
 * server-component compilation.
 */
import { useSyncExternalStore } from "react";
import { onAuthChange, getSessionUser, type SessionUser } from "./api";

export type { SessionUser };

export function useAuth(): { user: SessionUser | null } {
  const user = useSyncExternalStore(onAuthChange, getSessionUser, getSessionUser);
  return { user };
}

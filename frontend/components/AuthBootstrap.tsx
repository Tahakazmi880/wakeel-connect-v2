"use client";

import { useEffect } from "react";
import { bootstrapAuth } from "@/lib/session";

/**
 * Restores the session from the HttpOnly refresh cookie once on app mount,
 * so a logged-in user stays logged in across page reloads.
 */
export default function AuthBootstrap() {
  useEffect(() => {
    bootstrapAuth().catch(() => {
      /* no session — user stays logged out */
    });
  }, []);
  return null;
}

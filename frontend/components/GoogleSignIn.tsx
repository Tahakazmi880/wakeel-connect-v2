"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "./LanguageContext";
import { signInWithGoogle, ApiError, type SessionUser } from "@/lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (opts: { client_id: string; callback: (r: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, string>) => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/**
 * "Continue with Google" — official Google Identity Services button.
 * Exchanges the Google ID token with our backend (/auth/google), which
 * verifies it and starts a normal WakeelConnect session (same as OTP).
 */
export default function GoogleSignIn({ onDone }: { onDone: (user: SessionUser) => void }) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID || !btnRef.current) return;
    let cancelled = false;

    const init = () => {
      if (cancelled || !window.google?.accounts?.id || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (resp) => {
          setBusy(true);
          setError(false);
          try {
            const user = await signInWithGoogle(resp.credential);
            onDone(user);
          } catch (err) {
            // GOOGLE_DISABLED etc. — show a simple retry message.
            if (err instanceof ApiError) setError(true);
            else setError(true);
          } finally {
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: "320",
      });
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = init;
      document.head.appendChild(s);
      return () => {
        cancelled = true;
      };
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div>
      <div ref={btnRef} className="flex justify-center [&>div]:w-full [&_iframe]:mx-auto" aria-busy={busy} />
      {error && (
        <p className="mt-2 text-center text-sm font-bold text-clay-700">
          <T en="Google sign-in failed — please try again." ur="گوگل سائن اِن ناکام — دوبارہ کوشش کریں۔" />
        </p>
      )}
    </div>
  );
}

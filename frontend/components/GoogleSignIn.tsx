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
 *
 * Responsive: the button width follows its container (clamped to Google's
 * 200–400px limits) so it looks right on mobile and desktop.
 */
export default function GoogleSignIn({ onDone }: { onDone: (user: SessionUser) => void }) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID || !btnRef.current) return;
    let cancelled = false;

    const renderAtContainerWidth = () => {
      if (cancelled || !window.google?.accounts?.id || !btnRef.current) return;
      // Clear any previous render so a resize doesn't stack buttons.
      btnRef.current.innerHTML = "";
      const w = Math.max(200, Math.min(400, Math.floor(btnRef.current.clientWidth || 320)));
      window.google.accounts.id.renderButton(btnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "left",
        width: String(w),
      });
    };

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
      renderAtContainerWidth();
    };

    let ro: ResizeObserver | null = null;
    const onResize = () => {
      // Debounce: re-render the button at the new width.
      if (ro) return;
      ro = new ResizeObserver(() => {
        if (ro) {
          ro.disconnect();
          ro = null;
        }
        renderAtContainerWidth();
      });
      if (btnRef.current) ro.observe(btnRef.current);
    };
    window.addEventListener("resize", onResize);

    if (window.google?.accounts?.id) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div className="w-full">
      <div ref={btnRef} className="flex w-full justify-center [&>div]:!w-full [&_iframe]:!mx-auto [&_iframe]:!max-w-full" aria-busy={busy} />
      {error && (
        <p className="mt-2 text-center text-sm font-bold text-clay-700">
          <T en="Google sign-in failed — please try again." ur="گوگل سائن اِن ناکام — دوبارہ کوشش کریں۔" />
        </p>
      )}
    </div>
  );
}

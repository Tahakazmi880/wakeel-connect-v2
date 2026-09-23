"use client";

/**
 * AdminShell — the admin portal's shell: auth guard, sidebar navigation,
 * top bar, and a mobile drawer. Non-admin users get a clean
 * "not authorized" page and never see admin data.
 */

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/components/LanguageContext";
import { useSession, signOut } from "@/lib/session";
import {
  ShieldIcon,
  CloseIcon,
  HomeIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  ChatIcon,
  ClockIcon,
  MenuIcon,
} from "@/components/icons";

const NAV: { href: string; en: string; ur: string; icon: (p: { className?: string }) => ReactNode }[] = [
  { href: "/admin", en: "Overview", ur: "جائزہ", icon: (p) => <HomeIcon {...p} /> },
  { href: "/admin/applications", en: "Applications", ur: "درخواستیں", icon: (p) => <UserIcon {...p} /> },
  { href: "/admin/leads", en: "Callback leads", ur: "کال بیک لیڈز", icon: (p) => <PhoneIcon {...p} /> },
  { href: "/admin/bookings", en: "Bookings", ur: "بکنگز", icon: (p) => <CalendarIcon {...p} /> },
  { href: "/admin/moderation", en: "Moderation", ur: "نگرانی", icon: (p) => <ChatIcon {...p} /> },
  { href: "/admin/activity", en: "Activity log", ur: "لاگ", icon: (p) => <ClockIcon {...p} /> },
];

function NavList({ onNavigate, pathname }: { onNavigate?: () => void; pathname: string }) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-base font-bold transition-colors ${
              active
                ? "bg-brass-400/20 text-brass-200"
                : "text-ink-200 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className={active ? "text-brass-300" : "text-ink-400"}>{item.icon({ className: "h-5 w-5" })}</span>
            <T en={item.en} ur={item.ur} />
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading } = useSession();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Close the mobile drawer on route change.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isAdmin = !!user && user.role === "ADMIN";

  const doSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-ink-950 lg:flex lg:flex-col">
        <div className="flex items-center gap-2 px-5 pb-2 pt-6">
          <ShieldIcon className="h-7 w-7 text-brass-300" />
          <p className="font-display text-[1.3rem] font-semibold text-white">
            wakeel<span className="text-brass-300">.connect</span>
          </p>
        </div>
        <p className="px-5 text-sm font-extrabold uppercase tracking-widest text-ink-400">
          <T en="Admin portal" ur="ایڈمن پورٹل" />
        </p>
        <div className="mt-3 flex-1">
          <NavList pathname={pathname} />
        </div>
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-base font-bold text-ink-200 hover:bg-white/5 hover:text-white"
          >
            <HomeIcon className="h-5 w-5 text-ink-400" />
            <T en="View public site" ur="عوامی سائٹ دیکھیں" />
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink-950/60"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-ink-950 shadow-2xl">
            <div className="flex items-center justify-between px-5 pb-2 pt-5">
              <p className="font-display text-[1.2rem] font-semibold text-white">
                wakeel<span className="text-brass-300">.connect</span>
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-200 hover:bg-white/10"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavList pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="border-t border-white/10 p-4">
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-base font-bold text-ink-200 hover:bg-white/5 hover:text-white"
              >
                <HomeIcon className="h-5 w-5 text-ink-400" />
                <T en="View public site" ur="عوامی سائٹ دیکھیں" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex min-h-[64px] items-center gap-3 border-b border-ink-900/10 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open admin menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-900/5 lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <p className="min-w-0 flex-1 truncate text-base font-extrabold uppercase tracking-widest text-ink-400 lg:hidden">
            <T en="Admin portal" ur="ایڈمن پورٹل" />
          </p>
          <div className="ml-auto flex items-center gap-3">
            {isAdmin && (
              <p className="hidden truncate text-base text-ink-600 sm:block" title={user?.phone}>
                {user?.fullName ?? user?.phone}
              </p>
            )}
            <button
              type="button"
              onClick={() => void doSignOut()}
              disabled={signingOut}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-ink-900/15 px-4 text-base font-bold text-ink-700 hover:bg-ink-900/5 disabled:opacity-50"
            >
              <T en={signingOut ? "Signing out…" : "Log out"} ur={signingOut ? "لاگ آؤٹ ہو رہا ہے…" : "لاگ آؤٹ"} />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {loading ? (
            <div aria-hidden className="space-y-3" role="status" aria-label="Loading">
              <div className="h-10 w-56 animate-pulse rounded-lg bg-ink-900/5" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl bg-ink-900/5" />
                ))}
              </div>
            </div>
          ) : !isAdmin ? (
            <div className="mx-auto max-w-2xl px-4 py-14 text-center">
              <ShieldIcon className="mx-auto h-12 w-12 text-ink-300" />
              <h1 className="mt-4 font-display text-[1.8rem] font-semibold text-ink-950">
                <T en="Admins only" ur="صرف ایڈمن کے لیے" />
              </h1>
              <p className="mt-2 text-lg text-ink-600">
                <T
                  en="This portal is restricted to wakeel.connect administrators. Log in with an admin account to continue."
                  ur="یہ پورٹل صرف wakeel.connect ایڈمنز کے لیے ہے۔ جاری رکھنے کے لیے ایڈمن اکاؤنٹ سے لاگ اِن کریں۔"
                />
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex min-h-[52px] items-center rounded-lg bg-court-700 px-6 text-base font-bold text-white hover:bg-court-800"
                >
                  <T en="Go to login" ur="لاگ اِن پر جائیں" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex min-h-[52px] items-center rounded-lg border border-ink-900/15 px-6 text-base font-bold text-ink-700 hover:bg-ink-900/5"
                >
                  <T en="Back to site" ur="سائٹ پر واپس" />
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

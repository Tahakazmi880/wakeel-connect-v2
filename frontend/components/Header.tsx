/**
 * WakeelConnect global header — oladoc-depth nested navigation,
 * adapted to a legal marketplace (navy/brass theme).
 *
 * Desktop (lg+): logo · Practice Areas ▾ · Courts ▾ · Cities ▾ ·
 * Q&A · Guides · Callback · expanding header search · language · Join/Login
 * Mobile (<lg): hamburger → slide-in drawer (MobileDrawer.tsx) with
 * 3-level accordions.
 *
 * Menus open on click (never hover), one at a time; Escape and
 * outside-click close them. No invented counts anywhere — names only.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { T, useLang } from "./LanguageContext";
import {
  BriefcaseIcon,
  CalendarIcon,
  CloseIcon,
  MenuIcon,
  ShieldIcon,
  UserIcon,
} from "./icons";
import { useSession, signOut } from "@/lib/session";
// CITIES / PRACTICE_AREAS / COURTS are reference tables (same data the DB
// seeds). They are safe to read client-side; real lawyer data comes from the API.
import { CITIES, COURTS, PRACTICE_AREAS, getCity } from "@/lib/data";
import HeaderSearch from "./HeaderSearch";
import MobileDrawer from "./MobileDrawer";
import LoginModal, { type LoginRole } from "./LoginModal";

/** Chevron used by menus + drawer accordions (icons.tsx has none; Header owns it). */
export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={`flex shrink-0 items-center ${compact ? "gap-2" : "gap-2.5"}`} aria-label="WakeelConnect home">
      <img
        src="/logo-mark.png"
        alt="WakeelConnect logo"
        width={compact ? 32 : 40}
        height={compact ? 32 : 40}
        className={`${compact ? "h-8 w-8" : "h-10 w-10"} rounded-lg object-cover`}
      />
      <span
        className={`font-display font-semibold tracking-tight text-ink-950 ${
          compact ? "text-[1.05rem]" : "text-[1.45rem]"
        }`}
      >
        Wakeel<span className="text-brass-600">Connect</span>
      </span>
    </Link>
  );
}

type MenuId = "areas" | "courts" | "cities" | "login" | "account";

const NAV_LINK =
  "flex min-h-[44px] items-center whitespace-nowrap px-3.5 text-[0.98rem] font-semibold text-ink-800 transition hover:text-court-800";
const MENU_BTN =
  "flex min-h-[44px] items-center gap-1 whitespace-nowrap rounded-lg px-3.5 text-[0.98rem] font-semibold text-ink-800 transition hover:bg-ink-900/5 hover:text-court-800";
const SOLID_BTN =
  "hidden min-h-[44px] items-center rounded-lg bg-court-700 px-5 text-[0.98rem] font-bold text-white shadow-card transition hover:bg-court-800 md:inline-flex";
const PANEL =
  "absolute left-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-[0_18px_50px_-12px_rgba(16,28,58,0.25)]";
const PANEL_LINK =
  "flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-ink-800 transition hover:bg-court-50 hover:text-court-800";

const TOP_CITY_SLUGS = ["karachi", "lahore", "islamabad"];

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      aria-label={lang === "en" ? "اردو میں دیکھیں" : "View in English"}
      className="hidden min-h-[44px] items-center rounded-lg px-3 text-[0.98rem] font-bold text-ink-700 transition hover:text-court-800 md:inline-flex"
    >
      {lang === "en" ? "اردو" : "EN"}
    </button>
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<LoginRole>("CLIENT");
  const navRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useSession();
  const ready = !loading;

  const closeMenus = () => {
    setOpenMenu(null);
    setSubOpen(null);
  };

  // Subtle shadow once the page scrolls (header height never changes → no layout shift).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes open menus.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  // Clicking outside the nav closes open menus.
  // NOTE: uses "click" (not "mousedown") on purpose — with mousedown the
  // menu would unmount under the user's cursor before their click lands,
  // swallowing clicks on menu items (e.g. "Login as Client" never opened).
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenus();
    };
    document.addEventListener("click", onDown);
    return () => document.removeEventListener("click", onDown);
  }, [openMenu]);

  const toggleMenu = (id: MenuId) =>
    setOpenMenu((cur) => {
      if (cur === id) return null;
      setSubOpen(null);
      return id;
    });

  const topCities = CITIES.filter((c) => TOP_CITY_SLUGS.includes(c.slug));

  const menuButton = (id: MenuId, en: string, ur: string) => (
    <button
      type="button"
      onClick={() => toggleMenu(id)}
      aria-expanded={openMenu === id}
      aria-haspopup="true"
      className={`${MENU_BTN} ${openMenu === id ? "bg-ink-900/5 text-court-800" : ""}`}
    >
      <T en={en} ur={ur} />
      <ChevronIcon className={`h-4 w-4 text-ink-400 transition-transform ${openMenu === id ? "rotate-180" : ""}`} />
    </button>
  );

  return (
    <>
    <header
      className={`sticky top-0 z-40 border-b border-ink-900/10 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_2px_16px_rgba(16,28,58,0.10)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <span className="shrink-0 sm:hidden">
          <Logo compact />
        </span>
        <span className="hidden shrink-0 sm:block">
          <Logo />
        </span>
        <nav className="hidden items-center xl:flex" aria-label="Main">
          <div ref={navRef} className="flex items-center">
            {/* Practice Areas mega-menu: area rows → city deep-links */}
            <div className="relative">
              {menuButton("areas", "Practice Areas", "قانونی شعبے")}
              {openMenu === "areas" && (
                <div className={`${PANEL} max-h-[70vh] w-[36rem] overflow-y-auto p-3`}>
                  <div className="grid grid-cols-2 gap-x-2">
                    {PRACTICE_AREAS.map((a) => {
                      const subId = `a-${a.slug}`;
                      const expanded = subOpen === subId;
                      return (
                        <div key={a.slug} className="rounded-lg">
                          <div className="flex items-center">
                            <Link
                              href={`/lawyers?area=${a.slug}`}
                              onClick={closeMenus}
                              className={`${PANEL_LINK} min-w-0 flex-1`}
                            >
                              <span className="truncate">
                                <T en={a.nameEn} ur={a.nameUr} />
                              </span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => setSubOpen(expanded ? null : subId)}
                              aria-expanded={expanded}
                              aria-label={`${a.nameEn} — ${expanded ? "collapse" : "expand"}`}
                              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-ink-400 transition hover:bg-court-50 hover:text-court-700"
                            >
                              <ChevronIcon className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                          {expanded && (
                            <ul className="ml-3 space-y-0.5 border-s-2 border-court-100 py-1 pl-2">
                              {topCities.map((c) => (
                                <li key={c.slug}>
                                  <Link
                                    href={`/lawyers?area=${a.slug}&city=${c.slug}`}
                                    onClick={closeMenus}
                                    className="block rounded-md px-2 py-1.5 text-[0.9rem] font-medium text-ink-600 transition hover:bg-court-50 hover:text-court-800"
                                  >
                                    <T en={`${a.nameEn} in ${c.nameEn}`} ur={`${c.nameUr} میں ${a.nameUr}`} />
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link
                                  href={`/lawyers?area=${a.slug}`}
                                  onClick={closeMenus}
                                  className="block rounded-md px-2 py-1.5 text-[0.9rem] font-bold text-court-700 transition hover:bg-court-50"
                                >
                                  <T en={`View all ${a.nameEn} lawyers`} ur={`تمام ${a.nameUr} وکلاء دیکھیں`} />
                                </Link>
                              </li>
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Courts dropdown → /lawyers?court=<slug> (backend `court` filter lands with the honesty fix) */}
            <div className="relative">
              {menuButton("courts", "Courts", "عدالتیں")}
              {openMenu === "courts" && (
                <div className={`${PANEL} max-h-[70vh] w-80 overflow-y-auto p-2`}>
                  {COURTS.map((c) => {
                    const city = getCity(c.citySlug);
                    return (
                      <Link key={c.slug} href={`/lawyers?court=${c.slug}`} onClick={closeMenus} className={PANEL_LINK}>
                        <span className="min-w-0">
                          <span className="block truncate">
                            <T en={c.nameEn} ur={c.nameUr} />
                          </span>
                          {city && (
                            <span className="block text-[0.82rem] font-medium text-ink-500">
                              <T en={city.nameEn} ur={city.nameUr} />
                            </span>
                          )}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cities dropdown: city rows → area deep-links */}
            <div className="relative">
              {menuButton("cities", "Cities", "شہر")}
              {openMenu === "cities" && (
                <div className={`${PANEL} max-h-[70vh] w-[34rem] overflow-y-auto p-3`}>
                  <div className="grid grid-cols-2 gap-x-2">
                    {CITIES.map((c) => {
                      const subId = `c-${c.slug}`;
                      const expanded = subOpen === subId;
                      return (
                        <div key={c.slug} className="rounded-lg">
                          <div className="flex items-center">
                            <Link
                              href={`/lawyers?city=${c.slug}`}
                              onClick={closeMenus}
                              className={`${PANEL_LINK} min-w-0 flex-1`}
                            >
                              <span className="truncate">
                                <T en={c.nameEn} ur={c.nameUr} />
                              </span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => setSubOpen(expanded ? null : subId)}
                              aria-expanded={expanded}
                              aria-label={`${c.nameEn} — ${expanded ? "collapse" : "expand"}`}
                              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-ink-400 transition hover:bg-court-50 hover:text-court-700"
                            >
                              <ChevronIcon className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                          {expanded && (
                            <ul className="ml-3 max-h-56 space-y-0.5 overflow-y-auto border-s-2 border-court-100 py-1 pl-2">
                              {PRACTICE_AREAS.map((a) => (
                                <li key={a.slug}>
                                  <Link
                                    href={`/lawyers?city=${c.slug}&area=${a.slug}`}
                                    onClick={closeMenus}
                                    className="block rounded-md px-2 py-1.5 text-[0.9rem] font-medium text-ink-600 transition hover:bg-court-50 hover:text-court-800"
                                  >
                                    <T en={a.nameEn} ur={a.nameUr} />
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link
                                  href={`/lawyers?city=${c.slug}`}
                                  onClick={closeMenus}
                                  className="block rounded-md px-2 py-1.5 text-[0.9rem] font-bold text-court-700 transition hover:bg-court-50"
                                >
                                  <T en={`View all lawyers in ${c.nameEn}`} ur={`${c.nameUr} کے تمام وکلاء دیکھیں`} />
                                </Link>
                              </li>
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Direct links */}
            <Link href="/questions" className={NAV_LINK}>
              <T en="Q&A" ur="سوال جواب" />
            </Link>
            <Link href="/guides" className={NAV_LINK}>
              <T en="Guides" ur="رہنمائی" />
            </Link>
            <Link href="/callback" className={NAV_LINK}>
              <T en="Callback" ur="کال بیک" />
            </Link>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <div className="hidden xl:block">
            <HeaderSearch />
          </div>
          <LangSwitch />
          {ready &&
            (user ? (
              /* Signed-in account dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu("account")}
                  aria-expanded={openMenu === "account"}
                  aria-haspopup="true"
                  className={`${MENU_BTN} hidden md:flex`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-court-700 text-sm font-bold text-white">
                    {(user.fullName || user.phone).charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-28 truncate">
                    {(user.fullName || user.phone).split(" ")[0]}
                  </span>
                  <ChevronIcon
                    className={`h-4 w-4 text-ink-400 transition-transform ${openMenu === "account" ? "rotate-180" : ""}`}
                  />
                </button>
                {openMenu === "account" && (
                  <div className={`${PANEL} right-0 left-auto w-60 p-2`}>
                    <Link href="/dashboard" onClick={closeMenus} className={PANEL_LINK}>
                      <CalendarIcon className="h-5 w-5 shrink-0 text-court-600" />
                      <T en="My bookings" ur="میری بکنگز" />
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link href="/admin" onClick={closeMenus} className={`${PANEL_LINK} text-brass-700`}>
                        <ShieldIcon className="h-5 w-5 shrink-0" />
                        <T en="Admin" ur="ایڈمن" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        closeMenus();
                        void signOut();
                      }}
                      className={`${PANEL_LINK} w-full text-left`}
                    >
                      <UserIcon className="h-5 w-5 shrink-0 text-ink-400" />
                      <T en="Logout" ur="لاگ آؤٹ" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* No helpline pill until a real support number is confirmed — do not ship a fake number. */}
                {/* Mobile pill (oladoc pattern) — desktop keeps the SOLID_BTN below. */}
                <Link
                  href="/join"
                  className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-court-700 px-3 text-[0.82rem] font-bold text-white shadow-card transition hover:bg-court-800 md:hidden"
                >
                  <T en="Join as Lawyer" ur="وکیل بنیں" />
                </Link>
                <Link href="/join" className={SOLID_BTN}>
                  <T en="Join as Lawyer" ur="وکیل بنیں" />
                </Link>
                {/* Login dropdown: Client / Lawyer roles */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu("login")}
                    aria-expanded={openMenu === "login"}
                    aria-haspopup="true"
                    className="hidden min-h-[44px] items-center gap-1 rounded-lg border border-court-700/40 bg-white px-5 text-[0.98rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50 md:inline-flex"
                  >
                    <T en="Login" ur="لاگ اِن" />
                    <ChevronIcon
                      className={`h-4 w-4 text-court-600 transition-transform ${openMenu === "login" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openMenu === "login" && (
                    <div className={`${PANEL} right-0 left-auto w-64 p-2`}>
                      {/* LoginModal props contract: open / onClose / initialRole ("CLIENT" | "LAWYER"). */}
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole("CLIENT");
                          setLoginOpen(true);
                          closeMenus();
                        }}
                        className={`${PANEL_LINK} w-full text-left`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-court-50 text-court-700">
                          <UserIcon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block">
                            <T en="Login as Client" ur="بطور کلائنٹ لاگ اِن" />
                          </span>
                          <span className="block text-[0.82rem] font-medium text-ink-500">
                            <T en="Book & manage consultations" ur="مشاورت بک کریں اور دیکھیں" />
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole("LAWYER");
                          setLoginOpen(true);
                          closeMenus();
                        }}
                        className={`${PANEL_LINK} w-full text-left`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brass-50 text-brass-700">
                          <BriefcaseIcon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block">
                            <T en="Login as Lawyer" ur="بطور وکیل لاگ اِن" />
                          </span>
                          <span className="block text-[0.82rem] font-medium text-ink-500">
                            <T en="Manage your practice" ur="اپنی پریکٹس سنبھالیں" />
                          </span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ))}
          <button
            type="button"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg text-ink-800 transition hover:bg-ink-900/5 xl:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-label="Menu"
          >
            {drawerOpen ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
          </button>
        </div>
      </div>
    </header>
    {/* Portals-out: MobileDrawer and LoginModal must live OUTSIDE <header>.
        The header's backdrop-blur creates a containing block that traps
        fixed-position descendants to the 64px header box. */}
    <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    <LoginModal
      open={loginOpen}
      onClose={() => setLoginOpen(false)}
      initialRole={loginRole}
    />
  </>
  );
}

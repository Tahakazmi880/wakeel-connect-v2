/**
 * Mobile navigation drawer (oladoc-depth, adapted for a legal marketplace).
 *
 * Slide-in side panel, visible below the lg breakpoint:
 *  - top row: logo + close
 *  - auth block: two login tiles (client / lawyer) when signed out,
 *    "Hello, {name}" accordion when signed in
 *  - level-1 accordions (chevron + tagline) → level-2 accordions → deep links
 *  - direct links with taglines
 *  - footer: Join as Lawyer CTA + language toggle
 *
 * No invented data: links carry names only, never counts/fees/ratings.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { T, useLang } from "./LanguageContext";
import {
  BriefcaseIcon,
  CalendarIcon,
  ChatIcon,
  CloseIcon,
  DocIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
} from "./icons";
import { useSession, signOut } from "@/lib/session";
import { CITIES, COURTS, PRACTICE_AREAS, getCity } from "@/lib/data";
import { ChevronIcon, Logo } from "./Header";
import LoginModal, { type LoginRole } from "./LoginModal";

const TOP_CITY_SLUGS = ["karachi", "lahore", "islamabad"];

const TILE =
  "flex items-center justify-center gap-2 rounded-xl border border-court-700/30 bg-court-50 px-3 py-3.5 text-[0.95rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-100";
const DEEP_LINK =
  "block rounded-lg px-3 py-2.5 text-[0.95rem] font-medium text-ink-700 transition hover:bg-court-50 hover:text-court-800";

/** Level-1 accordion group (full-width button, chevron + tagline). */
function Group({
  id,
  icon,
  title,
  tagline,
  openId,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  tagline: React.ReactNode;
  openId: string | null;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const open = openId === id;
  return (
    <div className="border-b border-ink-900/10">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="flex min-h-[64px] w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-court-50 text-court-700">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[1.05rem] font-bold text-ink-900">{title}</span>
          <span className="block truncate text-sm text-ink-500">{tagline}</span>
        </span>
        <ChevronIcon className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-3 pb-4">{children}</div>}
    </div>
  );
}

/** Level-2 accordion row: name + chevron → deep links. */
function SubRow({
  id,
  label,
  subLabel,
  open,
  onToggle,
  children,
}: {
  id: string;
  label: React.ReactNode;
  subLabel?: React.ReactNode;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="flex min-h-[48px] w-full items-center gap-2 rounded-lg px-3 text-left transition hover:bg-court-50"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.98rem] font-semibold text-ink-800">{label}</span>
          {subLabel && <span className="block truncate text-sm text-ink-500">{subLabel}</span>}
        </span>
        <ChevronIcon className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="ml-4 space-y-0.5 border-s-2 border-court-100 py-1 pl-2">{children}</ul>
      )}
    </div>
  );
}

const DIRECT_LINKS = [
  {
    href: "/lawyers",
    icon: <SearchIcon className="h-5 w-5" />,
    en: "Find a Lawyer",
    ur: "وکیل تلاش کریں",
    tagEn: "Browse the full directory",
    tagUr: "مکمل ڈائریکٹری دیکھیں",
  },
  {
    href: "/questions",
    icon: <ChatIcon className="h-5 w-5" />,
    en: "Q&A",
    ur: "سوال جواب",
    tagEn: "Free legal answers",
    tagUr: "مفت قانونی جوابات",
  },
  {
    href: "/guides",
    icon: <DocIcon className="h-5 w-5" />,
    en: "Legal Guides",
    ur: "قانونی رہنمائی",
    tagEn: "Know your rights",
    tagUr: "اپنے حقوق جانیں",
  },
  {
    href: "/callback",
    icon: <CalendarIcon className="h-5 w-5" />,
    en: "Request a Callback",
    ur: "کال بیک کی درخواست",
    tagEn: "We call you back",
    tagUr: "ہم آپ کو کال کریں گے",
  },
];

export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, loading } = useSession();
  const { lang, setLang } = useLang();
  const [l1, setL1] = useState<string | null>(null);
  const [l2, setL2] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<LoginRole>("CLIENT");

  const openLogin = (role: LoginRole) => {
    onClose(); // close drawer first so the modal sits on top
    setLoginRole(role);
    setLoginOpen(true);
  };

  // Scroll lock + Escape while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const toggleL1 = (id: string) => {
    setL1((cur) => (cur === id ? null : id));
    setL2(null);
  };
  const toggleL2 = (id: string) => setL2((cur) => (cur === id ? null : id));

  const ready = !loading;
  const topCities = CITIES.filter((c) => TOP_CITY_SLUGS.includes(c.slug));

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-ink-950/45 transition-opacity xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={lang === "ur" ? "مینیو" : "Menu"}
        className={`fixed inset-y-0 left-0 z-[70] flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 xl:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between border-b border-ink-900/10 px-4 py-3">
          <Logo compact />
          <button
            type="button"
            onClick={onClose}
            aria-label={lang === "ur" ? "بند کریں" : "Close menu"}
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg text-ink-700 transition hover:bg-ink-900/5"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Auth block */}
          {ready &&
            (user ? (
              <div className="border-b border-ink-900/10">
                <button
                  type="button"
                  onClick={() => toggleL1("__account")}
                  aria-expanded={l1 === "__account"}
                  className="flex min-h-[64px] w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court-700 text-white">
                    <UserIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[1.05rem] font-bold text-ink-900">
                      <T
                        en={`Hello, ${(user.fullName || user.phone).split(" ")[0]}`}
                        ur={`السلام علیکم، ${(user.fullName || user.phone).split(" ")[0]}`}
                      />
                    </span>
                    <span className="block truncate text-sm text-ink-500">
                      <T en="Your account" ur="آپ کا اکاؤنٹ" />
                    </span>
                  </span>
                  <ChevronIcon
                    className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${l1 === "__account" ? "rotate-180" : ""}`}
                  />
                </button>
                {l1 === "__account" && (
                  <div className="px-3 pb-4">
                    <Link href="/dashboard" onClick={onClose} className={DEEP_LINK}>
                      <T en="My bookings" ur="میری بکنگز" />
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link href="/admin" onClick={onClose} className={`${DEEP_LINK} font-bold text-brass-700`}>
                        <T en="Admin" ur="ایڈمن" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void signOut();
                        onClose();
                      }}
                      className={`${DEEP_LINK} w-full text-left`}
                    >
                      <T en="Logout" ur="لاگ آؤٹ" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 border-b border-ink-900/10 p-4">
                <button
                  type="button"
                  onClick={() => openLogin("CLIENT")}
                  className={TILE}
                >
                  <UserIcon className="h-5 w-5 shrink-0" />
                  <T en="Login as Client" ur="بطور کلائنٹ لاگ اِن" />
                </button>
                <button
                  type="button"
                  onClick={() => openLogin("LAWYER")}
                  className={TILE}
                >
                  <BriefcaseIcon className="h-5 w-5 shrink-0" />
                  <T en="Login as Lawyer" ur="بطور وکیل لاگ اِن" />
                </button>
              </div>
            ))}

          {/* Level-1: Practice Areas */}
          <Group
            id="areas"
            icon={<DocIcon className="h-5 w-5" />}
            title={<T en="Practice Areas" ur="قانونی شعبے" />}
            tagline={<T en="Divorce, bail, property & more" ur="طلاق، ضمانت، جائیداد وغیرہ" />}
            openId={l1}
            onToggle={toggleL1}
          >
            {PRACTICE_AREAS.map((a) => (
              <SubRow
                key={a.slug}
                id={`a-${a.slug}`}
                label={<T en={a.nameEn} ur={a.nameUr} />}
                open={l2 === `a-${a.slug}`}
                onToggle={toggleL2}
              >
                {topCities.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/lawyers?area=${a.slug}&city=${c.slug}`} onClick={onClose} className={DEEP_LINK}>
                      <T en={`${a.nameEn} in ${c.nameEn}`} ur={`${c.nameUr} میں ${a.nameUr}`} />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/lawyers?area=${a.slug}`}
                    onClick={onClose}
                    className={`${DEEP_LINK} font-bold text-court-700`}
                  >
                    <T en={`View all ${a.nameEn} lawyers`} ur={`تمام ${a.nameUr} وکلاء دیکھیں`} />
                  </Link>
                </li>
              </SubRow>
            ))}
          </Group>

          {/* Level-1: Courts */}
          <Group
            id="courts"
            icon={<ShieldIcon className="h-5 w-5" />}
            title={<T en="Courts" ur="عدالتیں" />}
            tagline={<T en="High courts & city courts" ur="ہائی کورٹس اور سٹی کورٹس" />}
            openId={l1}
            onToggle={toggleL1}
          >
            <ul className="space-y-0.5">
              {COURTS.map((c) => {
                const city = getCity(c.citySlug);
                return (
                  <li key={c.slug}>
                    <Link href={`/lawyers?court=${c.slug}`} onClick={onClose} className={DEEP_LINK}>
                      <span className="block font-semibold text-ink-800">
                        <T en={c.nameEn} ur={c.nameUr} />
                      </span>
                      {city && (
                        <span className="block text-sm text-ink-500">
                          <T en={city.nameEn} ur={city.nameUr} />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Group>

          {/* Level-1: Cities */}
          <Group
            id="cities"
            icon={<SearchIcon className="h-5 w-5" />}
            title={<T en="Cities" ur="شہر" />}
            tagline={<T en="Karachi, Lahore, Islamabad & more" ur="کراچی، لاہور، اسلام آباد وغیرہ" />}
            openId={l1}
            onToggle={toggleL1}
          >
            {CITIES.map((c) => (
              <SubRow
                key={c.slug}
                id={`c-${c.slug}`}
                label={<T en={c.nameEn} ur={c.nameUr} />}
                open={l2 === `c-${c.slug}`}
                onToggle={toggleL2}
              >
                {PRACTICE_AREAS.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/lawyers?city=${c.slug}&area=${a.slug}`} onClick={onClose} className={DEEP_LINK}>
                      <T en={a.nameEn} ur={a.nameUr} />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/lawyers?city=${c.slug}`}
                    onClick={onClose}
                    className={`${DEEP_LINK} font-bold text-court-700`}
                  >
                    <T
                      en={`View all lawyers in ${c.nameEn}`}
                      ur={`${c.nameUr} کے تمام وکلاء دیکھیں`}
                    />
                  </Link>
                </li>
              </SubRow>
            ))}
          </Group>

          {/* Direct links */}
          <div className="border-b border-ink-900/10 py-2">
            {DIRECT_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="flex min-h-[60px] items-center gap-3 px-4 py-2 transition hover:bg-court-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-court-50 text-court-700">
                  {l.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.02rem] font-bold text-ink-900">
                    <T en={l.en} ur={l.ur} />
                  </span>
                  <span className="block truncate text-sm text-ink-500">
                    <T en={l.tagEn} ur={l.tagUr} />
                  </span>
                </span>
                <ChevronIcon className="h-5 w-5 -rotate-90 text-ink-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-ink-900/10 bg-white px-4 py-4">
          <Link
            href="/join"
            onClick={onClose}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-court-700 text-[1rem] font-bold text-white shadow-card transition hover:bg-court-800"
          >
            <BriefcaseIcon className="h-5 w-5" />
            <T en="Join as Lawyer" ur="وکیل بنیں" />
          </Link>
          <div className="mt-3 flex items-center justify-center gap-2" role="group" aria-label="Language / زبان">
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`min-h-[44px] rounded-lg px-5 text-[0.95rem] font-bold transition ${
                lang === "en" ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-900/5"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("ur")}
              aria-pressed={lang === "ur"}
              className={`min-h-[44px] rounded-lg px-5 text-lg font-bold transition ${
                lang === "ur" ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-900/5"
              }`}
            >
              اردو
            </button>
          </div>
        </div>
      </aside>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        initialRole={loginRole}
      />
    </>
  );
}

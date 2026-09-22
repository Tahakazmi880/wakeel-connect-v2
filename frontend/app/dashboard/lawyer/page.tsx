import type { Metadata } from "next";
import { T } from "@/components/LanguageContext";
import { Avatar, DemoNotice, PrimaryBtn, Stars, VerifiedBadge } from "@/components/ui";
import { BriefcaseIcon, CalendarIcon, CheckIcon, ClockIcon, DocIcon, UserIcon, WalletIcon } from "@/components/icons";
import { getLawyer } from "@/lib/data";

export const metadata: Metadata = {
  title: "Lawyer Dashboard — wakeel.connect",
  description: "Manage your profile, availability and bookings.",
};

export default function LawyerDashboard() {
  const me = getLawyer("ahmed-raza-demo")!;

  const cards = [
    { icon: <CalendarIcon className="h-8 w-8" />, en: "Today's bookings", ur: "آج کی بکنگز", val: "4", noteEn: "2 video · 2 office", noteUr: "۲ ویڈیو · ۲ دفتر" },
    { icon: <WalletIcon className="h-8 w-8" />, en: "This month", ur: "اس ماہ", val: "Rs. 86,000", noteEn: "32 consultations", noteUr: "۳۲ مشاورتیں" },
    { icon: <UserIcon className="h-8 w-8" />, en: "Profile views", ur: "پروفائل دیکھے گئے", val: "1,240", noteEn: "+18% this week", noteUr: "اس ہفتے +۱۸٪" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar name={me.displayName} size="sm" />
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold text-slate-900">
              {me.displayName} <VerifiedBadge />
            </h1>
            <Stars rating={me.rating} count={me.reviewCount} />
          </div>
        </div>
        <PrimaryBtn href={`/lawyer/${me.slug}`} icon={<UserIcon className="h-6 w-6" />}>
          <T en="View public profile" ur="عوامی پروفائل دیکھیں" />
        </PrimaryBtn>
      </div>

      <div className="mx-auto mt-6 max-w-3xl"><DemoNotice /></div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.en} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">{c.icon}</span>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">{c.val}</p>
            <p className="text-base font-extrabold text-slate-700"><T en={c.en} ur={c.ur} /></p>
            <p className="text-sm text-slate-500"><T en={c.noteEn} ur={c.noteUr} /></p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* availability */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <ClockIcon className="h-6 w-6 text-emerald-700" /> <T en="Weekly availability" ur="ہفتہ وار دستیابی" />
          </h2>
          <div className="mt-4 space-y-2">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d, i) => (
              <div key={d} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-base font-bold text-slate-700">{d}</span>
                <button
                  type="button"
                  className={`min-h-[44px] rounded-full px-5 text-sm font-extrabold transition ${i < 5 ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  <T en={i < 5 ? "9 AM – 5 PM" : "Closed"} ur={i < 5 ? "صبح ۹ – شام ۵" : "بند"} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* upcoming bookings */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <CalendarIcon className="h-6 w-6 text-emerald-700" /> <T en="Upcoming bookings" ur="آنے والی بکنگز" />
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              { n: "Bilal S.", t: "Today · 10:30 AM", m: "video" },
              { n: "Nasreen A.", t: "Today · 2:00 PM", m: "office" },
              { n: "Tariq M.", t: "Tomorrow · 11:00 AM", m: "video" },
            ].map((b) => (
              <li key={b.n + b.t} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-base font-extrabold text-slate-900">{b.n}</p>
                  <p className="text-sm text-slate-500">{b.t} · {b.m}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                  <CheckIcon className="h-4 w-4" /> <T en="Confirmed" ur="پکی" />
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 text-base font-bold text-emerald-800 hover:bg-emerald-50">
              <DocIcon className="h-5 w-5" /> <T en="Edit profile" ur="پروفائل بدلیں" />
            </button>
            <button type="button" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 text-base font-bold text-emerald-800 hover:bg-emerald-50">
              <BriefcaseIcon className="h-5 w-5" /> <T en="Services & fees" ur="خدمات و فیس" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

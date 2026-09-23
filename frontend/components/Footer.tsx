import Link from "next/link";
import { T } from "./LanguageContext";
import { BriefcaseIcon, DocIcon, ShieldIcon } from "./icons";
import { CITIES, COURTS, PRACTICE_AREAS, getCity } from "@/lib/data";

const GUIDES = [
  {
    slug: "/guides/khula-process-pakistan",
    titleEn: "Khula ka process",
    titleUr: "خلع کا طریقہ کار",
  },
  {
    slug: "/guides/fir-kaise-darj-karain",
    titleEn: "FIR kaise darj karayein",
    titleUr: "ایف آئی آر درج کرنے کا طریقہ",
  },
  {
    slug: "/guides/property-registry-transfer-pakistan",
    titleEn: "Property registry in Pakistan",
    titleUr: "پاکستان میں جائیداد کی رجسٹری",
  },
];

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-brass-300">
      {children}
    </h3>
  );
}

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-950 text-ink-200">
      {/* Brass hairline + faint jali band */}
      <div className="wc-jali-light border-t-2 border-brass-500/70" aria-hidden>
        <div className="h-6" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand block */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-court-700 text-white">
                <BriefcaseIcon className="h-5 w-5" />
              </span>
              <span className="font-display text-[1.45rem] font-semibold tracking-tight text-paper">
                wakeel<span className="text-brass-400">.connect</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[1.02rem] leading-relaxed text-ink-300">
              <T
                en="Pakistan's lawyer directory. Find the right wakeel for your case — online or in person."
                ur="پاکستان کی وکیل ڈائریکٹری۔ اپنے کیس کے لیے درست وکیل تلاش کریں — آن لائن یا ملاقات کے ذریعے۔"
              />
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-semibold text-ink-200 ring-1 ring-white/10">
              <ShieldIcon className="h-5 w-5 shrink-0 text-brass-400" />
              <T en="Every profile is reviewed by our team" ur="ہر پروفائل ہماری ٹیم کی نظر سے گزرتا ہے" />
            </p>
          </div>

          {/* Top Cities */}
          <div>
            <ColHeading><T en="Top Cities" ur="بڑے شہر" /></ColHeading>
            <ul className="space-y-3 text-[1.02rem]">
              {CITIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link className="text-ink-300 transition hover:text-paper" href={`/cities/${c.slug}`}>
                    <T en={`Lawyers in ${c.nameEn}`} ur={`${c.nameUr} میں وکیل`} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <ColHeading><T en="Practice Areas" ur="قانونی شعبے" /></ColHeading>
            <ul className="space-y-3 text-[1.02rem]">
              {PRACTICE_AREAS.slice(0, 6).map((a) => (
                <li key={a.slug}>
                  <Link className="text-ink-300 transition hover:text-paper" href={`/practice-areas/${a.slug}`}>
                    <T en={a.nameEn} ur={a.nameUr} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courts */}
          <div>
            <ColHeading><T en="High Courts" ur="ہائی کورٹس" /></ColHeading>
            <ul className="space-y-3 text-[1.02rem]">
              {COURTS.map((c) => {
                const city = getCity(c.citySlug);
                return (
                  <li key={c.slug}>
                    <Link className="text-ink-300 transition hover:text-paper" href={`/lawyers?court=${c.slug}`}>
                      <T en={c.nameEn} ur={c.nameUr} />
                      {city && (
                        <span className="text-ink-500">
                          {" "}· <T en={city.nameEn} ur={city.nameUr} />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal Guides + Company */}
          <div>
            <ColHeading><T en="Legal Guides" ur="قانونی رہنمائی" /></ColHeading>
            <ul className="space-y-3 text-[1.02rem]">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link className="inline-flex items-center gap-2 text-ink-300 transition hover:text-paper" href={g.slug}>
                    <DocIcon className="h-4 w-4 shrink-0 text-brass-400" />
                    <T en={g.titleEn} ur={g.titleUr} />
                  </Link>
                </li>
              ))}
              <li>
                <Link className="font-bold text-brass-300 transition hover:text-brass-200" href="/guides">
                  <T en="All guides →" ur="تمام گائیڈز ←" />
                </Link>
              </li>
            </ul>
            <div className="mt-9">
              <ColHeading><T en="Company" ur="کمپنی" /></ColHeading>
              <ul className="space-y-3 text-[1.02rem]">
                <li>
                  <Link className="text-ink-300 transition hover:text-paper" href="/lawyers">
                    <T en="Find a Lawyer" ur="وکیل تلاش کریں" />
                  </Link>
                </li>
                <li>
                  <Link className="text-ink-300 transition hover:text-paper" href="/join">
                    <T en="Join as Lawyer" ur="وکیل بنیں" />
                  </Link>
                </li>
                <li>
                  <Link className="text-ink-300 transition hover:text-paper" href="/questions">
                    <T en="Q&A Forum" ur="سوال جواب" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar: © — helpline number goes here once the real one is provided */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[0.95rem] text-ink-400 sm:flex-row">
          <p>© 2026 wakeel.connect — <T en="All rights reserved." ur="جملہ حقوق محفوظ ہیں۔" /></p>
          <p className="font-display italic text-ink-500">
            <T en="Insaaf, within everyone's reach." ur="انصاف، سب کی پہنچ میں۔" />
          </p>
        </div>
      </div>
    </footer>
  );
}

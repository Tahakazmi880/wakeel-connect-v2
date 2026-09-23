import Link from "next/link";
import { T } from "./LanguageContext";
import { DocIcon, ShieldIcon } from "./icons";
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
    <h3 className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-ink-500">
      {children}
    </h3>
  );
}

const LINK_CLS = "text-ink-600 transition hover:text-court-800";

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/10 bg-white text-ink-600">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand block */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo-mark.png"
                alt="wakeel.connect logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="font-display text-[1.45rem] font-semibold tracking-tight text-ink-950">
                wakeel<span className="text-brass-600">.connect</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[1.02rem] leading-relaxed">
              <T
                en="Pakistan's lawyer directory. Find the right wakeel for your case — online or in person."
                ur="پاکستان کی وکیل ڈائریکٹری۔ اپنے کیس کے لیے درست وکیل تلاش کریں — آن لائن یا ملاقات کے ذریعے۔"
              />
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-court-50 px-4 py-2.5 text-sm font-semibold text-court-800 ring-1 ring-court-100">
              <ShieldIcon className="h-5 w-5 shrink-0 text-court-700" />
              <T en="Every profile is reviewed by our team" ur="ہر پروفائل ہماری ٹیم کی نظر سے گزرتا ہے" />
            </p>
          </div>

          {/* Top Cities */}
          <div>
            <ColHeading><T en="Top Cities" ur="بڑے شہر" /></ColHeading>
            <ul className="space-y-3 text-[1.02rem]">
              {CITIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link className={LINK_CLS} href={`/cities/${c.slug}`}>
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
                  <Link className={LINK_CLS} href={`/practice-areas/${a.slug}`}>
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
                    <Link className={LINK_CLS} href={`/lawyers?court=${c.slug}`}>
                      <T en={c.nameEn} ur={c.nameUr} />
                      {city && (
                        <span className="text-ink-400">
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
                  <Link className={`${LINK_CLS} inline-flex items-center gap-2`} href={g.slug}>
                    <DocIcon className="h-4 w-4 shrink-0 text-court-600" />
                    <T en={g.titleEn} ur={g.titleUr} />
                  </Link>
                </li>
              ))}
              <li>
                <Link className="font-bold text-court-700 transition hover:text-court-800" href="/guides">
                  <T en="All guides →" ur="تمام گائیڈز ←" />
                </Link>
              </li>
            </ul>
            <div className="mt-9">
              <ColHeading><T en="Company" ur="کمپنی" /></ColHeading>
              <ul className="space-y-3 text-[1.02rem]">
                <li>
                  <Link className={LINK_CLS} href="/lawyers">
                    <T en="Find a Lawyer" ur="وکیل تلاش کریں" />
                  </Link>
                </li>
                <li>
                  <Link className={LINK_CLS} href="/join">
                    <T en="Join as Lawyer" ur="وکیل بنیں" />
                  </Link>
                </li>
                <li>
                  <Link className={LINK_CLS} href="/contact">
                    <T en="Contact Us" ur="ہم سے رابطہ کریں" />
                  </Link>
                </li>
                <li>
                  <Link className={LINK_CLS} href="/callback">
                    <T en="Request a Callback" ur="کال بیک کی درخواست" />
                  </Link>
                </li>
                <li>
                  <Link className={LINK_CLS} href="/questions">
                    <T en="Q&A Forum" ur="سوال جواب" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO link mesh: practice area x city */}
        <div className="mt-12 rounded-2xl bg-ink-50/60 p-6 ring-1 ring-ink-900/5 sm:p-8">
          <h3 className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-ink-500">
            <T en="Find lawyers by city & practice area" ur="شہر اور شعبے کے حساب سے وکیل تلاش کریں" />
          </h3>
          <ul className="grid gap-x-6 gap-y-2.5 text-[0.95rem] sm:grid-cols-2 lg:grid-cols-4">
            {CITIES.slice(0, 6).flatMap((c) =>
              PRACTICE_AREAS.slice(0, 6).map((a) => (
                <li key={`${c.slug}-${a.slug}`}>
                  <Link className={LINK_CLS} href={`/${c.slug}/${a.slug}`}>
                    <T en={`${a.nameEn} Lawyers in ${c.nameEn}`} ur={`${c.nameUr} میں ${a.nameUr} کے وکیل`} />
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Bottom bar: © — helpline number goes here once the real one is provided */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-900/10 pt-6 text-[0.95rem] text-ink-500 sm:flex-row">
          <p>© 2026 wakeel.connect — <T en="All rights reserved." ur="جملہ حقوق محفوظ ہیں۔" /></p>
          <p className="font-display italic text-ink-500">
            <T en="Insaaf, within everyone's reach." ur="انصاف، سب کی پہنچ میں۔" />
          </p>
        </div>
      </div>
    </footer>
  );
}

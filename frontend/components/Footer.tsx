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

export default function Footer() {
  return (
    <footer className="mt-20 bg-emerald-950 text-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand block */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <BriefcaseIcon className="h-6 w-6" />
              </span>
              <span className="text-2xl font-extrabold">
                <span className="text-white">wakeel</span>
                <span className="text-amber-400">.connect</span>
              </span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-emerald-200">
              <T
                en="Pakistan's verified lawyer directory. Find the right wakeel for your case — online or in person."
                ur="پاکستان کی تصدیق شدہ وکیل ڈائریکٹری۔ اپنے کیس کے لیے درست وکیل تلاش کریں — آن لائن یا ملاقات کے ذریعے۔"
              />
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2 text-sm font-bold text-emerald-100">
              <ShieldIcon className="h-5 w-5 text-amber-400" />
              <T en="Every lawyer is verified by our team" ur="ہر وکیل ہماری ٹیم سے تصدیق شدہ" />
            </p>
          </div>

          {/* Top Cities */}
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-white">
              <T en="Top Cities" ur="بڑے شہر" />
            </h3>
            <ul className="space-y-3 text-base">
              {CITIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link className="hover:text-amber-300" href={`/cities/${c.slug}`}>
                    <T en={`Lawyers in ${c.nameEn}`} ur={`${c.nameUr} میں وکیل`} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-white">
              <T en="Practice Areas" ur="قانونی شعبے" />
            </h3>
            <ul className="space-y-3 text-base">
              {PRACTICE_AREAS.slice(0, 6).map((a) => (
                <li key={a.slug}>
                  <Link className="hover:text-amber-300" href={`/practice-areas/${a.slug}`}>
                    <T en={a.nameEn} ur={a.nameUr} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courts */}
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-white">
              <T en="High Courts" ur="ہائی کورٹس" />
            </h3>
            <ul className="space-y-3 text-base">
              {COURTS.map((c) => {
                const city = getCity(c.citySlug);
                return (
                  <li key={c.slug}>
                    <Link className="hover:text-amber-300" href={`/lawyers?court=${c.slug}`}>
                      <T en={c.nameEn} ur={c.nameUr} />
                      {city && (
                        <span className="text-emerald-300">
                          {" "}
                          · <T en={city.nameEn} ur={city.nameUr} />
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
            <h3 className="mb-4 text-lg font-extrabold text-white">
              <T en="Legal Guides" ur="قانونی رہنمائی" />
            </h3>
            <ul className="space-y-3 text-base">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link className="inline-flex items-center gap-1.5 hover:text-amber-300" href={g.slug}>
                    <DocIcon className="h-4 w-4 shrink-0" />
                    <T en={g.titleEn} ur={g.titleUr} />
                  </Link>
                </li>
              ))}
              <li>
                <Link className="font-bold text-amber-300 hover:text-amber-200" href="/guides">
                  <T en="All guides →" ur="تمام گائیڈز ←" />
                </Link>
              </li>
            </ul>
            <h3 className="mb-4 mt-8 text-lg font-extrabold text-white">
              <T en="Company" ur="کمپنی" />
            </h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link className="hover:text-amber-300" href="/lawyers">
                  <T en="Find a Lawyer" ur="وکیل تلاش کریں" />
                </Link>
              </li>
              <li>
                <Link className="hover:text-amber-300" href="/join">
                  <T en="Join as Lawyer" ur="وکیل بنیں" />
                </Link>
              </li>
              <li>
                <Link className="hover:text-amber-300" href="/questions">
                  <T en="Q&A Forum" ur="سوال جواب" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar: © — helpline number goes here once the real one is provided */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-emerald-800 pt-6 text-sm text-emerald-300 sm:flex-row">
          <p>© 2026 wakeel.connect — <T en="All rights reserved." ur="جملہ حقوق محفوظ ہیں۔" /></p>
        </div>
      </div>
    </footer>
  );
}

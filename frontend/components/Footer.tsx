import Link from "next/link";
import { T } from "./LanguageContext";
import { BriefcaseIcon, PhoneIcon, ShieldIcon } from "./icons";
import { CITIES, PRACTICE_AREAS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mt-20 bg-emerald-950 text-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
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
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-white">
              <T en="Explore" ur="دیکھیں" />
            </h3>
            <ul className="space-y-3 text-base">
              <li><Link className="hover:text-amber-300" href="/lawyers"><T en="Find a Lawyer" ur="وکیل تلاش کریں" /></Link></li>
              <li><Link className="hover:text-amber-300" href="/practice-areas"><T en="Practice Areas" ur="قانونی شعبے" /></Link></li>
              <li><Link className="hover:text-amber-300" href="/cities"><T en="Cities" ur="شہر" /></Link></li>
              <li><Link className="hover:text-amber-300" href="/join"><T en="Join as Lawyer" ur="وکیل بنیں" /></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-white">
              <T en="Top Cities" ur="بڑے شہر" />
            </h3>
            <ul className="space-y-3 text-base">
              {CITIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link className="hover:text-amber-300" href={`/cities/${c.slug}`}>
                    <T en={`Lawyers in ${c.nameEn}`} ur={`${c.nameUr} میں وکیل`} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-white">
              <T en="Popular Services" ur="مقبول خدمات" />
            </h3>
            <ul className="space-y-3 text-base">
              {PRACTICE_AREAS.slice(0, 5).map((a) => (
                <li key={a.slug}>
                  <Link className="hover:text-amber-300" href={`/practice-areas/${a.slug}`}>
                    <T en={a.nameEn} ur={a.nameUr} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-emerald-800 pt-6 text-sm text-emerald-300 sm:flex-row">
          <p>© 2026 wakeel.connect — <T en="All rights reserved." ur="جملہ حقوق محفوظ ہیں۔" /></p>
          <a href="tel:0800-00000" className="inline-flex min-h-[48px] items-center gap-2 font-bold text-white">
            <PhoneIcon className="h-5 w-5" />
            <T en="Helpline: 0800-00000" ur="ہیلپ لائن: 0800-00000" />
          </a>
        </div>
      </div>
    </footer>
  );
}

import { T } from "./LanguageContext";
import { SectionHead } from "./ui";
import { areaGuide, feeRangeForArea } from "@/lib/seo";
import { cityName, type PracticeArea } from "@/lib/data";

/**
 * oladoc-style SEO article block for practice-area pages:
 * "Who is a X lawyer? When should you consult one? What does it cost?"
 * Fee ranges come from real listed fees — never invented.
 */
export default function SeoArticle({ area, citySlug }: { area: PracticeArea; citySlug?: string }) {
  const guide = areaGuide(area);
  const range = feeRangeForArea(area.slug);
  const place = citySlug ? cityName(citySlug) : "Pakistan";

  return (
    <section className="mt-14 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-10">
      <SectionHead
        eyebrowUr="رہنمائی"
        title={<T en={`${area.nameEn} — what to know`} ur={`${area.nameUr} — جاننے کی باتیں`} />}
      />
      <div className="mt-6 space-y-8 text-lg leading-relaxed text-ink-700">
        <div>
          <h3 className="font-display text-[1.3rem] font-semibold text-ink-950">
            <T en={`Who is a ${area.nameEn.toLowerCase()} lawyer?`} ur={`${area.nameUr} کا وکیل کون ہوتا ہے؟`} />
          </h3>
          <p className="mt-2"><T en={guide.whoEn} ur={guide.whoUr} /></p>
        </div>
        <div>
          <h3 className="font-display text-[1.3rem] font-semibold text-ink-950">
            <T en="When should you consult one?" ur="کب رجوع کرنا چاہیے؟" />
          </h3>
          <ul className="mt-2 space-y-2">
            {(guide.whenEn).map((_, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-court-600" aria-hidden />
                <T en={guide.whenEn[i]} ur={guide.whenUr[i]} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-[1.3rem] font-semibold text-ink-950">
            <T en="What does it cost?" ur="فیس کتنی ہوتی ہے؟" />
          </h3>
          <p className="mt-2">
            {range ? (
              <T
                en={`On wakeel.connect, ${area.nameEn.toLowerCase()} lawyers in ${place} currently list consultation fees of ${range}. Every profile shows its fee upfront — you pay the lawyer directly, never more than listed.`}
                ur={`wakeel.connect پر ${place} میں ${area.nameUr} کے وکیل اس وقت ${range} مشاورت فیس درج کر رہے ہیں۔ ہر پروفائل پر فیس پہلے سے واضح ہوتی ہے — آپ فیس براہ راست وکیل کو ادا کرتے ہیں۔`}
              />
            ) : (
              <T
                en={`No ${area.nameEn.toLowerCase()} lawyers are listed in ${place} yet — check back soon, or browse all Pakistan.`}
                ur={`${place} میں ابھی ${area.nameUr} کے کوئی وکیل درج نہیں — جلد دوبارہ دیکھیں۔`}
              />
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

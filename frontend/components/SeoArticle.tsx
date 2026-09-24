import { T } from "./LanguageContext";
import { SectionHead } from "./ui";
import { areaGuide } from "@/lib/seo";
import { cityName, type PracticeArea } from "@/lib/data";

/**
 * oladoc-style SEO article block for practice-area pages:
 * "Who is a X lawyer? When should you consult one? What does it cost?"
 * Fee ranges come from real listed fees (passed in) — never invented.
 */
export default function SeoArticle({
  area,
  citySlug,
  feeRange = null,
}: {
  area: PracticeArea;
  citySlug?: string;
  /** Min–max consultation fee computed from live directory data, or null. */
  feeRange?: string | null;
}) {
  const guide = areaGuide(area);
  const range = feeRange;
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
                en={`On WakeelConnect, ${area.nameEn.toLowerCase()} lawyers in ${place} currently list consultation fees of ${range}. Every profile shows its fee upfront — you pay the lawyer directly, never more than listed.`}
                ur={`WakeelConnect پر ${place} میں ${area.nameUr} کے وکیل اس وقت ${range} مشاورت فیس درج کر رہے ہیں۔ ہر پروفائل پر فیس پہلے سے واضح ہوتی ہے — آپ فیس براہ راست وکیل کو ادا کرتے ہیں۔`}
              />
            ) : (
              <T
                en={`Consultation fees vary by lawyer and matter complexity — each profile below shows its fee upfront where listed, otherwise "Fee on request".`}
                ur={`مشاورت فیس وکیل اور معاملے کے حساب سے مختلف ہوتی ہے — نیچے ہر پروفائل پر فیس واضح ہے جہاں درج ہے، ورنہ "فیس معلوم کریں" لکھا ہوگا۔`}
              />
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

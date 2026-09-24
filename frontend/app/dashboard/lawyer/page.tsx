import type { Metadata } from "next";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "@/components/ui";
import { BriefcaseIcon, CalendarIcon, UserIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Lawyer Dashboard — wakeel.connect",
  description: "Lawyer portal: profile and booking management.",
};

/**
 * Honest placeholder: the backend has no lawyer-self/booking-management
 * endpoints yet, so this page shows no fake stats — only real next steps.
 */
export default function LawyerDashboard() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-court-100">
        <BriefcaseIcon className="h-10 w-10 text-court-700" />
      </span>
      <h1 className="mt-6 font-display text-[2rem] font-semibold text-ink-950">
        <T en="Lawyer portal" ur="وکیل پورٹل" />
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-lg text-ink-600">
        <T
          en="Booking management, availability editing and earnings reports for listed lawyers are coming soon. Nothing here is live yet — we won't show you fake numbers."
          ur="رجسٹرڈ وکیلوں کے لیے بکنگ مینجمنٹ، دستیابی اور آمدنی کی رپورٹس جلد آ رہی ہیں۔ یہاں ابھی کچھ لائیو نہیں — ہم آپ کو جھوٹے اعداد نہیں دکھائیں گے۔"
        />
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <PrimaryBtn href="/join" icon={<UserIcon className="h-6 w-6" />}>
          <T en="Apply as a lawyer" ur="وکیل کے طور پر اپلائی کریں" />
        </PrimaryBtn>
        <SecondaryBtn href="/lawyers" icon={<CalendarIcon className="h-6 w-6" />}>
          <T en="Browse lawyers" ur="وکیل دیکھیں" />
        </SecondaryBtn>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { T } from "./LanguageContext";
import { PrimaryBtn } from "./ui";
import { CalendarIcon } from "./icons";
import SlotPicker, { type SlotPick } from "./SlotPicker";
import { getLawyerSlots, type SlotDay } from "@/lib/api";

/** Real-time availability for a lawyer profile: fetches slots, then a booking CTA. */
export default function LawyerAvailability({ lawyerSlug }: { lawyerSlug: string }) {
  const [days, setDays] = useState<SlotDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pick, setPick] = useState<SlotPick | null>(null);

  useEffect(() => {
    let alive = true;
    getLawyerSlots(lawyerSlug, 7)
      .then((r) => {
        if (alive) {
          setDays(r.days);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [lawyerSlug]);

  if (error) {
    return (
      <p className="rounded-2xl bg-slate-50 p-5 text-base font-semibold text-slate-500">
        <T en="Could not load availability right now — please try booking directly." ur="دستیابی ابھی لوڈ نہیں ہو سکی — براہِ راست بک کرنے کی کوشش کریں۔" />
      </p>
    );
  }

  return (
    <div>
      <SlotPicker days={days} loading={loading} onPick={setPick} />
      <div className="mt-5">
        <PrimaryBtn
          href={pick ? `/book/${lawyerSlug}?date=${pick.date}&start=${pick.start}` : undefined}
          disabled={!pick}
          icon={<CalendarIcon className="h-6 w-6" />}
          className="w-full"
        >
          <T en="Book Appointment" ur="اپائنٹمنٹ بک کریں" />
        </PrimaryBtn>
        {!pick && !loading && (
          <p className="mt-2 text-center text-sm font-semibold text-slate-500">
            <T en="Pick a day and time above to continue" ur="آگے بڑھنے کے لیے اوپر دن اور وقت چنیں" />
          </p>
        )}
      </div>
    </div>
  );
}

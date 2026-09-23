"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { T } from "@/components/LanguageContext";
import AdminQueue from "@/components/AdminQueue";
import { PageHead } from "../_components/AdminUi";

function ApplicationsInner() {
  const params = useSearchParams();
  const initialStatus = params.get("status") ?? "PENDING";
  return (
    <div>
      <PageHead
        title={<T en="Applications" ur="درخواستیں" />}
        sub={
          <T
            en="Review each lawyer's Bar Council enrolment and documents before their profile goes public."
            ur="پروفائل عوامی ہونے سے پہلے ہر وکیل کی بار کونسل رکنیت اور دستاویزات جانچیں۔"
          />
        }
      />
      <AdminQueue initialStatus={initialStatus} />
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense>
      <ApplicationsInner />
    </Suspense>
  );
}

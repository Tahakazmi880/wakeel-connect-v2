import type { Metadata } from "next";
import { Suspense } from "react";
import GuidesList from "./GuidesList";

export const metadata: Metadata = {
  title: "Legal Guides — wakeel.connect",
  description:
    "Simple, plain-language legal guides for Pakistan — khula, FIR, property transfer, tenant rights, bail, custody and more.",
};

export default function GuidesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 text-center text-lg text-slate-500">…</div>}>
      <GuidesList />
    </Suspense>
  );
}

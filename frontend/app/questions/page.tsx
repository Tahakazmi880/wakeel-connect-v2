import type { Metadata } from "next";
import QuestionsClient from "@/components/QuestionsClient";
import { listQuestions, type ForumQuestion } from "@/lib/api";

export const metadata: Metadata = {
  title: "Ask a Legal Question — WakeelConnect",
  description:
    "Ask your legal question for free — lawyers and the community answer. Family, criminal, property, corporate law and more.",
};

export interface QuestionsInitial {
  total: number;
  page: number;
  questions: ForumQuestion[];
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const areaParam = sp.area && sp.area !== "all" ? sp.area : undefined;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  let initial: QuestionsInitial | null = null;
  let loadError = false;
  try {
    const data = await listQuestions(areaParam, page);
    initial = { total: data.total, page: data.page, questions: data.questions };
  } catch {
    loadError = true;
  }

  return (
    <QuestionsClient
      initial={initial}
      initialArea={sp.area ?? "all"}
      initialPage={page}
      loadError={loadError}
    />
  );
}

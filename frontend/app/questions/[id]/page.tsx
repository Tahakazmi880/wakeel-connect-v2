import type { Metadata } from "next";
import QuestionDetailClient from "@/components/QuestionDetailClient";
import { getQuestion } from "@/lib/api";

export const metadata: Metadata = {
  title: "Legal Question — WakeelConnect",
  description: "Read answers to a legal question from lawyers and the community.",
};

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { question } = await getQuestion(id);
    return <QuestionDetailClient initialQuestion={question} />;
  } catch {
    return <QuestionDetailClient initialQuestion={null} />;
  }
}

import type { Metadata } from "next";
import QuestionDetailClient from "@/components/QuestionDetailClient";

export const metadata: Metadata = {
  title: "Legal Question — wakeel.connect",
  description: "Read answers to a legal question from lawyers and the community.",
};

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuestionDetailClient questionId={id} />;
}

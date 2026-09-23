import type { Metadata } from "next";
import QuestionsClient from "@/components/QuestionsClient";

export const metadata: Metadata = {
  title: "Ask a Legal Question — wakeel.connect",
  description: "Ask your legal question for free — lawyers and the community answer. Family, criminal, property, corporate law and more.",
};

export default function QuestionsPage() {
  return <QuestionsClient />;
}

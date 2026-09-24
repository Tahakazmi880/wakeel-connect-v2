import type { Metadata } from "next";
import JoinForm from "@/components/JoinForm";

export const metadata: Metadata = {
  title: "Join as a Lawyer — WakeelConnect",
  description: "Are you a lawyer? Join WakeelConnect for free. Our team verifies every profile before it goes public.",
};

export default function JoinPage() {
  return <JoinForm />;
}

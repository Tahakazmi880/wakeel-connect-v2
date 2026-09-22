import type { Metadata } from "next";
import JoinForm from "@/components/JoinForm";

export const metadata: Metadata = {
  title: "Join as a Lawyer — wakeel.connect",
  description: "Are you a lawyer? Join wakeel.connect for free. Our team verifies every profile before it goes public.",
};

export default function JoinPage() {
  return <JoinForm />;
}

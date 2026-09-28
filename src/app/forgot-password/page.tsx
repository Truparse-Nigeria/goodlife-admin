import type { Metadata } from "next";
import { requestPasswordReset } from "@/app/actions/auth";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthCard } from "@/components/layout/AuthCard";

export const metadata: Metadata = { title: "Forgot password · GoodLife" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Forgot password" subtitle="Enter your account email and we’ll send you a reset link.">
      <ForgotPasswordForm requestAction={requestPasswordReset} />
    </AuthCard>
  );
}

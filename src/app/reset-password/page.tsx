import type { Metadata } from "next";
import { resetPassword } from "@/app/actions/auth";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AuthCard } from "@/components/layout/AuthCard";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = { title: "Reset password · GoodLife" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;

  if (typeof token !== "string" || !token) {
    return (
      <AuthCard title="Invalid reset link" subtitle="This link is missing its reset token. Request a new one.">
        <BackLink href="/forgot-password">Request a new link</BackLink>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset password" subtitle="Choose a new password for your account.">
      <ResetPasswordForm token={token} resetAction={resetPassword} />
    </AuthCard>
  );
}

import type { Metadata } from "next";
import { changeTemporaryPassword, signIn } from "@/app/actions/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCard } from "@/components/layout/AuthCard";

export const metadata: Metadata = { title: "Sign in · GoodLife" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { reset } = await searchParams;
  const initialNotice = reset === "1" ? "Password reset. Sign in with your new password." : null;

  return (
    <AuthCard title="Sign in" subtitle="Use your GoodLife account email and password.">
      <LoginForm
        signInAction={signIn}
        changePasswordAction={changeTemporaryPassword}
        initialNotice={initialNotice}
      />
    </AuthCard>
  );
}

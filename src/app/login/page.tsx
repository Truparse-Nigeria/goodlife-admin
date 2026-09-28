import type { Metadata } from "next";
import { changeTemporaryPassword, signIn } from "@/app/actions/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCard } from "@/components/layout/AuthCard";

export const metadata: Metadata = { title: "Sign in · GoodLife" };

export default function LoginPage() {
  return (
    <AuthCard title="Sign in" subtitle="Use your GoodLife account email and password.">
      <LoginForm signInAction={signIn} changePasswordAction={changeTemporaryPassword} />
    </AuthCard>
  );
}

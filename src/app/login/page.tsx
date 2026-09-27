import type { Metadata } from "next";
import { signIn } from "@/app/actions/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCard } from "@/components/layout/AuthCard";
import { demoCredentials } from "@/data/admin";

export const metadata: Metadata = { title: "Sign in · GoodLife Admin" };

export default function LoginPage() {
  return (
    <AuthCard title="Sign in" subtitle="Choose how you want to access the portal.">
      <LoginForm
        signInAction={signIn}
        adminEmail={demoCredentials.email}
        customerEmail={demoCredentials.customerEmail}
        defaultPassword={demoCredentials.password}
      />
    </AuthCard>
  );
}

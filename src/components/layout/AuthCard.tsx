import type { ReactNode } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { Logo } from "./Logo";

export type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** Centred card with the brand header, used by the sign-in page. */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-auth overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated">
        <div className="flex items-center justify-center bg-brand-deep px-8 py-7">
          <Logo size="lg" priority />
        </div>
        <div className="flex flex-col gap-5 p-8">
          <div>
            <PageTitle size="sm">{title}</PageTitle>
            {subtitle && <p className="mt-1.5 text-14 text-muted">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

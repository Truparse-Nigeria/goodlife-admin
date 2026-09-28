import { BackLink } from "@/components/ui/BackLink";
import { PageTitle } from "@/components/ui/PageTitle";
import type { DisplayStatus } from "@/types/loan";
import { LoanStatusBadge } from "./LoanStatusBadge";

export type LoanHeaderProps = {
  title: string;
  status: DisplayStatus;
  /** e.g. "Personal loan · Applied 26 Sep 2026" */
  subtitle: string;
  backHref?: string;
  backLabel?: string;
};

export function LoanHeader({ title, status, subtitle, backHref = "/loans", backLabel = "Loan applications" }: LoanHeaderProps) {
  return (
    <>
      <BackLink href={backHref}>{backLabel}</BackLink>
      <div className="flex flex-wrap items-center gap-3">
        <PageTitle>{title}</PageTitle>
        <LoanStatusBadge status={status} size="lg" />
        <span className="text-14 text-muted">{subtitle}</span>
      </div>
    </>
  );
}

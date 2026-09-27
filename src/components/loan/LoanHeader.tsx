import { BackLink } from "@/components/ui/BackLink";
import { PageTitle } from "@/components/ui/PageTitle";
import { capitalize, formatDate } from "@/lib/format";
import type { DisplayStatus, Loan } from "@/types/loan";
import { LoanStatusBadge } from "./LoanStatusBadge";

export type LoanHeaderProps = {
  loan: Loan;
  status: DisplayStatus;
  backHref?: string;
  backLabel?: string;
};

export function LoanHeader({ loan, status, backHref = "/loans", backLabel = "Loan applications" }: LoanHeaderProps) {
  return (
    <>
      <BackLink href={backHref}>{backLabel}</BackLink>
      <div className="flex flex-wrap items-center gap-3">
        <PageTitle>{loan.id}</PageTitle>
        <LoanStatusBadge status={status} size="lg" />
        <span className="text-14 text-muted">
          {capitalize(loan.type)} loan · Applied {formatDate(loan.appliedAt)}
        </span>
      </div>
    </>
  );
}

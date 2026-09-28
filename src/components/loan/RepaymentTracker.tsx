import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Table } from "@/components/ui/Table";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import type { ILoanListItem } from "@/interface/loan.interface";
import { toISODate } from "@/lib/dates";
import { formatDate, formatMoney } from "@/lib/format";
import { applicantName, loanDisplayStatus } from "@/lib/loan-rows";
import { LoanStatusBadge } from "./LoanStatusBadge";
import { RepaymentProgress } from "./RepaymentProgress";

export type RepaymentTrackerProps = {
  /** Approved (not fully repaid) loans. */
  loans: ILoanListItem[];
  /** Shown instead of the rows when the loans couldn't be loaded. */
  error?: string;
  className?: string;
};

export function RepaymentTracker({ loans, error, className }: RepaymentTrackerProps) {
  return (
    <Card className={className}>
      <CardHeader
        title="Repayment tracker"
        subtitle="Active loans not yet fully paid"
        action={
          <ButtonLink href="/loans?status=approved" variant="secondary" size="md">
            View all loans
          </ButtonLink>
        }
      />
      <Table layout="tracker">
        <TableHead>
          <div>Borrower</div>
          <div>Repaid</div>
          <div>Balance</div>
          <div>Next due</div>
          <div>Status</div>
        </TableHead>
        {loans.map((loan) => {
          const r = loan.repayment;
          const percent = r?.totalRepayable ? Math.round((r.totalPaid / r.totalRepayable) * 100) : 0;
          return (
            <TableRow key={loan.id} href={`/loans/${loan.id}`}>
              <div>{applicantName(loan)}</div>
              <RepaymentProgress
                label={`${r?.installmentsPaid ?? 0} of ${r?.installmentsTotal ?? loan.durationInMonths} · ${formatMoney(r?.totalPaid ?? 0)}`}
                percent={percent}
              />
              <div className="tabular-nums">{formatMoney(r?.balance ?? 0)}</div>
              <div className="text-13">{formatDate(r?.nextDueDate ? toISODate(r.nextDueDate) : null)}</div>
              <div>
                <LoanStatusBadge status={loanDisplayStatus(loan.status, r?.overdue ?? false)} />
              </div>
            </TableRow>
          );
        })}
        {loans.length === 0 && <TableEmpty>{error ? `Couldn’t load loans: ${error}` : "No active loans."}</TableEmpty>}
      </Table>
    </Card>
  );
}

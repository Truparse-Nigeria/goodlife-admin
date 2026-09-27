import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Table } from "@/components/ui/Table";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import { formatDate, formatMoney } from "@/lib/format";
import type { LoanView } from "@/types/loan";
import { LoanIdCell } from "./LoanIdCell";
import { LoanStatusBadge } from "./LoanStatusBadge";
import { RepaymentProgress } from "./RepaymentProgress";

export type RepaymentTrackerProps = {
  /** Active (not fully repaid) loans. */
  loans: LoanView[];
  className?: string;
};

export function RepaymentTracker({ loans, className }: RepaymentTrackerProps) {
  return (
    <Card className={className}>
      <CardHeader
        title="Repayment tracker"
        subtitle="Active loans not yet fully paid"
        action={
          <ButtonLink href="/loans" variant="secondary" size="md">
            View all loans
          </ButtonLink>
        }
      />
      <Table layout="tracker">
        <TableHead>
          <div>Loan</div>
          <div>Borrower</div>
          <div>Repaid</div>
          <div>Balance</div>
          <div>Next due</div>
          <div>Status</div>
        </TableHead>
        {loans.map(({ loan, customer, summary, status }) => (
          <TableRow key={loan.id} href={`/loans/${loan.id}`}>
            <LoanIdCell id={loan.id} />
            <div>{customer.name}</div>
            <RepaymentProgress
              label={`${summary.paidCount} of ${loan.tenureMonths} · ${formatMoney(summary.paid)}`}
              percent={summary.percentPaid}
            />
            <div className="tabular-nums">{formatMoney(summary.balance)}</div>
            <div className="text-13">{formatDate(summary.next?.dueDate)}</div>
            <div>
              <LoanStatusBadge status={status} />
            </div>
          </TableRow>
        ))}
        {loans.length === 0 && <TableEmpty>No active loans.</TableEmpty>}
      </Table>
    </Card>
  );
}

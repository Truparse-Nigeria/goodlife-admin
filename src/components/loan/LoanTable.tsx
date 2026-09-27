import { Avatar } from "@/components/ui/Avatar";
import { Table } from "@/components/ui/Table";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import { capitalize, formatDate, formatMoney } from "@/lib/format";
import type { LoanView } from "@/types/loan";
import { LoanIdCell } from "./LoanIdCell";
import { LoanStatusBadge } from "./LoanStatusBadge";
import { RepaymentProgress } from "./RepaymentProgress";

/**
 * full    — Loan applications page (sits directly in a card)
 * compact — a borrower's loans on the user page (under a CardHeader)
 */
export type LoanTableVariant = "full" | "compact";

export type LoanTableProps = {
  loans: LoanView[];
  variant?: LoanTableVariant;
  emptyMessage?: string;
};

export function LoanTable({ loans, variant = "full", emptyMessage = "No loans match this filter." }: LoanTableProps) {
  const full = variant === "full";
  return (
    <Table layout={full ? "loans" : "loans-compact"}>
      <TableHead placement={full ? "standalone" : "attached"}>
        <div>Loan ID</div>
        {full && <div>Applicant</div>}
        <div>Type</div>
        <div>Amount</div>
        {full && <div>Tenure</div>}
        <div>Applied</div>
        <div>Repayment</div>
        <div>Status</div>
      </TableHead>

      {loans.map(({ loan, customer, summary, status }) => (
        <TableRow key={loan.id} href={`/loans/${loan.id}`}>
          <LoanIdCell id={loan.id} />
          {full && (
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar name={customer.name} size="sm" tone="neutral" />
              <span className="truncate">{customer.name}</span>
            </div>
          )}
          <div className="text-ink-soft">{capitalize(loan.type)}</div>
          <div className="font-medium tabular-nums">{formatMoney(loan.amount)}</div>
          {full && <div className="text-ink-soft">{loan.tenureMonths} mo</div>}
          <div className="text-13 text-ink-soft">{formatDate(loan.appliedAt)}</div>
          <div>
            {summary.running ? (
              <RepaymentProgress
                label={`${summary.paidCount} of ${loan.tenureMonths} paid · ${summary.percentPaid}%`}
                percent={summary.percentPaid}
              />
            ) : (
              <span className="text-subtle">—</span>
            )}
          </div>
          <div>
            <LoanStatusBadge status={status} />
          </div>
        </TableRow>
      ))}

      {loans.length === 0 && <TableEmpty>{emptyMessage}</TableEmpty>}
    </Table>
  );
}

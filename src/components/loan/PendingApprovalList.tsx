import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Identity } from "@/components/ui/Identity";
import type { ILoanListItem } from "@/interface/loan.interface";
import { toISODate } from "@/lib/dates";
import { formatMoney, formatShortDate } from "@/lib/format";
import { applicantName } from "@/lib/loan-rows";

export type PendingApprovalListProps = {
  loans: ILoanListItem[];
  /** All pending applications, which may be more than are listed. */
  total: number;
  /** Shown as the subtitle when the applications couldn't be loaded. */
  error?: string;
  className?: string;
};

export function PendingApprovalList({ loans, total, error, className }: PendingApprovalListProps) {
  const note = error
    ? `Couldn’t load applications: ${error}`
    : total
      ? `${total} applications need a decision`
      : "No applications waiting";
  return (
    <Card className={className}>
      <CardHeader title="Awaiting approval" subtitle={note} divider />
      <ul>
        {loans.map((loan) => (
          <li key={loan.id}>
            <Link
              href={`/loans/${loan.id}`}
              className="flex items-center gap-3 border-b border-divider px-5 py-3.5 text-ink no-underline transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              <Identity
                name={applicantName(loan)}
                detail={`${loan.type} · ${formatShortDate(toISODate(loan.createdAt))}`}
                tone="warning"
                className="flex-1"
              />
              <div className="text-14 font-semibold tabular-nums">{formatMoney(loan.amount)}</div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

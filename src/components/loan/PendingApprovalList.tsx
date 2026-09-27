import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Identity } from "@/components/ui/Identity";
import { capitalize, formatMoney, formatShortDate } from "@/lib/format";
import type { LoanView } from "@/types/loan";

export type PendingApprovalListProps = {
  loans: LoanView[];
  className?: string;
};

export function PendingApprovalList({ loans, className }: PendingApprovalListProps) {
  const note = loans.length ? `${loans.length} applications need a decision` : "No applications waiting";
  return (
    <Card className={className}>
      <CardHeader title="Awaiting approval" subtitle={note} divider />
      <ul>
        {loans.map(({ loan, customer }) => (
          <li key={loan.id}>
            <Link
              href={`/loans/${loan.id}`}
              className="flex items-center gap-3 border-b border-divider px-5 py-3.5 text-ink no-underline transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              <Identity
                name={customer.name}
                detail={`${loan.id} · ${capitalize(loan.type)} · ${formatShortDate(loan.appliedAt)}`}
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

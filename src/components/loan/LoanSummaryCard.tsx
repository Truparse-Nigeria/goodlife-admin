import { AutoGrid } from "@/components/ui/AutoGrid";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Stat } from "@/components/ui/Stat";
import { capitalize, formatDate, formatMoney } from "@/lib/format";
import type { LoanView } from "@/types/loan";

export type LoanSummaryCardProps = {
  view: LoanView;
};

/** Key figures for a loan; adds repayment progress once it's running. */
export function LoanSummaryCard({ view: { loan, summary } }: LoanSummaryCardProps) {
  const metrics = summary.running
    ? [
        { label: "Principal", value: formatMoney(loan.amount) },
        { label: "Interest rate", value: `${loan.ratePerMonth}% / month` },
        { label: "Monthly installment", value: formatMoney(summary.monthlyInstallment) },
        { label: "Total repayable", value: formatMoney(summary.repayable) },
        { label: "Balance", value: formatMoney(summary.balance) },
      ]
    : [
        { label: "Amount requested", value: formatMoney(loan.amount) },
        { label: "Tenure", value: `${loan.tenureMonths} months` },
        { label: "Type", value: capitalize(loan.type) },
        { label: "Applied", value: formatDate(loan.appliedAt) },
      ];

  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <AutoGrid min={37.5} gap="lg">
        {metrics.map((m) => (
          <Stat key={m.label} variant="inline-md" label={m.label} value={m.value} />
        ))}
      </AutoGrid>

      {summary.running && (
        <div className="flex flex-col gap-2.5 border-t border-divider pt-4.5">
          <div className="flex flex-wrap justify-between gap-2 text-14">
            <span>
              <strong className="font-semibold">{formatMoney(summary.paid)}</strong>{" "}
              <span className="text-muted">paid of {formatMoney(summary.repayable)}</span>
            </span>
            <span className="text-muted">
              {summary.paidCount} of {loan.tenureMonths} installments paid · {summary.percentPaid}%
            </span>
          </div>
          <ProgressBar value={summary.percentPaid} size="lg" label="Repayment progress" />
        </div>
      )}
    </Card>
  );
}

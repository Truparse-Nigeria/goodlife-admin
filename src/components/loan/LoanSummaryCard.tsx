import { AutoGrid } from "@/components/ui/AutoGrid";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Stat } from "@/components/ui/Stat";
import type { RepaymentProgress } from "@/lib/loan-detail";
import type { KeyValueItem } from "@/types/common";

export type LoanSummaryCardProps = {
  metrics: KeyValueItem[];
  /** Shown once the loan has a repayment schedule. */
  progress?: RepaymentProgress | null;
};

/** Key figures for a loan, plus repayment progress when it's running. */
export function LoanSummaryCard({ metrics, progress }: LoanSummaryCardProps) {
  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <AutoGrid min={37.5} gap="lg">
        {metrics.map((m) => (
          <Stat key={m.label} variant="inline-md" label={m.label} value={m.value} />
        ))}
      </AutoGrid>

      {progress && (
        <div className="flex flex-col gap-2.5 border-t border-divider pt-4.5">
          <div className="flex flex-wrap justify-between gap-2 text-14">
            <span>
              <strong className="font-semibold">{progress.paidLabel}</strong>{" "}
              <span className="text-muted">paid of {progress.totalLabel}</span>
            </span>
            <span className="text-muted">{progress.countLabel}</span>
          </div>
          <ProgressBar value={progress.percent} size="lg" label="Repayment progress" />
        </div>
      )}
    </Card>
  );
}

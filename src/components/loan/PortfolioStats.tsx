import { AutoGrid } from "@/components/ui/AutoGrid";
import { Stat } from "@/components/ui/Stat";
import { formatMoney } from "@/lib/format";
import type { PortfolioStats as Stats } from "@/lib/loan-views";

export type PortfolioStatsProps = {
  stats: Stats;
};

/** Dashboard KPI row. */
export function PortfolioStats({ stats }: PortfolioStatsProps) {
  const repaidPct = stats.repayable ? Math.round((stats.repaid / stats.repayable) * 100) : 0;
  return (
    <AutoGrid min={52.5}>
      <Stat label="Total disbursed" value={formatMoney(stats.disbursed)} note={`${stats.approvedCount} approved loans`} />
      <Stat
        label="Total repaid"
        value={formatMoney(stats.repaid)}
        note={`${repaidPct}% of ${formatMoney(stats.repayable)} due overall`}
      />
      <Stat
        label="Outstanding balance"
        value={formatMoney(stats.outstanding)}
        note={`Across ${stats.activeCount} active loans`}
      />
      <Stat
        label="Loans not fully paid"
        value={stats.activeCount}
        note={`${stats.overdueLoanCount} with overdue installments`}
        noteTone={stats.overdueLoanCount ? "danger" : "muted"}
      />
    </AutoGrid>
  );
}

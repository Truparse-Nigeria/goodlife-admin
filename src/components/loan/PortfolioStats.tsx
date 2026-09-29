import { AutoGrid } from "@/components/ui/AutoGrid";
import { Stat } from "@/components/ui/Stat";
import type { ILoanStats } from "@/interface/loan.interface";
import { formatMoney } from "@/lib/format";

export type PortfolioStatsProps = {
  stats: ILoanStats;
};

/** Dashboard KPI row. */
export function PortfolioStats({ stats }: PortfolioStatsProps) {
  const repaidPct = stats.totalRepayable ? Math.round((stats.totalRepaid / stats.totalRepayable) * 100) : 0;
  return (
    <AutoGrid min={52.5}>
      <Stat
        label="Total disbursed"
        value={formatMoney(stats.totalDisbursed)}
        note={`${stats.disbursedCount} loans disbursed`}
      />
      <Stat
        label="Total repaid"
        value={formatMoney(stats.totalRepaid)}
        note={`${repaidPct}% of ${formatMoney(stats.totalRepayable)} due overall`}
      />
      <Stat
        label="Outstanding balance"
        value={formatMoney(stats.outstandingBalance)}
        note={`Across ${stats.openCount} active loans`}
      />
      <Stat
        label="Loans not fully paid"
        value={stats.openCount}
        note={`${stats.overdueCount} in arrears or past their end date`}
        noteTone={stats.overdueCount ? "danger" : "muted"}
      />
    </AutoGrid>
  );
}

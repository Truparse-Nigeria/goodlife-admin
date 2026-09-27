import { AutoGrid } from "@/components/ui/AutoGrid";
import { Stat } from "@/components/ui/Stat";
import { formatMoney } from "@/lib/format";
import type { CustomerSummary } from "@/types/user";

export type UserStatsProps = {
  summary: CustomerSummary;
};

export function UserStats({ summary }: UserStatsProps) {
  const stats = [
    { label: "Loans", value: summary.loanCount },
    { label: "Total borrowed", value: formatMoney(summary.borrowed) },
    { label: "Total repaid", value: formatMoney(summary.repaid) },
    { label: "Outstanding", value: formatMoney(summary.outstanding) },
  ];
  return (
    <AutoGrid min={45}>
      {stats.map((s) => (
        <Stat key={s.label} variant="card-md" label={s.label} value={s.value} />
      ))}
    </AutoGrid>
  );
}

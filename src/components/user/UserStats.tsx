import { AutoGrid } from "@/components/ui/AutoGrid";
import { Stat } from "@/components/ui/Stat";
import type { KeyValueItem } from "@/types/common";

export type UserStatsProps = {
  stats: KeyValueItem[];
};

export function UserStats({ stats }: UserStatsProps) {
  return (
    <AutoGrid min={45}>
      {stats.map((s) => (
        <Stat key={s.label} variant="card-md" label={s.label} value={s.value} />
      ))}
    </AutoGrid>
  );
}

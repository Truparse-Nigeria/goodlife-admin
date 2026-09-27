import { FilterChip } from "@/components/ui/FilterChip";
import type { LoanStatus } from "@/types/loan";

export type LoanStatusFilter = LoanStatus | "all";

const FILTERS: { value: LoanStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export type LoanStatusFiltersProps = {
  active: LoanStatusFilter;
  counts: Record<LoanStatusFilter, number>;
  /** Current search text, preserved across filter changes. */
  query?: string;
};

function hrefFor(status: LoanStatusFilter, query?: string) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `/loans?${qs}` : "/loans";
}

export function LoanStatusFilters({ active, counts, query }: LoanStatusFiltersProps) {
  return (
    <nav aria-label="Filter by status" className="flex flex-wrap gap-1.5">
      {FILTERS.map((f) => (
        <FilterChip
          key={f.value}
          href={hrefFor(f.value, query)}
          label={f.label}
          count={counts[f.value]}
          active={f.value === active}
        />
      ))}
    </nav>
  );
}

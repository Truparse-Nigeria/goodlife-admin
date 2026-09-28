import { FilterChip } from "@/components/ui/FilterChip";
import { API_LOAN_STATUSES, type ApiLoanStatus } from "@/interface/loan.interface";
import { loanListHref, type LoanListParams } from "@/lib/loan-list-params";

export type LoanStatusFiltersProps = {
  params: LoanListParams;
  /** Per-status totals from the API. */
  counts: Record<ApiLoanStatus, number>;
};

export function LoanStatusFilters({ params, counts }: LoanStatusFiltersProps) {
  const all = API_LOAN_STATUSES.reduce((sum, s) => sum + (counts[s] ?? 0), 0);
  return (
    <nav aria-label="Filter by status" className="flex flex-wrap gap-1.5">
      <FilterChip href={loanListHref(params, { status: undefined })} label="All" count={all} active={!params.status} />
      {API_LOAN_STATUSES.map((status) => (
        <FilterChip
          key={status}
          href={loanListHref(params, { status })}
          label={status}
          count={counts[status] ?? 0}
          active={params.status === status}
        />
      ))}
    </nav>
  );
}

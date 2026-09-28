import { API_LOAN_STATUSES, type ApiLoanStatus } from "@/interface/loan.interface";

/** State of the Loan applications list, as kept in the URL (?status=&q=&page=). */
export interface LoanListParams {
  /** Undefined = all statuses. */
  status?: ApiLoanStatus;
  query: string;
  page: number;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

export function parseLoanListParams(params: RawParams): LoanListParams {
  const status = API_LOAN_STATUSES.find((s) => s.toLowerCase() === first(params.status).toLowerCase());
  const page = Number.parseInt(first(params.page), 10);
  return { status, query: first(params.q), page: page > 0 ? page : 1 };
}

/** Link to the list with some params changed. Changing status/search resets to page 1. */
export function loanListHref(current: LoanListParams, change: Partial<LoanListParams>): string {
  const next = { ...current, page: 1, ...change };
  const qs = new URLSearchParams();
  if (next.status) qs.set("status", next.status.toLowerCase());
  if (next.query) qs.set("q", next.query);
  if (next.page > 1) qs.set("page", String(next.page));
  const s = qs.toString();
  return s ? `/loans?${s}` : "/loans";
}

/** Download link for the list as it's currently filtered (every page, not just this one). */
export function loanExportHref({ status, query }: LoanListParams): string {
  const qs = new URLSearchParams();
  if (status) qs.set("status", status.toLowerCase());
  if (query) qs.set("q", query);
  const s = qs.toString();
  return s ? `/loans/export?${s}` : "/loans/export";
}

import type { ISODate } from "@/types/common";
import type { Loan, LoanStatus, LoanView } from "@/types/loan";
import type { Customer, CustomerSummary } from "@/types/user";
import { today } from "./dates";
import { findCustomer, findLoan, listCustomers, listLoans } from "./loan-store";
import { displayStatus, summarizeLoan } from "./loan-schedule";

export type LoanFilter = LoanStatus | "all";

const FILTERS: LoanFilter[] = ["all", "pending", "active", "completed", "rejected"];

export function parseLoanFilter(value: unknown): LoanFilter {
  return FILTERS.includes(value as LoanFilter) ? (value as LoanFilter) : "all";
}

/** First value of a search param, trimmed. */
export function paramString(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function toLoanView(loan: Loan, customer: Customer, asOf: ISODate = today()): LoanView {
  const summary = summarizeLoan(loan, asOf);
  return { loan, customer, summary, status: displayStatus(loan, summary) };
}

export function getLoanViews(): LoanView[] {
  const asOf = today();
  return listLoans().flatMap((loan) => {
    const customer = findCustomer(loan.userId);
    return customer ? [toLoanView(loan, customer, asOf)] : [];
  });
}

export function getLoanView(id: string): LoanView | null {
  const loan = findLoan(id);
  const customer = loan && findCustomer(loan.userId);
  return loan && customer ? toLoanView(loan, customer) : null;
}

export function filterLoanViews(views: LoanView[], filter: LoanFilter, query: string): LoanView[] {
  const q = query.toLowerCase();
  return views.filter(
    (v) =>
      (filter === "all" || v.loan.status === filter) &&
      (!q || v.loan.id.toLowerCase().includes(q) || v.customer.name.toLowerCase().includes(q)),
  );
}

export function countByStatus(views: LoanView[]): Record<LoanFilter, number> {
  const counts = { all: views.length, pending: 0, active: 0, completed: 0, rejected: 0 };
  for (const v of views) counts[v.loan.status] += 1;
  return counts;
}

export function pendingCount(): number {
  return listLoans().filter((l) => l.status === "pending").length;
}

export interface PortfolioStats {
  disbursed: number;
  approvedCount: number;
  repaid: number;
  repayable: number;
  outstanding: number;
  activeCount: number;
  overdueLoanCount: number;
}

export function portfolioStats(views: LoanView[]): PortfolioStats {
  const running = views.filter((v) => v.summary.running);
  const active = views.filter((v) => v.loan.status === "active");
  const sum = (list: LoanView[], pick: (v: LoanView) => number) => list.reduce((a, v) => a + pick(v), 0);
  return {
    disbursed: sum(running, (v) => v.loan.amount),
    approvedCount: running.length,
    repaid: sum(running, (v) => v.summary.paid),
    repayable: sum(running, (v) => v.summary.repayable),
    outstanding: sum(active, (v) => v.summary.balance),
    activeCount: active.length,
    overdueLoanCount: active.filter((v) => v.summary.overdueCount > 0).length,
  };
}

export function summarizeCustomer(customer: Customer, views: LoanView[]): CustomerSummary {
  const own = views.filter((v) => v.customer.id === customer.id);
  const active = own.filter((v) => v.loan.status === "active");
  return {
    customer,
    loanCount: own.length,
    activeCount: active.length,
    borrowed: own.filter((v) => v.summary.running).reduce((a, v) => a + v.loan.amount, 0),
    repaid: own.reduce((a, v) => a + v.summary.paid, 0),
    outstanding: active.reduce((a, v) => a + v.summary.balance, 0),
  };
}

export function getCustomerSummaries(query: string): CustomerSummary[] {
  const q = query.toLowerCase();
  const views = getLoanViews();
  return listCustomers()
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .map((c) => summarizeCustomer(c, views));
}

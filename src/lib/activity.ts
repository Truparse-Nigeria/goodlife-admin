import type { ActivityEvent } from "@/types/activity";
import type { LoanView } from "@/types/loan";
import type { Customer } from "@/types/user";
import { formatMoney } from "./format";

/** A customer's timeline, newest first, derived from their loans. */
export function buildActivity(customer: Customer, views: LoanView[]): ActivityEvent[] {
  const events: ActivityEvent[] = [{ date: customer.joinedAt, kind: "joined", text: "Created an account" }];

  for (const { loan, summary } of views) {
    if (loan.userId !== customer.id) continue;
    events.push({
      date: loan.appliedAt,
      kind: "applied",
      text: `Applied for a ${formatMoney(loan.amount)} ${loan.type} loan · ${loan.id}`,
    });
    if (loan.rejectedAt) {
      events.push({ date: loan.rejectedAt, kind: "rejected", text: `${loan.id} rejected` });
    }
    if (loan.approvedAt) {
      events.push({ date: loan.approvedAt, kind: "approved", text: `${loan.id} approved at ${loan.ratePerMonth}% per month` });
      loan.paidDates.forEach((date, i) =>
        events.push({
          date,
          kind: "repayment",
          text: `Repayment ${i + 1} of ${loan.tenureMonths} recorded · ${formatMoney(summary.monthlyInstallment)} · ${loan.id}`,
        }),
      );
      if (loan.status === "completed" && loan.paidDates.length) {
        events.push({ date: loan.paidDates[loan.paidDates.length - 1], kind: "completed", text: `${loan.id} fully repaid` });
      }
    }
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

import type { ApiLoanStatus, ILoanListItem, ILoanRepaymentProgress, IMyLoanListItem } from "@/interface/loan.interface";
import type { DisplayStatus, LoanRow } from "@/types/loan";
import { toISODate } from "./dates";

export const STATUS_FROM_API: Record<ApiLoanStatus, DisplayStatus> = {
  Pending: "pending",
  Approved: "approved",
  Active: "active",
  Completed: "completed",
  Rejected: "rejected",
  Defaulted: "defaulted",
};

/** API status for display; a running loan with a missed installment shows as overdue. */
export function loanDisplayStatus(status: ApiLoanStatus, overdue: boolean): DisplayStatus {
  return status === "Approved" && overdue ? "overdue" : STATUS_FROM_API[status];
}

/** "1 of 6 paid · 17%" + bar, from a loan's repayment summary (null before approval). */
export function repaymentBar(repayment: ILoanRepaymentProgress | null | undefined): LoanRow["progress"] {
  if (!repayment) return null;
  const percent = repayment.totalRepayable ? Math.round((repayment.totalPaid / repayment.totalRepayable) * 100) : 0;
  return { label: `${repayment.installmentsPaid} of ${repayment.installmentsTotal} paid · ${percent}%`, percent };
}

/** The signed-in customer's own loan → table row (links to their loan page). */
export function rowFromMyLoan(loan: IMyLoanListItem): LoanRow {
  return {
    id: loan.id,
    href: `/my-loans/${loan.id}`,
    applicantName: "",
    type: loan.type,
    amount: loan.amount,
    tenureMonths: Number(loan.durationInMonths),
    appliedAt: toISODate(loan.createdAt),
    status: loanDisplayStatus(loan.status, loan.repayment?.overdue ?? false),
    progress: repaymentBar(loan.repayment),
  };
}

/** "Ada Obi", falling back to the email when the name is missing. */
export function applicantName({ applicant }: Pick<ILoanListItem, "applicant">): string {
  return `${applicant.firstName} ${applicant.lastName}`.trim() || applicant.email;
}

/** goodlife-api loans → table rows. The API has no repayment records yet. */
export function rowFromApiLoan(loan: ILoanListItem): LoanRow {
  return {
    id: loan.id,
    href: `/loans/${loan.id}`,
    applicantName: applicantName(loan),
    type: loan.type,
    amount: loan.amount,
    tenureMonths: loan.durationInMonths,
    appliedAt: toISODate(loan.createdAt),
    status: loanDisplayStatus(loan.status, loan.repayment?.overdue ?? false),
    progress: repaymentBar(loan.repayment),
  };
}

import type { ISODate } from "./common";

/** Derived per-installment state shown in the repayment breakdown. */
export type InstallmentStatus = "paid" | "overdue" | "due-next" | "upcoming";

/** One row of a repayment schedule. Derived from a Loan, never stored. */
export interface Installment {
  /** 1-based installment number. */
  number: number;
  dueDate: ISODate;
  principal: number;
  interest: number;
  total: number;
  paidAt: ISODate | null;
  overdue: boolean;
}

/** Aggregate repayment position of a loan. Derived, never stored. */
export interface LoanSummary {
  /** True once the loan is approved (active or completed). */
  running: boolean;
  installments: Installment[];
  repayable: number;
  paid: number;
  balance: number;
  /** 0–100, rounded. */
  percentPaid: number;
  paidCount: number;
  overdueCount: number;
  next: Installment | null;
  monthlyInstallment: number;
}

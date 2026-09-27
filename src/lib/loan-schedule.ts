import type { ISODate } from "@/types/common";
import type { DisplayStatus, Loan } from "@/types/loan";
import type { Installment, InstallmentStatus, LoanSummary } from "@/types/repayment";
import { addMonths, today } from "./dates";

type ScheduleInput = Pick<Loan, "amount" | "tenureMonths" | "ratePerMonth" | "approvedAt" | "paidDates" | "status">;

/**
 * Flat-interest schedule: each month repays amount / tenure of principal plus
 * rate% of the original amount as interest. Installment k is due k months
 * after approval (or after `asOf` for a preview of an unapproved loan).
 */
export function buildSchedule(loan: ScheduleInput, rate = loan.ratePerMonth ?? 0, asOf: ISODate = today()): Installment[] {
  const start = loan.approvedAt ?? asOf;
  const principal = loan.amount / loan.tenureMonths;
  const interest = (loan.amount * rate) / 100;
  return Array.from({ length: loan.tenureMonths }, (_, i) => {
    const dueDate = addMonths(start, i + 1);
    const paidAt = loan.paidDates[i] ?? null;
    return {
      number: i + 1,
      dueDate,
      principal,
      interest,
      total: principal + interest,
      paidAt,
      overdue: !paidAt && loan.status === "active" && dueDate < asOf,
    };
  });
}

const NOT_RUNNING: Omit<LoanSummary, "installments"> = {
  running: false,
  repayable: 0,
  paid: 0,
  balance: 0,
  percentPaid: 0,
  paidCount: 0,
  overdueCount: 0,
  next: null,
  monthlyInstallment: 0,
};

export function summarizeLoan(loan: Loan, asOf: ISODate = today()): LoanSummary {
  if (loan.status !== "active" && loan.status !== "completed") {
    return { ...NOT_RUNNING, installments: [] };
  }
  const installments = buildSchedule(loan, undefined, asOf);
  const repayable = sumTotals(installments);
  const paid = sumTotals(installments.filter((i) => i.paidAt));
  return {
    running: true,
    installments,
    repayable,
    paid,
    balance: repayable - paid,
    percentPaid: repayable ? Math.round((paid / repayable) * 100) : 0,
    paidCount: loan.paidDates.length,
    overdueCount: installments.filter((i) => i.overdue).length,
    next: installments.find((i) => !i.paidAt) ?? null,
    monthlyInstallment: installments[0]?.total ?? 0,
  };
}

export function sumTotals(installments: Installment[]): number {
  return installments.reduce((acc, i) => acc + i.total, 0);
}

/** Total interest over the life of the loan at a given monthly rate. */
export function totalInterest(loan: Pick<Loan, "amount" | "tenureMonths">, rate: number): number {
  return ((loan.amount * rate) / 100) * loan.tenureMonths;
}

/** Active loans with a missed installment read as "overdue". */
export function displayStatus(loan: Loan, summary: LoanSummary): DisplayStatus {
  return loan.status === "active" && summary.overdueCount > 0 ? "overdue" : loan.status;
}

/** Status of installment at `index`, given how many have been paid. */
export function installmentStatus(installment: Installment, index: number, paidCount: number): InstallmentStatus {
  if (installment.paidAt) return "paid";
  if (installment.overdue) return "overdue";
  if (index === paidCount) return "due-next";
  return "upcoming";
}

"use server";

import { revalidatePath } from "next/cache";
import { today } from "@/lib/dates";
import { findLoan, updateLoan } from "@/lib/loan-store";
import { requireAdmin } from "@/lib/session";

// Loan changes touch the sidebar count, dashboard, lists and detail pages.
function refresh() {
  revalidatePath("/", "layout");
}

function requireLoan(id: string) {
  const loan = findLoan(id);
  if (!loan) throw new Error(`Loan ${id} not found`);
  return loan;
}

export async function approveLoan(loanId: string, ratePerMonth: number): Promise<void> {
  await requireAdmin();
  if (!(Number.isFinite(ratePerMonth) && ratePerMonth > 0)) throw new Error("Interest rate must be greater than 0");
  if (requireLoan(loanId).status !== "pending") throw new Error(`${loanId} is not pending`);
  updateLoan(loanId, (l) => ({ ...l, status: "active", ratePerMonth, approvedAt: today(), paidDates: [] }));
  refresh();
}

export async function rejectLoan(loanId: string): Promise<void> {
  await requireAdmin();
  if (requireLoan(loanId).status !== "pending") throw new Error(`${loanId} is not pending`);
  updateLoan(loanId, (l) => ({ ...l, status: "rejected", rejectedAt: today() }));
  refresh();
}

export async function recordPayment(loanId: string): Promise<void> {
  await requireAdmin();
  if (requireLoan(loanId).status !== "active") throw new Error(`${loanId} is not active`);
  updateLoan(loanId, (l) => {
    const paidDates = [...l.paidDates, today()];
    return { ...l, paidDates, status: paidDates.length >= l.tenureMonths ? "completed" : "active" };
  });
  refresh();
}

export async function undoPayment(loanId: string): Promise<void> {
  await requireAdmin();
  if (requireLoan(loanId).paidDates.length === 0) throw new Error(`${loanId} has no payments to undo`);
  updateLoan(loanId, (l) => ({ ...l, paidDates: l.paidDates.slice(0, -1), status: "active" }));
  refresh();
}

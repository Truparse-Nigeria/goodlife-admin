"use server";

import { revalidatePath } from "next/cache";
import { deletePaymentApi, recordPaymentApi, updateLoanStatusApi } from "@/api/loan";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";
import type { ActionResult } from "@/types/actions";
import type { ApiError } from "@/types/api";
import type { IRecordPayment, IUpdateLoanStatus } from "@/interface/loan.interface";

/** Run an admin API call for a loan, then refresh its pages. */
async function mutateLoan(
  loanId: string,
  call: (token: string) => Promise<{ error?: ApiError }>,
): Promise<ActionResult> {
  const { token } = await requireAdmin();
  const { error } = await call(token);
  redirectIfUnauthorized(error);
  if (error) return { error: error.message };

  revalidatePath(`/loans/${loanId}`);
  revalidatePath("/loans");
  return {};
}

const decide = (loanId: string, body: IUpdateLoanStatus) =>
  mutateLoan(loanId, (token) => updateLoanStatusApi(token, loanId, body));

export async function approveLoan(loanId: string, interestPerMonth: number): Promise<ActionResult> {
  if (!(interestPerMonth > 0 && interestPerMonth <= 100)) return { error: "Enter an interest rate between 0 and 100%." };
  return decide(loanId, { status: "Approved", interestPerMonth });
}

export async function rejectLoan(loanId: string): Promise<ActionResult> {
  return decide(loanId, { status: "Rejected" });
}

export async function recordPayment(loanId: string, installment: number, payment: IRecordPayment): Promise<ActionResult> {
  if (!(payment.amount > 0)) return { error: "Enter an amount greater than 0." };
  return mutateLoan(loanId, (token) => recordPaymentApi(token, loanId, installment, payment));
}

export async function deletePayment(loanId: string, installment: number, paymentId: string): Promise<ActionResult> {
  return mutateLoan(loanId, (token) => deletePaymentApi(token, loanId, installment, paymentId));
}

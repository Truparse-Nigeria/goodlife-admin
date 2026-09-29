"use server";

import { revalidatePath } from "next/cache";
import {
  createLoanApi,
  deletePaymentApi,
  generateLoanFormApi,
  recordPaymentApi,
  updateLoanStatusApi,
} from "@/api/loan";
import { getUsersApi } from "@/api/user";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";
import type { ActionResult } from "@/types/actions";
import type { ApiError } from "@/types/api";
import type { ICreateLoan, IRecordPayment, IUpdateLoanStatus } from "@/interface/loan.interface";
import type { CreateLoanResult, CustomerMatch } from "@/types/actions";

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

export async function recordPayment(loanId: string, payment: IRecordPayment): Promise<ActionResult> {
  if (!(payment.amount > 0)) return { error: "Enter an amount greater than 0." };
  return mutateLoan(loanId, (token) => recordPaymentApi(token, loanId, payment));
}

export async function deletePayment(loanId: string, paymentId: string): Promise<ActionResult> {
  return mutateLoan(loanId, (token) => deletePaymentApi(token, loanId, paymentId));
}

/** Save the prefilled loan form for a loan requested before forms were kept. */
export async function generateLoanForm(loanId: string): Promise<ActionResult> {
  return mutateLoan(loanId, (token) => generateLoanFormApi(token, loanId));
}

/** Submit a loan on a customer's behalf. The API creates the account if the email is new. */
export async function createLoan(body: ICreateLoan): Promise<CreateLoanResult> {
  const { token } = await requireAdmin();
  const { data, response, error } = await createLoanApi(token, body);
  redirectIfUnauthorized(error);
  if (error || !data) return { error: error?.message ?? "Couldn’t create the loan." };

  revalidatePath("/loans");
  revalidatePath(`/users/${data.userId}`);
  return { loanId: data.loanId, message: response?.message ?? "Loan created" };
}

/** Customers matching a name, email or phone, for the create-loan picker. */
export async function searchCustomers(query: string): Promise<CustomerMatch[]> {
  const search = query.trim();
  if (search.length < 2) return [];
  const { token } = await requireAdmin();
  const { data = [], error } = await getUsersApi(token, { search, limit: 6 });
  redirectIfUnauthorized(error);
  return data.map((u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}`.trim(), email: u.email }));
}

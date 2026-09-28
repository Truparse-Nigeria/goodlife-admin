import type { IRecordPayment } from "@/interface/loan.interface";

/** Result of a server action the UI reports on (toast). */
export type ActionResult = { error?: string };

export type ApproveLoanAction = (loanId: string, interestPerMonth: number) => Promise<ActionResult>;
export type RejectLoanAction = (loanId: string) => Promise<ActionResult>;
export type RecordPaymentAction = (
  loanId: string,
  installment: number,
  payment: IRecordPayment,
) => Promise<ActionResult>;
export type DeletePaymentAction = (loanId: string, installment: number, paymentId: string) => Promise<ActionResult>;

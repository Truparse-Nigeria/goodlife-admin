import type { ICreateLoan, IRecordPayment } from "@/interface/loan.interface";

/** Result of a server action the UI reports on (toast). */
export type ActionResult = { error?: string };

export type ApproveLoanAction = (loanId: string, interestPerMonth: number) => Promise<ActionResult>;
export type RejectLoanAction = (loanId: string) => Promise<ActionResult>;
export type RecordPaymentAction = (
  loanId: string,
  installment: number,
  payment: IRecordPayment,
) => Promise<ActionResult>;
export type TeamMemberAction = (id: string) => Promise<ActionResult>;
export type DeletePaymentAction =(loanId: string, installment: number, paymentId: string) => Promise<ActionResult>;

export type CreateLoanResult = { error: string } | { loanId: string; message: string };
export type CreateLoanAction = (body: ICreateLoan) => Promise<CreateLoanResult>;

export type CustomerMatch = { id: string; name: string; email: string };
export type SearchCustomersAction = (query: string) => Promise<CustomerMatch[]>;

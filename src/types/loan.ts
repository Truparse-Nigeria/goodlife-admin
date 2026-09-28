import type { ISODate } from "./common";

export type LoanType = "personal" | "business";

/** Stored lifecycle status. */
export type LoanStatus = "pending" | "active" | "completed" | "rejected";

/**
 * What the UI shows. Mock loans: an active loan with a missed installment reads
 * as overdue. goodlife-api adds approved (not yet disbursed) and defaulted.
 */
export type DisplayStatus = LoanStatus | "overdue" | "approved" | "defaulted";

export interface Business {
  name: string;
  rcNumber: string;
  address: string;
}

/** File names of the documents every applicant uploads. */
export interface LoanDocuments {
  statementOfAccount: string;
  utilityBill: string;
  guarantorForm1: string;
  guarantorForm2: string;
}

/** Extra documents required for business loans. */
export interface BusinessDocuments {
  certificateOfIncorporation: string;
  memart: string;
  statusReport: string;
}

export interface Loan {
  id: string;
  userId: string;
  type: LoanType;
  /** Principal in NGN. */
  amount: number;
  tenureMonths: number;
  purpose: string;
  status: LoanStatus;
  appliedAt: ISODate;
  /** Flat interest, percent of principal per month. Set on approval. */
  ratePerMonth: number | null;
  approvedAt: ISODate | null;
  rejectedAt: ISODate | null;
  /** Dates installments were recorded, in order (index 0 = installment 1). */
  paidDates: ISODate[];
  business: Business | null;
  documents: LoanDocuments;
  businessDocuments: BusinessDocuments | null;
}

/** One row of a loan table, independent of where the loan came from. */
export interface LoanRow {
  id: string;
  href: string;
  applicantName: string;
  type: string;
  amount: number;
  tenureMonths: number;
  appliedAt: ISODate;
  status: DisplayStatus;
  /** Null when there is no repayment data to show. */
  progress: { label: string; percent: number } | null;
}

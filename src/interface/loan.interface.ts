import type { IPaginationMeta } from "@/types/api";
import type { Gender, IAddress, INextOfKin, Title } from "./user.interface";

/** goodlife-api LoanStatusEnum / LoanTypeEnum values. */
export type ApiLoanStatus = "Pending" | "Approved" | "Active" | "Rejected" | "Completed" | "Defaulted";
export type ApiLoanType = "Personal" | "Business";

export const API_LOAN_STATUSES: ApiLoanStatus[] = ["Pending", "Approved", "Active", "Completed", "Rejected", "Defaulted"];

/** Item of GET /admin/loans. Dates are ISO timestamps. */
export interface ILoanListItem {
  id: string;
  /** Null if the linked user no longer exists. */
  userId: string | null;
  /** Null until approved (no schedule yet). */
  repayment: ILoanRepaymentProgress | null;
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  business: { id: string; businessName: string } | null;
  type: ApiLoanType;
  status: ApiLoanStatus;
  amount: number;
  durationInMonths: number;
  purpose: string;
  /** Flat % of the principal per month; set on approval. */
  interestPerMonth: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Item of GET /user/loans (the signed-in customer's own loans). Only the fields the portal uses. */
export interface IMyLoanListItem {
  id: string;
  type: ApiLoanType;
  status: ApiLoanStatus;
  amount: number;
  /** Stored as a string enum ("6"). */
  durationInMonths: string | number;
  createdAt: string;
  /** Null until approved (no schedule yet). */
  repayment: ILoanRepaymentProgress | null;
}

/** Query for GET /admin/loans. */
export interface IGetLoansParams {
  page?: number;
  /** 1–100. */
  limit?: number;
  status?: ApiLoanStatus;
  type?: ApiLoanType;
  /** Applicant name/email, or an exact loan id. */
  search?: string;
}

export interface ILoansMeta extends IPaginationMeta {
  totalPages: number;
  /** Per-status totals for the current type/search (ignores `status`). */
  statusCounts: Record<ApiLoanStatus, number>;
}

export type PaymentMethod = "Transfer" | "Cheque" | "Cash";
export const PAYMENT_METHODS: PaymentMethod[] = ["Transfer", "Cheque", "Cash"];

/** Derived by the API from payments vs amount due. */
export type InstallmentStatus = "Unpaid" | "Partially paid" | "Paid";

/** A payment recorded against an installment (naira). */
export interface IPayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  reference: string | null;
  note: string | null;
  recordedAt: string;
  /** Admin who recorded it; null if unknown. */
  recordedBy?: string | null;
}

/** One month of the repayment schedule (naira). */
export interface IInstallment {
  number: number;
  dueDate: string;
  principal: number;
  interest: number;
  amountDue: number;
  amountPaid: number;
  balance: number;
  status: InstallmentStatus;
  /** Past due and not fully paid. */
  overdue: boolean;
  payments: IPayment[];
}

/** Totals across the schedule (naira). */
export interface IRepaymentSummary {
  totalRepayable: number;
  totalPaid: number;
  balance: number;
  monthlyInstallment: number;
  installmentsPaid: number;
  installmentsTotal: number;
}

/** Repayment summary on list rows: totals plus whether an installment is overdue. */
export type ILoanRepaymentProgress = IRepaymentSummary & {
  overdue: boolean;
  /** Due date of the earliest installment not fully paid; null once all are paid. */
  nextDueDate?: string | null;
};

/** GET /admin/loans/stats — dashboard KPIs across disbursed loans (naira). */
export interface ILoanStats {
  totalDisbursed: number;
  disbursedCount: number;
  totalRepayable: number;
  totalRepaid: number;
  outstandingBalance: number;
  /** Loans not fully paid. */
  openCount: number;
  /** Of those, loans with an installment past due. */
  overdueCount: number;
}

/** Body for POST /admin/loans/:id/installments/:number/payments. */
export interface IRecordPayment {
  /** Naira, ≤ 2 decimals, ≤ the installment's balance. */
  amount: number;
  method: PaymentMethod;
  /** "YYYY-MM-DD"; defaults to today. */
  paidAt?: string;
  reference?: string;
  note?: string;
}

/** GET /admin/loans/:id. Dates are ISO timestamps; document values are URLs. */
export interface ILoanDetail {
  id: string;
  userId: string | null;
  type: ApiLoanType;
  status: ApiLoanStatus;
  amount: number;
  durationInMonths: number;
  purpose: string;
  otherPurpose: string | null;
  sourceOfRepayment: string;
  otherSourceOfRepayment: string | null;
  workingStatus: string;
  monthlyIncome: number;
  positionOfUserInBusiness: string | null;
  referredBy: string | null;
  referrerPhoneNo: string | null;
  /** Flat % of the principal per month; set on approval. */
  interestPerMonth: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  /** Empty until approved. */
  installments: IInstallment[];
  repayment: IRepaymentSummary | null;
  applicant: {
    title: Title | null;
    firstName: string;
    middleName: string | null;
    lastName: string;
    gender: Gender | null;
    dob: string | null;
    email: string;
    phoneNumber: string;
    address: IAddress | null;
    employerName: string | null;
    nin: string | null;
    bvn: string | null;
    bankDetails: { bankName: string; accountNumber: string } | null;
    nextOfKin: INextOfKin | null;
  };
  business: {
    businessName: string;
    CAC: string | null;
    industry: string | null;
    address: IAddress | null;
  } | null;
  documents: {
    validId: string | null;
    signature: string | null;
    statementOfAccount: string | null;
    utilityBill: string | null;
    guarantorForm1: string | null;
    guarantorForm2: string | null;
    cacCertificate: string | null;
    memart: string | null;
    statusReport: string | null;
  };
}

/** Body for PATCH /admin/loans/:id/status. `interestPerMonth` is required to approve. */
export interface IUpdateLoanStatus {
  status: ApiLoanStatus;
  interestPerMonth?: number;
}

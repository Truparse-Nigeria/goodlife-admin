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

/**
 * Derived by the API. "Covered": settled by credit from earlier months.
 * "Missed": the month ended short and the rest moved on as arrears.
 */
export type InstallmentStatus = "Unpaid" | "Partially paid" | "Paid" | "Covered" | "Missed";

/** What to do with the part of a payment above the month's amount due. */
export type ExcessChoice = "Carry forward" | "Reduce capital";

/** A payment, recorded against the month that was open (naira). */
export interface IPayment {
  id: string;
  amount: number;
  excess: ExcessChoice;
  method: PaymentMethod;
  paidAt: string;
  reference: string | null;
  note: string | null;
  recordedAt: string;
  /** Admin who recorded it; null if unknown. */
  recordedBy?: string | null;
}

/**
 * One month of the repayment schedule (naira). Interest is charged on the
 * capital outstanding; the capital is due with the final month. Months after
 * the open one are the plan (nothing carried or paid yet).
 */
export interface IInstallment {
  number: number;
  dueDate: string;
  /** Added after the tenure because capital was still owed. */
  isExtension: boolean;
  /** Capital outstanding this month. */
  capital: number;
  interest: number;
  /** Capital due this month (final month and extensions only). */
  principalDue: number;
  /** interest + principalDue, before credit or arrears. */
  scheduled: number;
  /** From the previous month: + credit, − arrears. */
  carriedIn: number;
  /** scheduled − carriedIn, never below 0. */
  amountDue: number;
  amountPaid: number;
  balance: number;
  status: InstallmentStatus;
  /** Ended short; the rest moved to the next month as arrears. */
  overdue: boolean;
  /** The month payments are recorded against now. */
  isCurrent: boolean;
  /** Where this month's overpayment went. */
  toCapital: number;
  /** To the next month: + credit, − arrears. */
  carriedOut: number;
  refund: number;
  payments: IPayment[];
}

/** Loan-level repayment figures (naira). */
export interface IRepaymentSummary {
  /** Principal + interest over every month, including the plan ahead. */
  totalRepayable: number;
  totalInterest: number;
  totalPaid: number;
  balance: number;
  capitalOutstanding: number;
  monthlyInterest: number;
  /** Older API name for monthlyInterest. */
  monthlyInstallment: number;
  /** Amount scheduled for the last month (capital + its interest). */
  finalPayment: number;
  finalDueDate: string | null;
  /** Credit / arrears brought into the open month. */
  credit: number;
  arrears: number;
  refundDue: number;
  installmentsPaid: number;
  installmentsTotal: number;
  /** In arrears (a month ended short) or past the tenure with capital still owed. */
  overdue: boolean;
  /** Month payments go to; null once repaid. */
  currentPeriod: number | null;
  nextDueDate: string | null;
  nextAmountDue: number;
}

/** Repayment summary on list rows. */
export type ILoanRepaymentProgress = IRepaymentSummary;

/** GET /admin/loans/stats — dashboard KPIs across disbursed loans (naira). */
export interface ILoanStats {
  totalDisbursed: number;
  disbursedCount: number;
  totalRepayable: number;
  totalRepaid: number;
  outstandingBalance: number;
  /** Loans not fully paid. */
  openCount: number;
  /** Of those, loans in arrears or past their end date with capital still owed. */
  overdueCount: number;
}

/** Body for POST /admin/loans/:id/payments (recorded against the open month). */
export interface IRecordPayment {
  /** Naira, ≤ 2 decimals. Any amount: short part-pays, over is handled by `excess`. */
  amount: number;
  method: PaymentMethod;
  /** "YYYY-MM-DD"; defaults to today. */
  paidAt?: string;
  reference?: string;
  note?: string;
  /** Defaults to "Carry forward". */
  excess?: ExcessChoice;
  /** The month the admin saw as open; the API refuses if that changed. */
  period?: number;
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
  /** The only payment that can be undone. */
  lastPaymentId: string | null;
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
    /** Prefilled loan form saved when the loan was requested; null for older loans. */
    loanForm: string | null;
  };
}

/** Body for PATCH /admin/loans/:id/status. `interestPerMonth` is required to approve. */
export interface IUpdateLoanStatus {
  status: ApiLoanStatus;
  interestPerMonth?: number;
}

/* ---------- Admin: create a loan for a customer (POST /admin/loans) ---------- */

export type EmploymentStatus = "Employed" | "Unemployed" | "Self-employed" | "Student" | "Retired";

/** Same body as the website's first application (goodlife-api firstTimeLoanSchema). */
export interface ICreateLoan {
  user: {
    title: Title;
    firstName: string;
    lastName: string;
    gender: Gender;
    /** YYYY-MM-DD */
    dob: string;
    phoneNumber: string;
    email: string;
    address: IAddress;
    nextOfKin: INextOfKin;
    employerName: string;
    nin: string;
    bvn: string;
    bankDetails: { bankName: string; accountNumber: string };
    id_url: string;
    signature: string;
  };
  loan: {
    type: ApiLoanType;
    amount: number;
    /** "1"–"12" */
    durationInMonths: string;
    purpose: string;
    otherPurpose?: string;
    sourceOfRepayment: string;
    otherSourceOfRepayment?: string;
    workingStatus: EmploymentStatus;
    monthlyIncome: number;
    positionOfUserInBusiness?: string;
    guarantorForm1: string;
    guarantorForm2: string;
    statementOfAccount: string;
    utilityBill: string;
  };
  business?: {
    businessName: string;
    CAC: string;
    industry: string;
    address: IAddress;
    memartURL: string;
    certificateURL: string;
    statusReportURL: string;
  };
}

export interface ICreateLoanResult {
  loanId: string;
  userId: string;
  /** True when the loan was added to an existing customer's account. */
  existingCustomer: boolean;
}

import type { IInstallment, ILoanDetail } from "@/interface/loan.interface";
import type { KeyValueItem } from "@/types/common";
import { toISODate } from "./dates";
import { formatAddress, formatDate, formatMoney } from "./format";

/*
 * Turns GET /admin/loans/:id into what each section of the loan page shows.
 * Missing values render as "—".
 */

const DASH = "—";
const or = (value: string | null | undefined) => (value?.trim() ? value : DASH);
const date = (timestamp: string | null) => (timestamp ? formatDate(toISODate(timestamp)) : DASH);

/** "Other" answers carry the applicant's own text alongside. */
const withOther = (value: string, other: string | null) => (other ? `${value} — ${other}` : value);

export interface DocumentLink {
  label: string;
  url: string | null;
}

export function applicantName({ applicant }: ILoanDetail): string {
  return [applicant.firstName, applicant.middleName, applicant.lastName].filter(Boolean).join(" ") || applicant.email;
}

export function loanSubtitle(loan: ILoanDetail): string {
  return `${loan.type} loan · Applied ${date(loan.createdAt)}`;
}

export function loanMetrics(loan: ILoanDetail): KeyValueItem[] {
  return [
    { label: "Amount requested", value: formatMoney(loan.amount) },
    { label: "Tenure", value: `${loan.durationInMonths} month${loan.durationInMonths === 1 ? "" : "s"}` },
    { label: "Interest rate", value: loan.interestPerMonth != null ? `${loan.interestPerMonth}% / month` : "Not set" },
    { label: "Monthly income", value: formatMoney(loan.monthlyIncome) },
    { label: "Start date", value: date(loan.startDate) },
    { label: "End date", value: date(loan.endDate) },
  ];
}

export function loanTermsRows(loan: ILoanDetail): KeyValueItem[] {
  const rows: KeyValueItem[] = [
    { label: "Purpose", value: withOther(loan.purpose, loan.otherPurpose) },
    { label: "Source of repayment", value: withOther(loan.sourceOfRepayment, loan.otherSourceOfRepayment) },
    { label: "Working status", value: loan.workingStatus },
    { label: "Referred by", value: or(loan.referredBy) },
    { label: "Referrer phone", value: or(loan.referrerPhoneNo) },
  ];
  if (loan.business) rows.push({ label: "Position in business", value: or(loan.positionOfUserInBusiness) });
  return rows;
}

export function applicantRows({ applicant }: ILoanDetail): KeyValueItem[] {
  const bank = applicant.bankDetails;
  return [
    { label: "Email", value: or(applicant.email) },
    { label: "Phone", value: or(applicant.phoneNumber) },
    { label: "Date of birth", value: date(applicant.dob) },
    { label: "Gender", value: or(applicant.gender) },
    { label: "Address", value: formatAddress(applicant.address) },
    { label: "Employer", value: or(applicant.employerName) },
    { label: "BVN", value: or(applicant.bvn) },
    { label: "NIN", value: or(applicant.nin) },
    { label: "Bank", value: bank ? `${bank.bankName} · ${bank.accountNumber}` : DASH },
  ];
}

export function nextOfKinRows({ applicant }: ILoanDetail): KeyValueItem[] | null {
  const kin = applicant.nextOfKin;
  if (!kin) return null;
  return [
    { label: "Name", value: [kin.title, kin.firstName, kin.lastName].filter(Boolean).join(" ") },
    { label: "Relationship", value: kin.relationship },
    { label: "Phone", value: or(kin.phoneNumber) },
    { label: "Email", value: or(kin.email) },
    { label: "Address", value: formatAddress(kin.address) },
  ];
}

export function businessSummary({ business }: ILoanDetail): { name: string; detail: string } | null {
  if (!business) return null;
  const parts = [business.CAC, business.industry, formatAddress(business.address)].filter((p) => p && p !== DASH);
  return { name: business.businessName || "Business", detail: parts.join(" · ") };
}

export function applicantDocuments({ documents }: ILoanDetail): DocumentLink[] {
  return [
    { label: "Valid ID", url: documents.validId },
    { label: "Signature", url: documents.signature },
    { label: "Statement of Account", url: documents.statementOfAccount },
    { label: "Utility Bill", url: documents.utilityBill },
    { label: "Guarantor Form 1", url: documents.guarantorForm1 },
    { label: "Guarantor Form 2", url: documents.guarantorForm2 },
  ];
}

export function businessDocuments(loan: ILoanDetail): DocumentLink[] {
  if (!loan.business) return [];
  const { documents } = loan;
  return [
    { label: "Certificate of Incorporation", url: documents.cacCertificate },
    { label: "MEMART", url: documents.memart },
    { label: "Status Report", url: documents.statusReport },
  ];
}

/* ---------- Repayment schedule ---------- */

export type InstallmentDisplay = "paid" | "partial" | "overdue" | "due-next" | "upcoming";

export interface InstallmentRow {
  installment: IInstallment;
  display: InstallmentDisplay;
  /** Line under the badge, e.g. "on 1 Jul 2026" or "₦100,000 of ₦295,833 paid". */
  detail: string | null;
  /** Payments are recorded against the earliest installment not yet fully paid. */
  canRecord: boolean;
}

const paidOf = (i: IInstallment) => `${formatMoney(i.amountPaid)} of ${formatMoney(i.amountDue)} paid`;

export function installmentRows(loan: ILoanDetail): InstallmentRow[] {
  const nextIndex = loan.installments.findIndex((i) => i.status !== "Paid");
  const acceptsPayments = loan.status === "Approved";

  return loan.installments.map((installment, index) => {
    const lastPayment = installment.payments.at(-1);
    let display: InstallmentDisplay;
    let detail: string | null = null;

    if (installment.status === "Paid") {
      display = "paid";
      detail = lastPayment ? `on ${date(lastPayment.paidAt)}` : null;
    } else if (installment.overdue) {
      display = "overdue";
      detail = installment.amountPaid > 0 ? paidOf(installment) : null;
    } else if (installment.status === "Partially paid") {
      display = "partial";
      detail = paidOf(installment);
    } else {
      display = index === nextIndex ? "due-next" : "upcoming";
    }

    return { installment, display, detail, canRecord: acceptsPayments && index === nextIndex };
  });
}

/** Summary figures once the loan has a schedule. */
export function repaymentMetrics(loan: ILoanDetail): KeyValueItem[] {
  const r = loan.repayment!;
  return [
    { label: "Principal", value: formatMoney(loan.amount) },
    { label: "Interest rate", value: `${loan.interestPerMonth}% / month` },
    { label: "Monthly installment", value: formatMoney(r.monthlyInstallment) },
    { label: "Total repayable", value: formatMoney(r.totalRepayable) },
    { label: "Balance", value: formatMoney(r.balance) },
  ];
}

export interface RepaymentProgress {
  paidLabel: string;
  totalLabel: string;
  countLabel: string;
  percent: number;
}

export function repaymentProgress(loan: ILoanDetail): RepaymentProgress | null {
  const r = loan.repayment;
  if (!r) return null;
  const percent = r.totalRepayable ? Math.round((r.totalPaid / r.totalRepayable) * 100) : 0;
  return {
    paidLabel: formatMoney(r.totalPaid),
    totalLabel: formatMoney(r.totalRepayable),
    countLabel: `${r.installmentsPaid} of ${r.installmentsTotal} installments paid · ${percent}%`,
    percent,
  };
}

export function scheduleSubtitle(loan: ILoanDetail): string {
  const first = loan.installments[0];
  return `${loan.interestPerMonth}% flat interest per month · ${formatMoney(loan.repayment?.monthlyInstallment ?? 0)} monthly from ${date(first?.dueDate ?? null)}`;
}

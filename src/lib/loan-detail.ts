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

export type InstallmentDisplay = "paid" | "covered" | "partial" | "overdue" | "due-next" | "upcoming";

export interface InstallmentRow {
  installment: IInstallment;
  display: InstallmentDisplay;
  /** Under the amount due: credit or arrears brought in. */
  dueNote: { text: string; tone: "warning" | "danger" } | null;
  /** Under the amount paid: where an overpayment went. */
  paidNote: string | null;
  /** Under the badge, e.g. "on 1 Jul 2026". */
  paidOn: string | null;
  /** Payments are recorded against the open month. */
  canRecord: boolean;
  /** Holds the loan's most recent payment, the only one that can be undone. */
  canUndo: boolean;
}

function displayOf(i: IInstallment): InstallmentDisplay {
  if (i.status === "Paid") return "paid";
  if (i.status === "Covered") return "covered";
  if (i.overdue) return "overdue";
  if (i.status === "Partially paid") return "partial";
  return i.isCurrent ? "due-next" : "upcoming";
}

function dueNoteOf(i: IInstallment): InstallmentRow["dueNote"] {
  if (i.carriedIn > 0) return { text: `${formatMoney(i.carriedIn)} credit applied`, tone: "warning" };
  if (i.carriedIn < 0) return { text: `incl. ${formatMoney(-i.carriedIn)} arrears`, tone: "danger" };
  return null;
}

function paidNoteOf(i: IInstallment): string | null {
  if (i.toCapital > 0) return `${formatMoney(i.toCapital)} to capital`;
  if (i.carriedOut > 0 && i.payments.length > 0) return `${formatMoney(i.carriedOut)} to next month`;
  if (i.refund > 0) return `${formatMoney(i.refund)} refund due`;
  return null;
}

export function installmentRows(loan: ILoanDetail): InstallmentRow[] {
  const acceptsPayments = loan.status === "Approved";
  const undoable = loan.status === "Approved" || loan.status === "Completed";

  return loan.installments.map((installment) => {
    const lastPayment = installment.payments.at(-1);
    return {
      installment,
      display: displayOf(installment),
      dueNote: dueNoteOf(installment),
      paidNote: paidNoteOf(installment),
      paidOn: lastPayment ? `on ${date(lastPayment.paidAt)}` : null,
      canRecord: acceptsPayments && installment.isCurrent,
      canUndo: undoable && installment.payments.some((p) => p.id === loan.lastPaymentId),
    };
  });
}

/** The open month, which payments are recorded against. */
export function currentInstallment(loan: ILoanDetail): IInstallment | null {
  return loan.installments.find((i) => i.isCurrent) ?? null;
}

/** Summary figures once the loan has a schedule. */
export function repaymentMetrics(loan: ILoanDetail): KeyValueItem[] {
  const r = loan.repayment!;
  return [
    { label: "Capital outstanding", value: formatMoney(r.capitalOutstanding) },
    { label: "Interest rate", value: `${loan.interestPerMonth}% / month` },
    { label: "Monthly interest", value: formatMoney(r.monthlyInterest) },
    { label: "Final payment", value: formatMoney(r.finalPayment) },
    { label: "Balance", value: formatMoney(r.balance) },
  ];
}

/** Badge beside the schedule title while the open month has credit. */
export function creditLabel(loan: ILoanDetail): string | null {
  const r = loan.repayment;
  if (!r || r.credit <= 0 || r.currentPeriod == null) return null;
  return `${formatMoney(r.credit)} credit toward month ${r.currentPeriod}`;
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
  const finalDue = date(loan.repayment?.finalDueDate ?? null);
  const extended = loan.installments.some((i) => i.isExtension)
    ? " Capital still owed after the tenure rolls into a new month with interest until it’s repaid."
    : "";
  return `Interest of ${loan.interestPerMonth}% is charged monthly on the outstanding capital. The capital is repaid with the final installment on ${finalDue}. Overpayments can be moved to the next month or used to reduce capital.${extended}`;
}

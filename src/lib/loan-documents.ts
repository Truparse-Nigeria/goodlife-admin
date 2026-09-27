import type { Loan } from "@/types/loan";
import type { Customer } from "@/types/user";
import { capitalize, formatMoney } from "./format";

export interface DocumentEntry {
  label: string;
  fileName: string;
}

/** Applicant documents: profile ID + signature, then the per-loan uploads. */
export function applicantDocuments(loan: Loan, customer: Customer): DocumentEntry[] {
  return [
    { label: "Valid ID", fileName: customer.idFile },
    { label: "Signature", fileName: customer.signatureFile },
    { label: "Statement of Account", fileName: loan.documents.statementOfAccount },
    { label: "Utility Bill", fileName: loan.documents.utilityBill },
    { label: "Guarantor Form 1", fileName: loan.documents.guarantorForm1 },
    { label: "Guarantor Form 2", fileName: loan.documents.guarantorForm2 },
  ];
}

export function businessDocuments(loan: Loan): DocumentEntry[] {
  const docs = loan.businessDocuments;
  if (!docs) return [];
  return [
    { label: "Certificate of Incorporation", fileName: docs.certificateOfIncorporation },
    { label: "MEMART", fileName: docs.memart },
    { label: "Status Report", fileName: docs.statusReport },
  ];
}

export function loanFormFileName(loan: Loan): string {
  return `loan-form_${loan.id}.pdf`;
}

/** Rows printed on the prefilled loan application form. */
export function loanFormFields(loan: Loan, customer: Customer): { label: string; value: string }[] {
  const rows = [
    { label: "Loan ID", value: loan.id },
    { label: "Loan type", value: capitalize(loan.type) },
    { label: "Amount requested", value: formatMoney(loan.amount) },
    { label: "Tenure", value: `${loan.tenureMonths} months` },
    { label: "Purpose", value: loan.purpose },
    { label: "Interest rate", value: loan.ratePerMonth ? `${loan.ratePerMonth}% per month` : "To be set" },
    { label: "Full name", value: customer.name },
    { label: "Email", value: customer.email },
    { label: "Phone", value: customer.phone },
    { label: "Address", value: customer.address },
    { label: "BVN", value: customer.bvn },
    { label: "Employer", value: customer.employer },
  ];
  if (loan.business) {
    rows.push(
      { label: "Business name", value: loan.business.name },
      { label: "RC number", value: loan.business.rcNumber },
      { label: "Business address", value: loan.business.address },
    );
  }
  return rows;
}

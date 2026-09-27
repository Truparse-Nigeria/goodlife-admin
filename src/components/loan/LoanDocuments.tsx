import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { FileRow } from "@/components/ui/FileRow";
import { Overline } from "@/components/ui/Overline";
import { ToastButton } from "@/components/ui/ToastButton";
import { applicantDocuments, businessDocuments, loanFormFileName } from "@/lib/loan-documents";
import type { Loan } from "@/types/loan";
import type { Customer } from "@/types/user";
import { DocumentList } from "./DocumentList";

export type LoanDocumentsProps = {
  loan: Loan;
  customer: Customer;
};

export function LoanDocuments({ loan, customer }: LoanDocumentsProps) {
  const applicant = applicantDocuments(loan, customer);
  const business = businessDocuments(loan);
  const total = 1 + applicant.length + business.length; // +1 generated loan form

  return (
    <Card>
      <CardHeader
        title="Documents"
        subtitle={`${total} files`}
        subtitleSize="sm"
        action={
          <ToastButton variant="secondary" size="sm" className="font-medium hover:bg-canvas" message={`Preparing ${total} files for ${loan.id}.zip`}>
            Download all
          </ToastButton>
        }
      />
      <FileRow
        label="Prefilled Loan Form"
        fileName={`${loanFormFileName(loan)} · generated`}
        ext="PDF"
        tone="highlight"
        action={
          <ButtonLink href={`/loans/${loan.id}/form`} target="_blank" variant="soft" size="sm">
            Download
          </ButtonLink>
        }
      />
      <DocumentList docs={applicant} />

      {business.length > 0 && (
        <>
          <Overline className="border-t border-border bg-surface-sunken px-5 pt-3 pb-1.5">Business documents</Overline>
          <DocumentList docs={business} />
        </>
      )}
    </Card>
  );
}

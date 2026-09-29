import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { DocumentViewer } from "@/components/ui/DocumentViewer";
import { FileRow } from "@/components/ui/FileRow";
import { Overline } from "@/components/ui/Overline";
import { fileFromUrl } from "@/lib/format";
import type { DocumentLink } from "@/lib/loan-detail";
import { DocumentList } from "./DocumentList";

export type LoanDocumentsProps = {
  /** The prefilled loan form saved when the loan was requested. */
  loanForm: string | null;
  /** Shown instead of "View" when there's no saved form (admins can generate one). */
  missingFormAction?: ReactNode;
  applicant: DocumentLink[];
  business: DocumentLink[];
};

const LOAN_FORM_LABEL = "Prefilled Loan Form";

export function LoanDocuments({ loanForm, missingFormAction, applicant, business }: LoanDocumentsProps) {
  const provided = [...applicant, ...business].filter((d) => d.url).length + (loanForm ? 1 : 0);
  return (
    <Card>
      <CardHeader title="Documents" subtitle={`${provided} files`} subtitleSize="sm" />
      <FileRow
        label={LOAN_FORM_LABEL}
        fileName={loanForm ? `${fileFromUrl(loanForm).name} · saved with the application` : "Not saved for this loan"}
        ext="PDF"
        tone="highlight"
        action={loanForm ? <DocumentViewer label={LOAN_FORM_LABEL} url={loanForm} /> : missingFormAction}
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

import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Overline } from "@/components/ui/Overline";
import type { DocumentLink } from "@/lib/loan-detail";
import { DocumentList } from "./DocumentList";

export type LoanDocumentsProps = {
  applicant: DocumentLink[];
  business: DocumentLink[];
};

export function LoanDocuments({ applicant, business }: LoanDocumentsProps) {
  const provided = [...applicant, ...business].filter((d) => d.url).length;
  return (
    <Card>
      <CardHeader title="Documents" subtitle={`${provided} files`} subtitleSize="sm" />
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

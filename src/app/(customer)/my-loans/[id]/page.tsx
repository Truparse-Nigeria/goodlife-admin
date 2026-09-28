import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMyLoanApi } from "@/api/loan";
import { ApplicantCard } from "@/components/loan/ApplicantCard";
import { BusinessCard } from "@/components/loan/BusinessCard";
import { LoanDocuments } from "@/components/loan/LoanDocuments";
import { LoanHeader } from "@/components/loan/LoanHeader";
import { LoanSummaryCard } from "@/components/loan/LoanSummaryCard";
import { RepaymentBreakdown } from "@/components/loan/RepaymentBreakdown";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { DetailsCard } from "@/components/ui/DetailsCard";
import { TableEmpty } from "@/components/ui/TableEmpty";
import type { ApiLoanStatus } from "@/interface/loan.interface";
import { formatMoney } from "@/lib/format";
import {
  applicantDocuments,
  applicantName,
  applicantRows,
  businessDocuments,
  businessSummary,
  loanMetrics,
  loanSubtitle,
  loanTermsRows,
  nextOfKinRows,
  repaymentMetrics,
  repaymentProgress,
} from "@/lib/loan-detail";
import { loanDisplayStatus } from "@/lib/loan-rows";
import { redirectIfUnauthorized, requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "My loan · GoodLife" };

/** What a customer is told about a loan that has no repayment schedule yet. */
const STATUS_NOTES: Partial<Record<ApiLoanStatus, { title: string; body: string }>> = {
  Pending: {
    title: "Under review",
    body: "We’re reviewing your application. Your repayment plan will appear here once it’s approved.",
  },
  Rejected: {
    title: "Not approved",
    body: "This application wasn’t approved. Contact GoodLife Credit if you have questions.",
  },
};

export default async function MyLoanPage({ params }: PageProps<"/my-loans/[id]">) {
  const { token } = await requireRole("User");
  const { id } = await params;

  const { data: loan, error } = await getMyLoanApi(token, id);
  redirectIfUnauthorized(error);
  if (error?.status === 404) notFound();

  if (!loan) {
    return (
      <div className="flex flex-col gap-5">
        <BackLink href="/my-loans">My loans</BackLink>
        <Card>
          <TableEmpty>Couldn’t load this loan: {error?.message ?? "no data returned"}</TableEmpty>
        </Card>
      </div>
    );
  }

  const installments = loan.installments ?? [];
  const hasSchedule = installments.length > 0;
  const business = businessSummary(loan);
  const nextOfKin = nextOfKinRows(loan);
  const note = hasSchedule ? null : STATUS_NOTES[loan.status];

  return (
    <div className="flex flex-col gap-5">
      <LoanHeader
        title={formatMoney(loan.amount)}
        status={loanDisplayStatus(loan.status, installments.some((i) => i.overdue))}
        subtitle={loanSubtitle(loan)}
        backHref="/my-loans"
        backLabel="My loans"
      />
      <LoanSummaryCard
        metrics={hasSchedule ? repaymentMetrics(loan) : loanMetrics(loan)}
        progress={repaymentProgress(loan)}
      />
      <SplitLayout
        main={
          <>
            {hasSchedule && <RepaymentBreakdown loan={{ ...loan, installments }} readOnly />}
            {note && (
              <Card padding="md">
                <div className="text-15 font-semibold">{note.title}</div>
                <p className="mt-1 text-14 text-muted">{note.body}</p>
              </Card>
            )}
            <DetailsCard title="Loan details" items={loanTermsRows(loan)} />
            {nextOfKin && <DetailsCard title="Next of kin" items={nextOfKin} />}
          </>
        }
        aside={
          <>
            <ApplicantCard name={applicantName(loan)} items={applicantRows(loan)} />
            {business && <BusinessCard name={business.name} detail={business.detail} />}
            <LoanDocuments applicant={applicantDocuments(loan)} business={businessDocuments(loan)} />
          </>
        }
      />
    </div>
  );
}

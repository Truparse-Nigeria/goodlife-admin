import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLoanApi } from "@/api/loan";
import { approveLoan, rejectLoan } from "@/app/actions/loans";
import { ApplicantCard } from "@/components/loan/ApplicantCard";
import { ApprovalPanel } from "@/components/loan/ApprovalPanel";
import { BusinessCard } from "@/components/loan/BusinessCard";
import { LoanDocuments } from "@/components/loan/LoanDocuments";
import { LoanHeader } from "@/components/loan/LoanHeader";
import { LoanSummaryCard } from "@/components/loan/LoanSummaryCard";
import { RepaymentBreakdown } from "@/components/loan/RepaymentBreakdown";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { DetailsCard } from "@/components/ui/DetailsCard";
import { TableEmpty } from "@/components/ui/TableEmpty";
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
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Loan · GoodLife Admin" };

export default async function LoanDetailPage({ params }: PageProps<"/loans/[id]">) {
  const { token } = await requireAdmin();
  const { id } = await params;

  const { data: loan, error } = await getLoanApi(token, id);
  redirectIfUnauthorized(error);
  if (error?.status === 404) notFound();

  if (!loan) {
    return (
      <div className="flex flex-col gap-5">
        <BackLink href="/loans">Loan applications</BackLink>
        <Card>
          <TableEmpty>Couldn’t load this loan: {error?.message ?? "no data returned"}</TableEmpty>
        </Card>
      </div>
    );
  }

  const business = businessSummary(loan);
  const nextOfKin = nextOfKinRows(loan);
  const hasSchedule = loan.installments.length > 0;
  // Approved before schedules were recorded on approval.
  const missingSchedule = !hasSchedule && (loan.status === "Approved" || loan.status === "Completed");

  return (
    <div className="flex flex-col gap-5">
      <LoanHeader title={applicantName(loan)} status={loanDisplayStatus(loan.status, loan.installments.some((i) => i.overdue))} subtitle={loanSubtitle(loan)} />
      <LoanSummaryCard
        metrics={hasSchedule ? repaymentMetrics(loan) : loanMetrics(loan)}
        progress={repaymentProgress(loan)}
      />
      <SplitLayout
        main={
          <>
            {hasSchedule && <RepaymentBreakdown loan={loan} />}
            {missingSchedule && (
              <Card padding="md">
                <div className="text-15 font-semibold">No repayment schedule</div>
                <p className="mt-1 text-14 text-muted">
                  This loan was approved before repayment schedules were recorded, so payments can’t be tracked
                  against it yet.
                </p>
              </Card>
            )}
            {loan.status === "Pending" && (
              <ApprovalPanel
                loanId={loan.id}
                amount={loan.amount}
                tenureMonths={loan.durationInMonths}
                approveAction={approveLoan}
                rejectAction={rejectLoan}
              />
            )}
            <DetailsCard title="Loan details" items={loanTermsRows(loan)} />
            {nextOfKin && <DetailsCard title="Next of kin" items={nextOfKin} />}
          </>
        }
        aside={
          <>
            <ApplicantCard
              name={applicantName(loan)}
              items={applicantRows(loan)}
              action={
                loan.userId && (
                  <ButtonLink href={`/users/${loan.userId}`} variant="secondary" size="xs">
                    View user
                  </ButtonLink>
                )
              }
            />
            {business && <BusinessCard name={business.name} detail={business.detail} />}
            <LoanDocuments applicant={applicantDocuments(loan)} business={businessDocuments(loan)} />
          </>
        }
      />
    </div>
  );
}

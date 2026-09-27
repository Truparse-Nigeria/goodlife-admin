import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { approveLoan, recordPayment, rejectLoan, undoPayment } from "@/app/actions/loans";
import { ApplicantCard } from "@/components/loan/ApplicantCard";
import { ApprovalPanel } from "@/components/loan/ApprovalPanel";
import { BusinessCard } from "@/components/loan/BusinessCard";
import { LoanDocuments } from "@/components/loan/LoanDocuments";
import { LoanHeader } from "@/components/loan/LoanHeader";
import { LoanSummaryCard } from "@/components/loan/LoanSummaryCard";
import { RejectedNotice } from "@/components/loan/RejectedNotice";
import { RepaymentBreakdown } from "@/components/loan/RepaymentBreakdown";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { getLoanView } from "@/lib/loan-views";

export async function generateMetadata({ params }: PageProps<"/loans/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `${decodeURIComponent(id)} · GoodLife Admin` };
}

export default async function LoanDetailPage({ params }: PageProps<"/loans/[id]">) {
  const { id } = await params;
  const view = getLoanView(decodeURIComponent(id));
  if (!view) notFound();
  const { loan, customer, status, summary } = view;

  return (
    <div className="flex flex-col gap-5">
      <LoanHeader loan={loan} status={status} />
      <LoanSummaryCard view={view} />
      <SplitLayout
        main={
          <>
            {summary.running && (
              <RepaymentBreakdown view={view} recordPaymentAction={recordPayment} undoPaymentAction={undoPayment} />
            )}
            {loan.status === "pending" && (
              // key resets the rate input if the loan changes under us
              <ApprovalPanel key={loan.id} loan={loan} approveAction={approveLoan} rejectAction={rejectLoan} />
            )}
            {loan.status === "rejected" && <RejectedNotice rejectedAt={loan.rejectedAt} />}
          </>
        }
        aside={
          <>
            <ApplicantCard loan={loan} customer={customer} />
            {loan.business && <BusinessCard business={loan.business} />}
            <LoanDocuments loan={loan} customer={customer} />
          </>
        }
      />
    </div>
  );
}

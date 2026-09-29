import { recordPayment } from "@/app/actions/loans";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import type { ILoanDetail } from "@/interface/loan.interface";
import { creditLabel, currentInstallment, scheduleSubtitle } from "@/lib/loan-detail";
import { RecordPaymentPanel } from "./RecordPaymentPanel";
import { RecordPaymentProvider } from "./RecordPaymentProvider";
import { RepaymentSchedule } from "./RepaymentSchedule";

export type RepaymentBreakdownProps = {
  loan: ILoanDetail;
  /** Customer view: schedule and payments only, no admin actions. */
  readOnly?: boolean;
};

export function RepaymentBreakdown({ loan, readOnly }: RepaymentBreakdownProps) {
  const credit = creditLabel(loan);
  const month = currentInstallment(loan);
  const next = month ? (loan.installments.find((i) => i.number === month.number + 1) ?? null) : null;
  const canRecord = !readOnly && loan.status === "Approved" && month != null;

  return (
    <Card>
      <RecordPaymentProvider>
        <CardHeader
          className="items-start"
          title="Repayment breakdown"
          subtitle={<span className="leading-normal text-pretty">{scheduleSubtitle(loan)}</span>}
          action={
            credit && (
              <Badge tone="warning" className="px-3 py-1.5 font-semibold">
                {credit}
              </Badge>
            )
          }
        />
        {canRecord && (
          <RecordPaymentPanel
            loanId={loan.id}
            month={month}
            next={next}
            ratePerMonth={loan.interestPerMonth ?? 0}
            recordAction={recordPayment}
          />
        )}
        <RepaymentSchedule loan={loan} readOnly={readOnly} />
      </RecordPaymentProvider>
    </Card>
  );
}

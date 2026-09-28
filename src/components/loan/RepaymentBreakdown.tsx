import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import type { ILoanDetail } from "@/interface/loan.interface";
import { scheduleSubtitle } from "@/lib/loan-detail";
import { RepaymentSchedule } from "./RepaymentSchedule";

export type RepaymentBreakdownProps = {
  loan: ILoanDetail;
  /** Customer view: schedule and payments only, no admin actions. */
  readOnly?: boolean;
};

export function RepaymentBreakdown({ loan, readOnly }: RepaymentBreakdownProps) {
  return (
    <Card>
      <CardHeader title="Repayment breakdown" subtitle={scheduleSubtitle(loan)} />
      <RepaymentSchedule loan={loan} readOnly={readOnly} />
    </Card>
  );
}

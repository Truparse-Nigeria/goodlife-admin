import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { addMonths } from "@/lib/dates";
import { formatDate, formatMoney } from "@/lib/format";
import type { LoanAction } from "@/types/actions";
import type { LoanView } from "@/types/loan";
import { RepaymentSchedule } from "./RepaymentSchedule";

export type RepaymentBreakdownProps = {
  view: LoanView;
  recordPaymentAction: LoanAction;
  undoPaymentAction: LoanAction;
};

/** Card wrapping the live schedule for an approved loan. */
export function RepaymentBreakdown({ view: { loan, summary }, recordPaymentAction, undoPaymentAction }: RepaymentBreakdownProps) {
  const firstDue = loan.approvedAt ? formatDate(addMonths(loan.approvedAt, 1)) : "—";
  return (
    <Card>
      <CardHeader
        title="Repayment breakdown"
        subtitle={`${loan.ratePerMonth}% flat interest per month · ${formatMoney(summary.monthlyInstallment)} monthly from ${firstDue}`}
      />
      <RepaymentSchedule
        mode="live"
        loanId={loan.id}
        installments={summary.installments}
        paidCount={summary.paidCount}
        canRecord={loan.status === "active"}
        recordPaymentAction={recordPaymentAction}
        undoPaymentAction={undoPaymentAction}
      />
    </Card>
  );
}

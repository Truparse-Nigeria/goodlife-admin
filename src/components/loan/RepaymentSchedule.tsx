import { deletePayment } from "@/app/actions/loans";
import { Table } from "@/components/ui/Table";
import { TableFooter } from "@/components/ui/TableFooter";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import type { ILoanDetail } from "@/interface/loan.interface";
import { cn } from "@/lib/cn";
import { toISODate } from "@/lib/dates";
import { formatDate, formatMoney } from "@/lib/format";
import { installmentRows } from "@/lib/loan-detail";
import { InstallmentStatusBadge } from "./InstallmentStatusBadge";
import { PaymentList } from "./PaymentList";
import { RecordPaymentButton } from "./RecordPaymentButton";
import { UndoPaymentButton } from "./UndoPaymentButton";

export type RepaymentScheduleProps = {
  loan: ILoanDetail;
  /** Customer view: no record/undo actions and no action column. */
  readOnly?: boolean;
};

/** Monthly breakdown with capital, interest, what's due and paid, and (for admins) the actions. */
export function RepaymentSchedule({ loan, readOnly = false }: RepaymentScheduleProps) {
  const rows = installmentRows(loan);
  const r = loan.repayment;

  return (
    <Table layout={readOnly ? "schedule-readonly" : "schedule"}>
      <TableHead>
        <div>#</div>
        <div>Due date</div>
        <div>Capital</div>
        <div>Interest</div>
        <div>Principal due</div>
        <div>Amount due</div>
        <div>Paid</div>
        <div>Status</div>
        {!readOnly && <div />}
      </TableHead>

      {rows.map(({ installment: i, display, dueNote, paidNote, paidOn, canRecord, canUndo }) => {
        const lastPayment = i.payments.at(-1);
        return (
          <TableRow
            key={i.number}
            density="compact"
            tone={display === "overdue" ? "danger" : i.isCurrent ? "highlight" : "default"}
            className="tabular-nums"
          >
            <div className="text-muted">{i.number}</div>
            <div className="flex flex-col gap-0.5 text-13">
              {formatDate(toISODate(i.dueDate))}
              {i.isExtension && <span className="text-11 text-danger">Extra month</span>}
            </div>
            <div className="text-ink-soft">{formatMoney(i.capital)}</div>
            <div>{formatMoney(i.interest)}</div>
            <div className={i.principalDue > 0 ? "font-semibold" : undefined}>
              {i.principalDue > 0 ? formatMoney(i.principalDue) : "—"}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">{formatMoney(i.amountDue)}</span>
              {dueNote && (
                <span className={cn("text-11", dueNote.tone === "danger" ? "text-danger" : "text-warning")}>
                  {dueNote.text}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span>{i.amountPaid > 0 ? formatMoney(i.amountPaid) : "—"}</span>
              {paidNote && <span className="text-11 text-brand-strong">{paidNote}</span>}
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <InstallmentStatusBadge status={display} />
              {paidOn && <span className="text-11 text-muted">{paidOn}</span>}
            </div>
            {!readOnly && (
              <div className="flex flex-col items-end gap-1">
                {canRecord && <RecordPaymentButton />}
                {canUndo && lastPayment && (
                  <UndoPaymentButton
                    loanId={loan.id}
                    paymentId={lastPayment.id}
                    description={`${formatMoney(lastPayment.amount)} ${lastPayment.method} on ${formatDate(toISODate(lastPayment.paidAt))}`}
                    deleteAction={deletePayment}
                  />
                )}
              </div>
            )}
            {i.payments.length > 0 && <PaymentList payments={i.payments} />}
          </TableRow>
        );
      })}

      <TableFooter>
        <div />
        <div>Total</div>
        <div />
        <div>{formatMoney(r?.totalInterest ?? 0)}</div>
        <div>{formatMoney(loan.amount)}</div>
        <div>{formatMoney(r?.totalRepayable ?? 0)}</div>
        <div>{formatMoney(r?.totalPaid ?? 0)}</div>
        <div />
        {!readOnly && <div />}
      </TableFooter>
    </Table>
  );
}

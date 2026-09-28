import { recordPayment } from "@/app/actions/loans";
import { Table } from "@/components/ui/Table";
import { TableFooter } from "@/components/ui/TableFooter";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import type { ILoanDetail } from "@/interface/loan.interface";
import { toISODate } from "@/lib/dates";
import { formatDate, formatMoney } from "@/lib/format";
import { installmentRows } from "@/lib/loan-detail";
import { InstallmentStatusBadge } from "./InstallmentStatusBadge";
import { PaymentList } from "./PaymentList";
import { RecordPaymentDialog } from "./RecordPaymentDialog";

export type RepaymentScheduleProps = {
  loan: ILoanDetail;
  /** Customer view: no record/remove actions and no action column. */
  readOnly?: boolean;
};

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** Monthly installments with their status, payments and (for admins) the record-payment action. */
export function RepaymentSchedule({ loan, readOnly = false }: RepaymentScheduleProps) {
  const rows = installmentRows(loan);
  const canRemove = !readOnly && (loan.status === "Approved" || loan.status === "Completed");

  return (
    <Table layout={readOnly ? "schedule-readonly" : "schedule"}>
      <TableHead>
        <div>#</div>
        <div>Due date</div>
        <div>Principal</div>
        <div>Interest</div>
        <div>Installment</div>
        <div>Status</div>
        {!readOnly && <div />}
      </TableHead>

      {rows.map(({ installment: i, display, detail, canRecord }) => {
        const due = formatDate(toISODate(i.dueDate));
        return (
          <TableRow key={i.number} density="compact" tone={display === "overdue" ? "danger" : "default"} className="tabular-nums">
            <div className="text-muted">{i.number}</div>
            <div className="text-13">{due}</div>
            <div>{formatMoney(i.principal)}</div>
            <div>{formatMoney(i.interest)}</div>
            <div className="font-semibold">{formatMoney(i.amountDue)}</div>
            <div className="flex flex-col items-start gap-0.5">
              <InstallmentStatusBadge status={display} />
              {detail && <span className="text-11 text-muted">{detail}</span>}
            </div>
            {!readOnly && (
              <div className="flex justify-end">
                {canRecord && (
                  <RecordPaymentDialog
                    loanId={loan.id}
                    installmentNumber={i.number}
                    dueLabel={due}
                    balance={i.balance}
                    recordAction={recordPayment}
                  />
                )}
              </div>
            )}
            {i.payments.length > 0 && (
              <PaymentList loanId={loan.id} installmentNumber={i.number} payments={i.payments} canRemove={canRemove} />
            )}
          </TableRow>
        );
      })}

      <TableFooter>
        <div />
        <div>Total</div>
        <div>{formatMoney(sum(loan.installments.map((i) => i.principal)))}</div>
        <div>{formatMoney(sum(loan.installments.map((i) => i.interest)))}</div>
        <div>{formatMoney(sum(loan.installments.map((i) => i.amountDue)))}</div>
        <div />
        {!readOnly && <div />}
      </TableFooter>
    </Table>
  );
}

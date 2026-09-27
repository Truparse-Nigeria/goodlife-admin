import { Table } from "@/components/ui/Table";
import { TableFooter } from "@/components/ui/TableFooter";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import { formatDate, formatMoney } from "@/lib/format";
import { installmentStatus, sumTotals } from "@/lib/loan-schedule";
import type { LoanAction } from "@/types/actions";
import type { Installment } from "@/types/repayment";
import { InstallmentStatusBadge } from "./InstallmentStatusBadge";
import { PaymentActionButton } from "./PaymentActionButton";

type LiveProps = {
  mode: "live";
  loanId: string;
  installments: Installment[];
  paidCount: number;
  /** Only an active loan can take a new payment. */
  canRecord: boolean;
  recordPaymentAction: LoanAction;
  undoPaymentAction: LoanAction;
};

type PreviewProps = {
  mode: "preview";
  installments: Installment[];
};

export type RepaymentScheduleProps = LiveProps | PreviewProps;

/**
 * live    — approved loan: status per installment, record/undo actions, totals
 * preview — estimated schedule while an admin is choosing a rate
 */
export function RepaymentSchedule(props: RepaymentScheduleProps) {
  const { mode, installments } = props;
  const live = mode === "live";

  return (
    <Table layout={live ? "schedule" : "schedule-preview"}>
      <TableHead>
        <div>#</div>
        <div>{live ? "Due date" : "Due date (est.)"}</div>
        <div>Principal</div>
        <div>Interest</div>
        <div>Installment</div>
        {live && <div>Status</div>}
        {live && <div />}
      </TableHead>

      {installments.map((inst, i) => {
        const status = live ? installmentStatus(inst, i, props.paidCount) : null;
        return (
          <TableRow
            key={inst.number}
            density={live ? "compact" : "dense"}
            tone={inst.overdue ? "danger" : "default"}
            className="tabular-nums"
          >
            <div className="text-muted">{inst.number}</div>
            <div className="text-13">{formatDate(inst.dueDate)}</div>
            <div>{formatMoney(inst.principal)}</div>
            <div>{formatMoney(inst.interest)}</div>
            <div className="font-semibold">{formatMoney(inst.total)}</div>
            {live && status && (
              <div className="flex flex-col items-start gap-0.5">
                <InstallmentStatusBadge status={status} />
                {inst.paidAt && <span className="text-11 text-muted">on {formatDate(inst.paidAt)}</span>}
              </div>
            )}
            {live && (
              <div className="flex justify-end">
                {props.canRecord && i === props.paidCount && (
                  <PaymentActionButton
                    kind="record"
                    loanId={props.loanId}
                    action={props.recordPaymentAction}
                    amountLabel={formatMoney(inst.total)}
                  />
                )}
                {i === props.paidCount - 1 && (
                  <PaymentActionButton
                    kind="undo"
                    loanId={props.loanId}
                    action={props.undoPaymentAction}
                    amountLabel={formatMoney(inst.total)}
                  />
                )}
              </div>
            )}
          </TableRow>
        );
      })}

      {live && (
        <TableFooter>
          <div />
          <div>Total</div>
          <div>{formatMoney(installments.reduce((a, i) => a + i.principal, 0))}</div>
          <div>{formatMoney(installments.reduce((a, i) => a + i.interest, 0))}</div>
          <div>{formatMoney(sumTotals(installments))}</div>
          <div />
          <div />
        </TableFooter>
      )}
    </Table>
  );
}

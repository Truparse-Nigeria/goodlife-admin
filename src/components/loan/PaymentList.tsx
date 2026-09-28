import { deletePayment } from "@/app/actions/loans";
import type { IPayment } from "@/interface/loan.interface";
import { toISODate } from "@/lib/dates";
import { formatDate, formatMoney } from "@/lib/format";
import { RemovePaymentButton } from "./RemovePaymentButton";

export type PaymentListProps = {
  loanId: string;
  installmentNumber: number;
  payments: IPayment[];
  /** Removal is only offered to admins while the loan still takes payments. */
  canRemove: boolean;
};

const day = (timestamp: string) => formatDate(toISODate(timestamp));

/** Expandable list of the payments recorded against one installment. */
export function PaymentList({ loanId, installmentNumber, payments, canRemove }: PaymentListProps) {
  return (
    <details className="col-span-full -mt-1 text-13">
      <summary className="cursor-pointer text-12 text-brand-strong">
        View {payments.length} payment{payments.length === 1 ? "" : "s"}
      </summary>
      <ul className="mt-2 flex flex-col divide-y divide-divider rounded-md border border-divider bg-surface-sunken">
        {payments.map((p) => {
          const when = day(p.paidAt);
          const recorded = [p.recordedBy && `by ${p.recordedBy}`, `on ${day(p.recordedAt)}`].filter(Boolean).join(" ");
          return (
            <li key={p.id} className="flex items-center gap-3 px-3.5 py-2.5">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div>
                  <span className="font-semibold tabular-nums">{formatMoney(p.amount)}</span>
                  <span className="text-muted">
                    {" "}
                    · {p.method} · paid {when}
                    {p.reference ? ` · Ref ${p.reference}` : ""}
                  </span>
                </div>
                {p.note && <div className="text-12 text-ink-soft">{p.note}</div>}
                <div className="text-12 text-muted">Recorded {recorded}</div>
              </div>
              {canRemove && (
                <RemovePaymentButton
                  loanId={loanId}
                  installmentNumber={installmentNumber}
                  paymentId={p.id}
                  description={`${formatMoney(p.amount)} ${p.method} on ${when}`}
                  deleteAction={deletePayment}
                />
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}

import type { IPayment } from "@/interface/loan.interface";
import { toISODate } from "@/lib/dates";
import { formatDate, formatMoney } from "@/lib/format";

export type PaymentListProps = {
  payments: IPayment[];
};

const day = (timestamp: string) => formatDate(toISODate(timestamp));

/** Expandable list of the payments recorded against one month. */
export function PaymentList({ payments }: PaymentListProps) {
  return (
    <details className="col-span-full -mt-1 text-13">
      <summary className="cursor-pointer text-12 text-brand-strong">
        View {payments.length} payment{payments.length === 1 ? "" : "s"}
      </summary>
      <ul className="mt-2 flex flex-col divide-y divide-divider rounded-md border border-divider bg-surface-sunken">
        {payments.map((p) => {
          const recorded = [p.recordedBy && `by ${p.recordedBy}`, `on ${day(p.recordedAt)}`].filter(Boolean).join(" ");
          return (
            <li key={p.id} className="flex flex-col gap-0.5 px-3.5 py-2.5">
              <div>
                <span className="font-semibold tabular-nums">{formatMoney(p.amount)}</span>
                <span className="text-muted">
                  {" "}
                  · {p.method} · paid {day(p.paidAt)}
                  {p.reference ? ` · Ref ${p.reference}` : ""}
                </span>
              </div>
              {p.note && <div className="text-12 text-ink-soft">{p.note}</div>}
              <div className="text-12 text-muted">Recorded {recorded}</div>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

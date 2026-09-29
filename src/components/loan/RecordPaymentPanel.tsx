"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { PAYMENT_METHODS, type ExcessChoice, type IInstallment, type PaymentMethod } from "@/interface/loan.interface";
import { toISODate, today } from "@/lib/dates";
import { formatDate, formatMoney } from "@/lib/format";
import type { RecordPaymentAction } from "@/types/actions";
import { useRecordPayment } from "./RecordPaymentProvider";

export type RecordPaymentPanelProps = {
  loanId: string;
  /** The open month the payment goes to. */
  month: IInstallment;
  /** The month after it, if any (for the carry-forward preview). */
  next: IInstallment | null;
  /** % of capital per month, for the reduce-capital preview. */
  ratePerMonth: number;
  recordAction: RecordPaymentAction;
};

const METHOD_OPTIONS = PAYMENT_METHODS.map((m) => ({ value: m, label: m }));

/** Naira to the kobo, so float noise never reads as an over/under payment. */
const toKobo = (naira: number) => Math.round(naira * 100);

function carryDescription(excess: number, next: IInstallment | null): string {
  if (!next) return "Credit toward the next month.";
  if (excess >= next.scheduled) {
    return `Fully covers month ${next.number} (${formatMoney(next.scheduled)}); the rest carries on.`;
  }
  return `Month ${next.number} amount due drops from ${formatMoney(next.scheduled)} to ${formatMoney(next.scheduled - excess)}.`;
}

function capitalDescription(excess: number, capital: number, rate: number): string {
  if (excess >= capital) return "Clears the remaining capital and closes the loan.";
  const left = capital - excess;
  return `Capital falls from ${formatMoney(capital)} to ${formatMoney(left)}. Monthly interest drops to ${formatMoney((left * rate) / 100)}.`;
}

/**
 * Inline form above the schedule for recording a payment against the open
 * month. Short payments part-pay the month; over-payments are carried to
 * next month or used to reduce capital, as the admin chooses.
 */
export function RecordPaymentPanel(props: RecordPaymentPanelProps) {
  const { open } = useRecordPayment();
  // Mounted only while open, so every opening starts with a fresh form.
  return open ? <PaymentForm {...props} /> : null;
}

function PaymentForm({ loanId, month, next, ratePerMonth, recordAction }: RecordPaymentPanelProps) {
  const { setOpen } = useRecordPayment();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLFormElement>(null);

  const [amount, setAmount] = useState(String(month.balance));
  const [excessChoice, setExcessChoice] = useState<ExcessChoice>("Carry forward");
  const [method, setMethod] = useState<PaymentMethod>("Transfer");
  const [paidAt, setPaidAt] = useState(today());
  const [reference, setReference] = useState("");

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const value = Number.parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
  const excess = (toKobo(value) - toKobo(month.balance)) / 100;
  const isFinal = month.principalDue > 0;
  const hasExcess = value > 0 && excess > 0 && !isFinal;
  const finalExcess = value > 0 && excess > 0 && isFinal;
  const isShort = value > 0 && excess < 0;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!(value > 0)) return toast("Enter the amount received");
    startTransition(async () => {
      const { error } = await recordAction(loanId, {
        amount: value,
        method,
        paidAt,
        reference: reference.trim() || undefined,
        excess: hasExcess ? excessChoice : undefined,
        period: month.number,
      });
      if (error) return toast(error);
      toast(`Payment of ${formatMoney(value)} recorded for month ${month.number}`);
      setOpen(false);
    });
  }

  return (
    <form
      ref={ref}
      onSubmit={submit}
      className="mx-5 mb-4.5 flex flex-col gap-3.5 rounded-lg border border-brand-border bg-brand-tint p-4.5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-15 font-semibold">Record payment · Month {month.number}</div>
        <div className="text-13 text-ink-soft">
          Amount due <strong className="font-semibold text-ink">{formatMoney(month.balance)}</strong> ·{" "}
          {formatDate(toISODate(month.dueDate))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Amount received (₦)" className="w-full max-w-70">
          <Input
            inputMode="decimal"
            required
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-16 font-semibold"
          />
        </Field>
        <Field label="Method" className="w-40">
          <Select options={METHOD_OPTIONS} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} />
        </Field>
        <Field label="Date paid" className="w-44">
          <Input type="date" required max={today()} value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
        </Field>
        <Field label="Reference (optional)" className="min-w-40 flex-1">
          <Input
            placeholder="Transfer ref, cheque no."
            maxLength={100}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </Field>
      </div>

      {hasExcess && (
        <div className="flex flex-col gap-2.5">
          <div className="text-13 text-ink">
            Overpayment of <strong className="font-semibold">{formatMoney(excess)}</strong>. How should it be applied?
          </div>
          <div role="radiogroup" aria-label="Apply the overpayment" className="grid gap-2.5 sm:grid-cols-2">
            <ChoiceCard
              title="Move to next month"
              description={carryDescription(excess, next)}
              selected={excessChoice === "Carry forward"}
              onSelect={() => setExcessChoice("Carry forward")}
            />
            <ChoiceCard
              title="Reduce capital"
              description={capitalDescription(excess, month.capital, ratePerMonth)}
              selected={excessChoice === "Reduce capital"}
              onSelect={() => setExcessChoice("Reduce capital")}
            />
          </div>
        </div>
      )}
      {isShort && (
        <p className="text-13 text-warning">
          Short by {formatMoney(-excess)}.{" "}
          {isFinal
            ? "If the capital isn’t fully repaid by the due date, what’s left rolls into a new month with interest."
            : "Whatever is still unpaid when the month ends is added to next month’s amount due as arrears."}
        </p>
      )}
      {finalExcess && (
        <p className="text-13 text-warning">
          This is the final payment. The extra {formatMoney(excess)} will be recorded as a refund due to the customer.
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="md" onClick={() => setOpen(false)} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Saving…" : "Confirm payment"}
        </Button>
      </div>
    </form>
  );
}

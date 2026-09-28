"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { CardFooter } from "@/components/ui/CardFooter";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/ToastProvider";
import { PAYMENT_METHODS, type PaymentMethod } from "@/interface/loan.interface";
import { today } from "@/lib/dates";
import { formatMoney } from "@/lib/format";
import type { RecordPaymentAction } from "@/types/actions";

export type RecordPaymentDialogProps = {
  loanId: string;
  installmentNumber: number;
  /** e.g. "1 Oct 2026" */
  dueLabel: string;
  /** What's still owed on the installment (naira). */
  balance: number;
  recordAction: RecordPaymentAction;
};

const METHOD_OPTIONS = PAYMENT_METHODS.map((m) => ({ value: m, label: m }));

/** "Record payment" button + modal form for one installment. */
export function RecordPaymentDialog({ loanId, installmentNumber, dueLabel, balance, recordAction }: RecordPaymentDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [amount, setAmount] = useState(balance.toFixed(2));
  const [method, setMethod] = useState<PaymentMethod>("Transfer");
  const [paidAt, setPaidAt] = useState(today());
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const value = Number.parseFloat(amount);
  const tooMuch = value > balance + 1e-9;
  const valid = value > 0 && !tooMuch;
  const remaining = valid ? balance - value : balance;

  function openDialog() {
    setAmount(balance.toFixed(2));
    setMethod("Transfer");
    setPaidAt(today());
    setOpen(true);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    startTransition(async () => {
      const { error } = await recordAction(loanId, installmentNumber, {
        amount: value,
        method,
        paidAt,
        reference: reference.trim() || undefined,
        note: note.trim() || undefined,
      });
      if (error) return toast(error);
      toast(`Payment of ${formatMoney(value)} recorded`);
      setReference("");
      setNote("");
      setOpen(false);
    });
  }

  return (
    <>
      <Button size="sm" onClick={openDialog}>
        Record payment
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Record payment"
        subtitle={`Installment ${installmentNumber} · due ${dueLabel} · ${formatMoney(balance)} outstanding`}
      >
        <form onSubmit={submit}>
          <div className="flex flex-col gap-4 px-6 pt-4 pb-5.5">
            <Field label="Amount (₦)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                max={balance}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-invalid={tooMuch}
              />
            </Field>
            <p className={tooMuch ? "-mt-2 text-12 text-danger" : "-mt-2 text-12 text-muted"}>
              {tooMuch
                ? `Can't be more than the ${formatMoney(balance)} outstanding.`
                : `Balance after this payment: ${formatMoney(Math.max(remaining, 0))}`}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Method">
                <Select
                  options={METHOD_OPTIONS}
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                />
              </Field>
              <Field label="Date paid">
                <Input type="date" required max={today()} value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
              </Field>
            </div>
            <Field label="Reference (optional)">
              <Input
                placeholder="Transfer ref, cheque no."
                maxLength={100}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </Field>
            <Field label="Note (optional)">
              <Textarea rows={2} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
          </div>
          <CardFooter>
            <Button variant="secondary" size="lg" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !valid}>
              {pending ? "Saving…" : "Save payment"}
            </Button>
          </CardFooter>
        </form>
      </Modal>
    </>
  );
}

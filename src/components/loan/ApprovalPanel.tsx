"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardFooter } from "@/components/ui/CardFooter";
import { CardHeader } from "@/components/ui/CardHeader";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Stat } from "@/components/ui/Stat";
import { useToast } from "@/components/ui/ToastProvider";
import { formatMoney } from "@/lib/format";
import { previewSchedule, sumTotals } from "@/lib/loan-schedule";
import type { ApproveLoanAction, RejectLoanAction } from "@/types/actions";
import { SchedulePreview } from "./SchedulePreview";

const MAX_RATE = 100;

export type ApprovalPanelProps = {
  loanId: string;
  amount: number;
  tenureMonths: number;
  approveAction: ApproveLoanAction;
  rejectAction: RejectLoanAction;
};

/** Pending loans: set a flat monthly rate, preview the schedule, then approve or reject. */
export function ApprovalPanel({ loanId, amount, tenureMonths, approveAction, rejectAction }: ApprovalPanelProps) {
  const { toast } = useToast();
  const [rateInput, setRateInput] = useState("");
  const [pending, startTransition] = useTransition();

  const rate = Number.parseFloat(rateInput);
  const valid = rate > 0 && rate <= MAX_RATE;
  const schedule = valid ? previewSchedule(amount, tenureMonths, rate) : [];
  const repayable = sumTotals(schedule);

  const stats = [
    { label: "Monthly installment", value: valid ? formatMoney(schedule[0].total) : "—" },
    { label: "Total interest", value: valid ? formatMoney(repayable - amount) : "—" },
    { label: "Total repayable", value: valid ? formatMoney(repayable) : "—" },
  ];

  function approve() {
    // Kept clickable while invalid (as in the design) so we can say why.
    if (!valid) return toast(`Enter an interest rate between 0 and ${MAX_RATE}% before approving`);
    startTransition(async () => {
      const { error } = await approveAction(loanId, rate);
      toast(error ?? `Loan approved at ${rate}% per month`);
    });
  }

  function reject() {
    startTransition(async () => {
      const { error } = await rejectAction(loanId);
      toast(error ?? "Loan rejected");
    });
  }

  return (
    <Card>
      <div className="flex flex-col gap-4.5 p-5">
        <CardHeader
          className="p-0"
          title="Review and approve"
          subtitle="Set the monthly interest rate to generate the repayment schedule before approving."
        />
        <div className="flex flex-wrap items-end gap-5">
          <Field label="Interest rate (% per month, flat)">
            <Input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              max={MAX_RATE}
              placeholder="e.g. 4.5"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              suffix="%"
              className="w-50 text-16 font-semibold"
            />
          </Field>
          {stats.map((s) => (
            <Stat key={s.label} variant="inline-sm" label={s.label} value={s.value} />
          ))}
        </div>
      </div>

      {valid && <SchedulePreview installments={schedule} />}

      <CardFooter>
        <Button variant="danger" onClick={reject} disabled={pending}>
          Reject
        </Button>
        <Button onClick={approve} disabled={pending} aria-disabled={!valid} className="px-5.5">
          Approve loan
        </Button>
      </CardFooter>
    </Card>
  );
}

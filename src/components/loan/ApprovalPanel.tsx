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
import { buildSchedule, sumTotals } from "@/lib/loan-schedule";
import type { ApproveLoanAction, LoanAction } from "@/types/actions";
import type { Loan } from "@/types/loan";
import { RepaymentSchedule } from "./RepaymentSchedule";

export type ApprovalPanelProps = {
  loan: Loan;
  approveAction: ApproveLoanAction;
  rejectAction: LoanAction;
};

/** Admin sets a monthly flat rate, previews the schedule, then approves or rejects. */
export function ApprovalPanel({ loan, approveAction, rejectAction }: ApprovalPanelProps) {
  const { toast } = useToast();
  const [rateInput, setRateInput] = useState("");
  const [pending, startTransition] = useTransition();

  const rate = Number.parseFloat(rateInput);
  const valid = rate > 0;
  const preview = valid ? buildSchedule(loan, rate) : [];
  const repayable = sumTotals(preview);

  const previewStats = [
    { label: "Monthly installment", value: valid ? formatMoney(preview[0].total) : "—" },
    { label: "Total interest", value: valid ? formatMoney(repayable - loan.amount) : "—" },
    { label: "Total repayable", value: valid ? formatMoney(repayable) : "—" },
  ];

  function approve() {
    // Kept clickable while invalid (matches the design) so we can explain why.
    if (!valid) return toast("Enter an interest rate before approving");
    startTransition(async () => {
      await approveAction(loan.id, rate);
      toast(`${loan.id} approved at ${rate}% per month`);
    });
  }

  function reject() {
    startTransition(async () => {
      await rejectAction(loan.id);
      toast(`${loan.id} rejected`);
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
              placeholder="e.g. 4.5"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              suffix="%"
              className="w-50 text-16 font-semibold"
            />
          </Field>
          {previewStats.map((s) => (
            <Stat key={s.label} variant="inline-sm" label={s.label} value={s.value} />
          ))}
        </div>
      </div>

      {valid && <RepaymentSchedule mode="preview" installments={preview} />}

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

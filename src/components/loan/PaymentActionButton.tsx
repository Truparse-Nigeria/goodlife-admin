"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import type { LoanAction } from "@/types/actions";

export type PaymentActionButtonProps = {
  kind: "record" | "undo";
  loanId: string;
  action: LoanAction;
  /** Formatted installment amount, used in the confirmation toast. */
  amountLabel: string;
};

export function PaymentActionButton({ kind, loanId, action, amountLabel }: PaymentActionButtonProps) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      await action(loanId);
      toast(kind === "record" ? `Payment of ${amountLabel} recorded` : "Last payment removed");
    });
  }

  return kind === "record" ? (
    <Button size="sm" onClick={run} disabled={pending}>
      Record payment
    </Button>
  ) : (
    <Button variant="ghost" onClick={run} disabled={pending}>
      Undo
    </Button>
  );
}

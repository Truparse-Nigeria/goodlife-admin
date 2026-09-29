"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import type { DeletePaymentAction } from "@/types/actions";

export type UndoPaymentButtonProps = {
  loanId: string;
  paymentId: string;
  /** e.g. "₦100,000 Transfer on 1 Jul 2026", used in the confirmation. */
  description: string;
  deleteAction: DeletePaymentAction;
};

/** Removes the loan's most recent payment (the only one that can be undone). */
export function UndoPaymentButton({ loanId, paymentId, description, deleteAction }: UndoPaymentButtonProps) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  function undo() {
    if (!window.confirm(`Remove the ${description} payment? The schedule will be worked out again without it.`)) return;
    startTransition(async () => {
      const { error } = await deleteAction(loanId, paymentId);
      toast(error ?? "Last payment removed");
    });
  }

  return (
    <Button variant="ghost" onClick={undo} disabled={pending}>
      Undo last
    </Button>
  );
}

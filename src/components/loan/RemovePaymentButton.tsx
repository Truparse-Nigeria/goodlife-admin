"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import type { DeletePaymentAction } from "@/types/actions";

export type RemovePaymentButtonProps = {
  loanId: string;
  installmentNumber: number;
  paymentId: string;
  /** e.g. "₦100,000 Transfer on 1 Jul 2026", used in the confirmation. */
  description: string;
  deleteAction: DeletePaymentAction;
};

export function RemovePaymentButton({ loanId, installmentNumber, paymentId, description, deleteAction }: RemovePaymentButtonProps) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  function remove() {
    if (!window.confirm(`Remove the ${description} payment? This can't be undone.`)) return;
    startTransition(async () => {
      const { error } = await deleteAction(loanId, installmentNumber, paymentId);
      toast(error ?? "Payment removed");
    });
  }

  return (
    <Button variant="ghost" onClick={remove} disabled={pending}>
      Remove
    </Button>
  );
}

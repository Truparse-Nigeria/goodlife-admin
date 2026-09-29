"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import type { GenerateLoanFormAction } from "@/types/actions";

export type GenerateLoanFormButtonProps = {
  loanId: string;
  generateAction: GenerateLoanFormAction;
};

/** For loans requested before forms were saved: build and save it now. */
export function GenerateLoanFormButton({ loanId, generateAction }: GenerateLoanFormButtonProps) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  function generate() {
    startTransition(async () => {
      const { error } = await generateAction(loanId);
      toast(error ?? "Loan form saved");
    });
  }

  return (
    <Button variant="soft" size="sm" onClick={generate} disabled={pending}>
      {pending ? "Generating…" : "Generate"}
    </Button>
  );
}

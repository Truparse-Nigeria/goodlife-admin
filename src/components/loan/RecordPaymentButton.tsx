"use client";

import { Button } from "@/components/ui/Button";
import { useRecordPayment } from "./RecordPaymentProvider";

/** Opens the record-payment panel; hidden while it's open (as in the design). */
export function RecordPaymentButton() {
  const { open, setOpen } = useRecordPayment();
  if (open) return null;
  return (
    <Button size="sm" onClick={() => setOpen(true)}>
      Record payment
    </Button>
  );
}

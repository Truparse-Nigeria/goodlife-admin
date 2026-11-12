"use client";

import { Button } from "@/components/ui/Button";
import { useRecordPayment } from "./RecordPaymentProvider";

export type RecordPaymentButtonProps = {
  /** The month this button records a payment for. */
  period: number;
};

/** Opens the record-payment panel for a month; hidden while a panel is open (as in the design). */
export function RecordPaymentButton({ period }: RecordPaymentButtonProps) {
  const { period: openPeriod, openFor } = useRecordPayment();
  if (openPeriod != null) return null;
  return (
    <Button size="sm" onClick={() => openFor(period)}>
      Record payment
    </Button>
  );
}

"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type RecordPaymentState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const RecordPaymentContext = createContext<RecordPaymentState | null>(null);

/**
 * Shares whether the record-payment panel is open between the schedule
 * row's button and the panel above the table.
 */
export function RecordPaymentProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <RecordPaymentContext value={value}>{children}</RecordPaymentContext>;
}

export function useRecordPayment(): RecordPaymentState {
  const state = useContext(RecordPaymentContext);
  if (!state) throw new Error("useRecordPayment must be used inside <RecordPaymentProvider>");
  return state;
}

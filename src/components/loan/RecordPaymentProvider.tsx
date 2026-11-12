"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type RecordPaymentState = {
  /** The month the panel is open for; null while it's closed. */
  period: number | null;
  openFor: (period: number) => void;
  close: () => void;
};

const RecordPaymentContext = createContext<RecordPaymentState | null>(null);

/**
 * Shares which month the record-payment panel is open for between the
 * schedule row's button and the panel above the table.
 */
export function RecordPaymentProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<number | null>(null);
  const value = useMemo(() => ({ period, openFor: setPeriod, close: () => setPeriod(null) }), [period]);
  return <RecordPaymentContext value={value}>{children}</RecordPaymentContext>;
}

export function useRecordPayment(): RecordPaymentState {
  const state = useContext(RecordPaymentContext);
  if (!state) throw new Error("useRecordPayment must be used inside <RecordPaymentProvider>");
  return state;
}

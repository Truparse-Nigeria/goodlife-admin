"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Toast } from "./Toast";

const TOAST_MS = 2800;

type ToastContextValue = { toast: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastProviderProps = {
  children: ReactNode;
};

/** One toast at a time; a new message replaces the current one. */
export function ToastProvider({ children }: ToastProviderProps) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((next: string) => {
    clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(null), TOAST_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message && <Toast message={message} />}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

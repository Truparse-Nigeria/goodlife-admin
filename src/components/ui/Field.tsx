import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FieldProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Label wrapper for a single form control. */
export function Field({ label, children, className }: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-13 text-ink-soft", className)}>
      {label}
      {children}
    </label>
  );
}

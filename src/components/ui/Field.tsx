import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FieldProps = {
  label: ReactNode;
  children: ReactNode;
  /** Adds a red asterisk after the label. */
  required?: boolean;
  /** Message shown under the control. */
  error?: string;
  className?: string;
};

/** Label wrapper for a single form control. */
export function Field({ label, children, required, error, className }: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-13 text-ink-soft", className)}>
      <span>
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-danger">
            *
          </span>
        )}
      </span>
      {children}
      {error && <span className="text-12 text-danger">{error}</span>}
    </label>
  );
}

"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Line under the title. */
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Accessible modal on the native <dialog>: focus is trapped, Esc and the
 * backdrop close it, and the page behind is inert.
 */
export function Modal({ open, onClose, title, subtitle, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby={titleId}
      className={cn(
        "m-auto w-full max-w-auth rounded-xl border border-border bg-surface p-0 text-ink shadow-elevated backdrop:bg-ink/40",
        className,
      )}
    >
      <div className="px-6 pt-5.5 pb-1">
        <h2 id={titleId} className="text-18 font-semibold">
          {title}
        </h2>
        {subtitle != null && <p className="mt-1 text-13 text-muted">{subtitle}</p>}
      </div>
      {children}
    </dialog>
  );
}

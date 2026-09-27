import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TableHeadProps = {
  children: ReactNode;
  /**
   * `attached` — sits under a CardHeader (border top + bottom).
   * `standalone` — first thing in the card (border bottom only, taller).
   */
  placement?: "attached" | "standalone";
};

/** Header row. Each child becomes one column heading. */
export function TableHead({ children, placement = "attached" }: TableHeadProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-(--table-cols) gap-3 border-b border-border bg-surface-sunken px-5 text-12 text-muted",
        placement === "attached" ? "border-t py-2.5" : "py-3",
      )}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type OverlineProps = {
  children: ReactNode;
  tone?: "muted" | "subtle";
  className?: string;
};

/** Small uppercase section label. */
export function Overline({ children, tone = "muted", className }: OverlineProps) {
  return (
    <div
      className={cn(
        "text-11 tracking-overline uppercase",
        tone === "muted" ? "text-muted" : "text-subtle",
        className,
      )}
    >
      {children}
    </div>
  );
}

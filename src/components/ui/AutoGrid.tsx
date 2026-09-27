import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AutoGridProps = {
  /** Minimum tile width in spacing units (1 = 4px), e.g. 52.5 → 210px. */
  min: number;
  gap?: "md" | "lg";
  children: ReactNode;
  className?: string;
};

/** Responsive grid: as many columns as fit at `min` width, stretched evenly. */
export function AutoGrid({ min, gap = "md", children, className }: AutoGridProps) {
  const vars = { "--auto-min": `calc(var(--spacing) * ${min})` } as CSSProperties;
  return (
    <div style={vars} className={cn("grid grid-cols-auto-fit", gap === "md" ? "gap-4" : "gap-5", className)}>
      {children}
    </div>
  );
}

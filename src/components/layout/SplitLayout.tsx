import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * wide        — main grows twice as fast as the aside (dashboard: 600 / 300)
 * even        — main and aside grow equally (loan detail: 580 / 300)
 * roomy-aside — even growth with a wider aside (user detail: 560 / 320)
 * Columns wrap to a single stack when there isn't room for both.
 */
export type SplitLayoutProps = {
  main: ReactNode;
  aside: ReactNode;
  variant?: "wide" | "even" | "roomy-aside";
  gap?: "md" | "lg";
};

// Basis on the spacing scale (basis-150 = 600px); items shrink by default.
const MAIN = {
  wide: "grow-2 basis-150",
  even: "grow basis-145",
  "roomy-aside": "grow basis-140",
} as const;

const ASIDE = {
  wide: "grow basis-75",
  even: "grow basis-75",
  "roomy-aside": "grow basis-80",
} as const;

export function SplitLayout({ main, aside, variant = "even", gap = "lg" }: SplitLayoutProps) {
  return (
    <div className={cn("flex flex-wrap items-start", gap === "md" ? "gap-4" : "gap-5")}>
      <div className={cn("flex min-w-0 flex-col gap-5", MAIN[variant])}>{main}</div>
      <div className={cn("flex min-w-0 flex-col gap-5", ASIDE[variant])}>{aside}</div>
    </div>
  );
}

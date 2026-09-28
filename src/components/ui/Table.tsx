import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Column layouts defined as tokens in globals.css (--table-<layout>-cols / -min). */
export type TableLayout =
  | "loans"
  | "loans-compact"
  | "tracker"
  | "schedule"
  | "schedule-readonly"
  | "schedule-preview"
  | "users"
  | "team";

export type TableProps = {
  layout: TableLayout;
  children: ReactNode;
  className?: string;
};

/**
 * Grid-based table (matches the design's column layouts). Rows read the
 * column template from the --table-cols custom property set here, and the
 * table scrolls horizontally below --table-min.
 */
export function Table({ layout, children, className }: TableProps) {
  const vars = {
    "--table-cols": `var(--table-${layout}-cols)`,
    "--table-min": `var(--table-${layout}-min)`,
  } as CSSProperties;
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="min-w-(--table-min)" style={vars}>
        {children}
      </div>
    </div>
  );
}

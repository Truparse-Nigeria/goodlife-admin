import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

/**
 * card-lg  — dashboard KPI tile
 * card-md  — user-detail KPI tile
 * inline-md — metric inside a card (loan summary)
 * inline-sm — metric inside a form row (approval preview)
 */
export type StatVariant = "card-lg" | "card-md" | "inline-md" | "inline-sm";

const variants: Record<StatVariant, { card: boolean; root: string; label: string; value: string }> = {
  "card-lg": {
    card: true,
    root: "p-5 gap-2.5",
    label: "text-13",
    value: "text-26 tracking-stat",
  },
  "card-md": {
    card: true,
    root: "px-5 py-4.5 gap-2",
    label: "text-13",
    value: "text-22",
  },
  "inline-md": { card: false, root: "gap-1.5", label: "text-12", value: "text-19" },
  "inline-sm": { card: false, root: "gap-1.5 pb-1", label: "text-12", value: "text-18" },
};

export type StatProps = {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  noteTone?: "muted" | "danger";
  variant?: StatVariant;
  className?: string;
};

export function Stat({ label, value, note, noteTone = "muted", variant = "card-lg", className }: StatProps) {
  const v = variants[variant];
  const Root = v.card ? Card : "div";
  return (
    <Root className={cn("flex flex-col", v.root, className)}>
      <div className={cn("text-muted", v.label)}>{label}</div>
      <div className={cn("font-semibold tabular-nums", v.value)}>{value}</div>
      {note != null && <div className={cn("text-12", noteTone === "danger" ? "text-danger" : "text-muted")}>{note}</div>}
    </Root>
  );
}

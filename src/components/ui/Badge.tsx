import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "brand" | "warning" | "danger" | "success" | "neutral" | "muted" | "accent";
export type BadgeSize = "xs" | "sm" | "md" | "lg";

const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-soft text-brand-strong",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  success: "bg-success-soft text-success",
  neutral: "bg-neutral-soft text-neutral",
  muted: "bg-neutral-chip text-muted",
  accent: "bg-accent text-on-accent",
};

const sizes: Record<BadgeSize, string> = {
  xs: "px-2 py-0.5 text-11 font-semibold", // nav count
  sm: "px-2.5 py-0.75 text-12 font-medium", // schedule rows
  md: "px-2.5 py-1 text-12 font-medium", // tables
  lg: "px-3 py-1.25 text-12 font-medium", // page headers
};

export type BadgeProps = {
  tone?: BadgeTone;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
};

export function Badge({ tone = "neutral", size = "md", children, className }: BadgeProps) {
  return <span className={cn("inline-block rounded-full whitespace-nowrap", tones[tone], sizes[size], className)}>{children}</span>;
}

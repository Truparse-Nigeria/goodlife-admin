import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type CardPadding = "none" | "md" | "lg";

const paddings: Record<CardPadding, string> = {
  none: "",
  md: "px-5 py-4.5", // 18 × 20
  lg: "px-6 py-5.5", // 22 × 24
};

export type CardProps = ComponentProps<"section"> & {
  padding?: CardPadding;
};

export function Card({ padding = "none", className, ...props }: CardProps) {
  return (
    <section
      className={cn("min-w-0 overflow-hidden rounded-xl border border-border bg-surface", paddings[padding], className)}
      {...props}
    />
  );
}

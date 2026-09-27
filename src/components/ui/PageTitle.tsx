import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  lg: "text-26", // page headers
  md: "text-24", // user header
  sm: "text-22", // sign-in card, printable form, not-found
} as const;

export type PageTitleProps = {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
};

/** The page's single h1. */
export function PageTitle({ children, size = "lg", className }: PageTitleProps) {
  return <h1 className={cn("font-semibold", sizes[size], className)}>{children}</h1>;
}

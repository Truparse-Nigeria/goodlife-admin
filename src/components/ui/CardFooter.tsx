import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardFooterProps = {
  children: ReactNode;
  className?: string;
};

/** Sunken action bar at the bottom of a card. Actions align right. */
export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <footer className={cn("flex flex-wrap justify-end gap-2.5 border-t border-border bg-surface-sunken px-5 py-4", className)}>
      {children}
    </footer>
  );
}

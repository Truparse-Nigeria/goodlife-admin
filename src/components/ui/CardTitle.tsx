import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardTitleProps = {
  children: ReactNode;
  className?: string;
};

export function CardTitle({ children, className }: CardTitleProps) {
  return <h2 className={cn("text-16 font-semibold", className)}>{children}</h2>;
}

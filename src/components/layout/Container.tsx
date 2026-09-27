import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/** Centred page column inside the scrolling main area. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn("mx-auto max-w-page px-9 pt-8 pb-16", className)}>{children}</div>;
}

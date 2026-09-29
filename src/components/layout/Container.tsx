import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/** Centred page column inside the scrolling main area. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn("mx-auto max-w-page px-4 pt-5 pb-12 sm:px-6 sm:pt-6 lg:px-9 lg:pt-8 lg:pb-16", className)}>{children}</div>;
}

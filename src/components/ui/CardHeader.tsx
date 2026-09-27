import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CardTitle } from "./CardTitle";

export type CardHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  subtitleSize?: "sm" | "md";
  /** Draw a divider under the header (when no table header follows). */
  divider?: boolean;
  className?: string;
};

export function CardHeader({ title, subtitle, subtitleSize = "md", action, divider = false, className }: CardHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 px-5 py-4.5",
        divider && "border-b border-border",
        className,
      )}
    >
      <div className="min-w-0">
        <CardTitle>{title}</CardTitle>
        {subtitle != null && <p className={cn("mt-0.5 text-muted", subtitleSize === "sm" ? "text-12" : "text-13")}>{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

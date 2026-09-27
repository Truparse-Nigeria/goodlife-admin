import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { PageTitle } from "./PageTitle";

export type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned controls (search, primary action). */
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        <PageTitle>{title}</PageTitle>
        {subtitle != null && <p className="mt-1.5 text-14 text-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

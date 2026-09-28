import type { ReactNode } from "react";
import { CardTitle } from "@/components/ui/CardTitle";
import { cn } from "@/lib/cn";

export type LoanFormSectionProps = {
  title: string;
  /** Short note under the title. */
  hint?: ReactNode;
  /** Grid columns on wide screens. */
  columns?: 2 | 3;
  children: ReactNode;
};

/** A titled group of fields; sections after the first get a divider. */
export function LoanFormSection({ title, hint, columns = 2, children }: LoanFormSectionProps) {
  return (
    <section className="flex flex-col gap-4 border-divider not-first:border-t not-first:pt-6">
      <div>
        <CardTitle className="text-15">{title}</CardTitle>
        {hint != null && <p className="mt-1 text-13 text-muted">{hint}</p>}
      </div>
      <div className={cn("grid gap-4 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3")}>{children}</div>
    </section>
  );
}

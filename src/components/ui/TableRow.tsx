import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TableRowProps = {
  children: ReactNode;
  /** Makes the whole row a link. */
  href?: string;
  /** `danger` tints the row (overdue installment). */
  tone?: "default" | "danger";
  density?: "comfortable" | "compact" | "dense";
  className?: string;
};

const densities = {
  comfortable: "py-3.5", // list tables
  compact: "py-3", // schedule
  dense: "py-2.75", // schedule preview
} as const;

export function TableRow({ children, href, tone = "default", density = "comfortable", className }: TableRowProps) {
  const classes = cn(
    "grid grid-cols-(--table-cols) items-center gap-3 border-b border-divider px-5 text-14 text-ink",
    densities[density],
    tone === "danger" ? "bg-danger-tint" : "bg-surface",
    href && "no-underline transition-colors hover:bg-surface-sunken hover:text-ink",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <div className={classes}>
      {children}
    </div>
  );
}

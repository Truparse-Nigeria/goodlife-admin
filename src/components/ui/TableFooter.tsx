import type { ReactNode } from "react";

export type TableFooterProps = {
  children: ReactNode;
};

/** Totals row. Children map to columns like a TableRow. */
export function TableFooter({ children }: TableFooterProps) {
  return (
    <div
      className="grid grid-cols-(--table-cols) gap-3 bg-surface-sunken px-5 py-3.5 text-14 font-semibold tabular-nums"
    >
      {children}
    </div>
  );
}

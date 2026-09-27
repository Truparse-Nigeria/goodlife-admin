import type { ReactNode } from "react";

export type TableEmptyProps = {
  children: ReactNode;
};

export function TableEmpty({ children }: TableEmptyProps) {
  return <div className="p-10 text-center text-14 text-muted">{children}</div>;
}

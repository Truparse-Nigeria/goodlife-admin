import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { KeyValueRow } from "./KeyValueRow";

export type KeyValueItem = { label: string; value: ReactNode };

export type KeyValueListProps = {
  items: KeyValueItem[];
  className?: string;
};

/** Label / value rows, e.g. applicant details. */
export function KeyValueList({ items, className }: KeyValueListProps) {
  return (
    <dl className={cn("flex flex-col", className)}>
      {items.map((item) => (
        <KeyValueRow key={item.label} label={item.label} value={item.value} />
      ))}
    </dl>
  );
}

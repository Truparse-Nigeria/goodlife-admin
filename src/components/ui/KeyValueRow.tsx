import type { ReactNode } from "react";

export type KeyValueRowProps = {
  label: string;
  value: ReactNode;
};

export function KeyValueRow({ label, value }: KeyValueRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-divider py-2.25 text-13">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

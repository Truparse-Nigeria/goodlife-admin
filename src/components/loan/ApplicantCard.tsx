import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Identity } from "@/components/ui/Identity";
import { KeyValueList } from "@/components/ui/KeyValueList";
import type { KeyValueItem } from "@/types/common";

export type ApplicantCardProps = {
  name: string;
  items: KeyValueItem[];
  /** Optional header action, e.g. a "View user" link. */
  action?: ReactNode;
};

export function ApplicantCard({ name, items, action }: ApplicantCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-3 border-b border-divider px-5 py-4.5">
        <Identity name={name} detail="Applicant" size="card" className="flex-1" />
        {action}
      </div>
      <KeyValueList items={items} className="px-5 pt-1.5 pb-3.5" />
    </Card>
  );
}

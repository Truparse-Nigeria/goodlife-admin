import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import type { ISODate } from "@/types/common";

export type RejectedNoticeProps = {
  rejectedAt: ISODate | null;
};

export function RejectedNotice({ rejectedAt }: RejectedNoticeProps) {
  return (
    <Card className="flex flex-col gap-1.5 p-5">
      <div className="text-15 font-semibold">Application rejected on {formatDate(rejectedAt)}</div>
      <div className="text-14 text-muted">No repayment schedule was created for this loan.</div>
    </Card>
  );
}

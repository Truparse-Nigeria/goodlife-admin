import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { InstallmentStatus } from "@/types/repayment";

const STATUS: Record<InstallmentStatus, { label: string; tone: BadgeTone }> = {
  paid: { label: "Paid", tone: "success" },
  overdue: { label: "Overdue", tone: "danger" },
  "due-next": { label: "Due next", tone: "brand" },
  upcoming: { label: "Upcoming", tone: "muted" },
};

export type InstallmentStatusBadgeProps = {
  status: InstallmentStatus;
};

export function InstallmentStatusBadge({ status }: InstallmentStatusBadgeProps) {
  const { label, tone } = STATUS[status];
  return (
    <Badge tone={tone} size="sm">
      {label}
    </Badge>
  );
}

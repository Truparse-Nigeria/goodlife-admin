import { Badge, type BadgeSize, type BadgeTone } from "@/components/ui/Badge";
import type { DisplayStatus } from "@/types/loan";

const STATUS: Record<DisplayStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: "Pending", tone: "warning" },
  active: { label: "Active", tone: "brand" },
  overdue: { label: "Overdue", tone: "danger" },
  completed: { label: "Completed", tone: "success" },
  rejected: { label: "Rejected", tone: "neutral" },
};

export type LoanStatusBadgeProps = {
  status: DisplayStatus;
  size?: BadgeSize;
};

export function LoanStatusBadge({ status, size = "md" }: LoanStatusBadgeProps) {
  const { label, tone } = STATUS[status];
  return (
    <Badge tone={tone} size={size}>
      {label}
    </Badge>
  );
}

import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { InstallmentDisplay } from "@/lib/loan-detail";

const STATUS: Record<InstallmentDisplay, { label: string; tone: BadgeTone }> = {
  paid: { label: "Paid", tone: "success" },
  covered: { label: "Covered", tone: "success" },
  partial: { label: "Part paid", tone: "warning" },
  overdue: { label: "Overdue", tone: "danger" },
  "due-next": { label: "Due next", tone: "brand" },
  upcoming: { label: "Upcoming", tone: "muted" },
};

export type InstallmentStatusBadgeProps = {
  status: InstallmentDisplay;
};

export function InstallmentStatusBadge({ status }: InstallmentStatusBadgeProps) {
  const { label, tone } = STATUS[status];
  return (
    <Badge tone={tone} size="sm">
      {label}
    </Badge>
  );
}

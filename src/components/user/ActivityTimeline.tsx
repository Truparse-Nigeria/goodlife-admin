import { Card } from "@/components/ui/Card";
import { CardTitle } from "@/components/ui/CardTitle";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { ActivityEvent, ActivityKind } from "@/types/activity";

const DOT: Record<ActivityKind, string> = {
  joined: "bg-faint",
  applied: "bg-warning-dot",
  approved: "bg-brand",
  rejected: "bg-danger",
  repayment: "bg-success",
  completed: "bg-success",
};

export type ActivityTimelineProps = {
  events: ActivityEvent[];
};

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <Card padding="md">
      <CardTitle className="mb-3.5">Activity</CardTitle>
      <ol className="flex flex-col">
        {events.map((e, i) => (
          <li key={`${e.date}-${i}`} className="flex gap-3.5">
            <div aria-hidden className="flex flex-col items-center">
              <span className={cn("mt-1.25 size-2.5 shrink-0 rounded-full", DOT[e.kind])} />
              <span className="my-1 w-px flex-1 bg-border" />
            </div>
            <div className="min-w-0 pb-4">
              <div className="text-13 leading-normal">{e.text}</div>
              <div className="mt-0.5 text-12 text-muted">{formatDate(e.date)}</div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

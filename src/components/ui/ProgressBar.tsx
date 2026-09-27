import { cn } from "@/lib/cn";

export type ProgressBarProps = {
  /** 0–100 */
  value: number;
  size?: "sm" | "lg";
  label?: string;
  className?: string;
};

export function ProgressBar({ value, size = "sm", label, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
      className={cn("overflow-hidden rounded-full bg-track", size === "sm" ? "h-1.5" : "h-2.5", className)}
    >
      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
    </div>
  );
}

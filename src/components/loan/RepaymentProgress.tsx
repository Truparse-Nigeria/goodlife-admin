import { ProgressBar } from "@/components/ui/ProgressBar";

export type RepaymentProgressProps = {
  /** e.g. "3 of 6 paid · 50%" */
  label: string;
  percent: number;
};

/** Caption + thin bar, used in loan table cells. */
export function RepaymentProgress({ label, percent }: RepaymentProgressProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-12 text-muted">{label}</div>
      <ProgressBar value={percent} label={label} />
    </div>
  );
}

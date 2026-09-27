// Interactive, but no directive needed: its onChange prop means it is only
// ever rendered from client components (e.g. LoginForm).
import { cn } from "@/lib/cn";

export type SegmentedOption<T extends string> = { value: T; label: string };

export type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-track p-1", className)}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "cursor-pointer rounded-segment p-2.5 text-14 transition-colors",
              on ? "bg-surface font-semibold text-ink shadow-segment" : "font-medium text-muted hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

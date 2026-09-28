import { cn } from "@/lib/cn";

export type LoanFormStepperProps = {
  steps: readonly string[];
  /** 0-based. */
  current: number;
  /** Jump back to a finished step. Later steps open through "Continue". */
  onSelect: (step: number) => void;
};

export function LoanFormStepper({ steps, current, onSelect }: LoanFormStepperProps) {
  return (
    <ol className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-track p-1">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label}>
            <button
              type="button"
              disabled={!done}
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-segment p-2.5 text-13 transition-colors",
                active && "bg-surface font-semibold text-ink shadow-segment",
                done && "cursor-pointer bg-brand-soft font-medium text-brand-strong hover:bg-brand-soft-hover",
                !active && !done && "font-medium text-muted",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-11 font-semibold",
                  active || done ? "bg-brand text-on-brand" : "bg-surface text-muted",
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              {label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

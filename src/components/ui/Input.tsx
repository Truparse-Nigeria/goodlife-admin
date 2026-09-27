import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ControlSize = "sm" | "md";

/** Shared look for Input, Select and Textarea. */
export const controlClasses = "w-full rounded-md border border-border-input bg-surface text-14 text-ink placeholder:text-subtle";

export const controlSizes: Record<ControlSize, string> = {
  sm: "px-3.5 py-2.5",
  md: "px-3.5 py-3",
};

export type InputProps = Omit<ComponentProps<"input">, "size"> & {
  size?: ControlSize;
  /** Trailing adornment, e.g. "%". Renders the input inside a bordered group. */
  suffix?: ReactNode;
};

export function Input({ size = "md", suffix, className, ...props }: InputProps) {
  if (suffix == null) {
    return <input className={cn(controlClasses, controlSizes[size], className)} {...props} />;
  }
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-md border border-border-input bg-surface",
        "focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-brand",
        className,
      )}
    >
      <input
        className={cn("w-full min-w-0 border-0 bg-transparent text-ink outline-none focus:outline-none", controlSizes[size])}
        {...props}
      />
      <span className="px-3.5 text-15 font-normal text-muted">{suffix}</span>
    </div>
  );
}

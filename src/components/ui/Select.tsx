import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClasses, controlSizes, type ControlSize } from "./Input";

export type SelectOption = { value: string; label: string };

export type SelectProps = Omit<ComponentProps<"select">, "size"> & {
  options: SelectOption[];
  size?: ControlSize;
};

export function Select({ options, size = "md", className, ...props }: SelectProps) {
  return (
    <select className={cn(controlClasses, controlSizes[size], className)} {...props}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

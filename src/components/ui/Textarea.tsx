import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClasses, controlSizes } from "./Input";

export type TextareaProps = ComponentProps<"textarea">;

export function Textarea({ className, rows = 3, ...props }: TextareaProps) {
  return <textarea rows={rows} className={cn(controlClasses, controlSizes.md, "resize-y", className)} {...props} />;
}

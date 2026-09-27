import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { fileExtension } from "@/lib/format";

export type FileRowProps = {
  label: string;
  fileName: string;
  /** Tile text; defaults to the file's extension. */
  ext?: string;
  /** `highlight` marks generated files (e.g. the prefilled loan form). */
  tone?: "neutral" | "highlight";
  action?: ReactNode;
  className?: string;
};

export function FileRow({ label, fileName, ext, tone = "neutral", action, className }: FileRowProps) {
  return (
    <div className={cn("flex items-center gap-3 border-t border-divider px-5 py-2.75", className)}>
      <span
        aria-hidden
        className={cn(
          "flex size-9.5 shrink-0 items-center justify-center rounded-sm text-10 font-semibold",
          tone === "highlight" ? "bg-warning-soft text-warning" : "bg-neutral-chip text-ink-soft",
        )}
      >
        {ext ?? fileExtension(fileName)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-13 font-medium">{label}</div>
        <div className="truncate text-11 text-muted">{fileName}</div>
      </div>
      {action}
    </div>
  );
}

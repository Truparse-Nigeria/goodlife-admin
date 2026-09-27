import Link from "next/link";
import { cn } from "@/lib/cn";

export type FilterChipProps = {
  href: string;
  label: string;
  count?: number;
  active?: boolean;
};

/** Pill-shaped filter tab. URL-driven, so it works without client JS. */
export function FilterChip({ href, label, count, active = false }: FilterChipProps) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3.5 py-2 text-13 font-medium no-underline",
        active
          ? "border-ink bg-ink text-on-ink hover:text-on-ink"
          : "border-border bg-surface text-ink-soft hover:text-ink-soft",
      )}
    >
      {label}
      {count != null && <span className="text-11 opacity-75">{count}</span>}
    </Link>
  );
}

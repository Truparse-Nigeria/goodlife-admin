import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";

export type NavItemProps = {
  href: string;
  label: string;
  active: boolean;
  count?: number;
};

export function NavItem({ href, label, active, count }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-3 py-2.75 text-14 no-underline",
        active
          ? "bg-brand-soft font-semibold text-brand-strong hover:text-brand-strong"
          : "font-medium text-ink-soft hover:text-ink-soft",
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", active ? "bg-brand" : "bg-faint")} />
      <span className="flex-1">{label}</span>
      {count ? (
        <Badge tone="accent" size="xs">
          {count}
        </Badge>
      ) : null}
    </Link>
  );
}

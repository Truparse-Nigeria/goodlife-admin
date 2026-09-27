"use client";

import { usePathname } from "next/navigation";
import type { NavLink } from "@/data/navigation";
import { NavItem } from "./NavItem";

export type SidebarNavProps = {
  items: NavLink[];
  pendingCount: number;
};

/** Client-only so the active item can follow the pathname. Detail routes
 *  (/loans/L-1024, /users/u1) highlight their parent section. */
export function SidebarNav({ items, pendingCount }: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-0.5 px-3">
      {items.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
          count={item.showPendingCount ? pendingCount : undefined}
        />
      ))}
    </nav>
  );
}

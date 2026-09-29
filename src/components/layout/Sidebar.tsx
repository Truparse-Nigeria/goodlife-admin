"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Overline } from "@/components/ui/Overline";
import type { NavLink } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { MenuButton } from "./MenuButton";
import { SidebarNav } from "./SidebarNav";
import { SidebarUser } from "./SidebarUser";

export type SidebarProps = {
  portalLabel: string;
  items: NavLink[];
  user: { name: string; role: string };
  signOutAction: () => Promise<void>;
};

/**
 * Fixed column from `lg` up. Below that, a top bar with a menu button opens
 * the same sidebar as a drawer; following a link, Esc or the backdrop closes it.
 */
export function Sidebar({ portalLabel, items, user, signOutAction }: SidebarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function closeOnLink(e: MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-3 bg-brand-deep px-4 py-2.5 lg:hidden">
        <Logo size="sm" priority className="h-9" />
        <MenuButton open={open} controls="app-sidebar" onClick={() => setOpen((o) => !o)} />
      </header>

      {open && <div aria-hidden className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        id="app-sidebar"
        onClick={closeOnLink}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-sidebar shrink-0 flex-col border-r border-border bg-surface transition-transform",
          "lg:static lg:z-auto lg:translate-x-0 lg:transition-none",
          open ? "translate-x-0 shadow-elevated" : "-translate-x-full",
        )}
      >
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-center rounded-lg bg-brand-deep px-4 py-3.5">
            <Logo size="sm" priority />
          </div>
        </div>
        <Overline tone="subtle" className="px-6 pt-1.5 pb-2">
          {portalLabel}
        </Overline>
        <SidebarNav items={items} />
        <SidebarUser name={user.name} role={user.role} signOutAction={signOutAction} />
      </aside>
    </>
  );
}

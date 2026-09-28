import { Overline } from "@/components/ui/Overline";
import type { NavLink } from "@/data/navigation";
import { Logo } from "./Logo";
import { SidebarNav } from "./SidebarNav";
import { SidebarUser } from "./SidebarUser";

export type SidebarProps = {
  portalLabel: string;
  items: NavLink[];
  user: { name: string; role: string };
  signOutAction: () => Promise<void>;
};

export function Sidebar({ portalLabel, items, user, signOutAction }: SidebarProps) {
  return (
    <aside className="flex w-sidebar shrink-0 flex-col border-r border-border bg-surface">
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
  );
}

import { Button } from "@/components/ui/Button";
import { Identity } from "@/components/ui/Identity";

export type SidebarUserProps = {
  name: string;
  role: string;
  /** Server action that ends the session. */
  signOutAction: () => Promise<void>;
};

export function SidebarUser({ name, role, signOutAction }: SidebarUserProps) {
  return (
    <div className="flex items-center gap-2.5 border-t border-border p-4">
      <Identity name={name} detail={role} size="sidebar" className="flex-1" />
      <form action={signOutAction}>
        <Button type="submit" variant="secondary" size="xs" className="text-ink-soft hover:bg-canvas">
          Sign out
        </Button>
      </form>
    </div>
  );
}

import { signOut } from "@/app/actions/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Sidebar } from "@/components/layout/Sidebar";
import { customerNav } from "@/data/navigation";
import { requireRole } from "@/lib/session";

export default async function CustomerLayout({ children }: LayoutProps<"/">) {
  const { user } = await requireRole("User");

  return (
    <AppShell
      sidebar={
        <Sidebar
          portalLabel="Customer portal"
          items={customerNav}
          user={{ name: `${user.firstName} ${user.lastName}`, role: "Customer" }}
          signOutAction={signOut}
        />
      }
    >
      {children}
    </AppShell>
  );
}

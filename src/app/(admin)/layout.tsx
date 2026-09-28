import { signOut } from "@/app/actions/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Sidebar } from "@/components/layout/Sidebar";
import { adminNav } from "@/data/navigation";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  const { user } = await requireAdmin();

  return (
    <AppShell
      sidebar={
        <Sidebar
          portalLabel="Admin portal"
          items={adminNav}
          user={{ name: `${user.firstName} ${user.lastName}`, role: user.role }}
          signOutAction={signOut}
        />
      }
    >
      {children}
    </AppShell>
  );
}

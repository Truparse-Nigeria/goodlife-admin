import { signOut } from "@/app/actions/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Sidebar } from "@/components/layout/Sidebar";
import { adminNav } from "@/data/navigation";
import { getAdmin } from "@/lib/loan-store";
import { pendingCount } from "@/lib/loan-views";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  await requireAdmin();
  const admin = getAdmin();

  return (
    <AppShell
      sidebar={
        <Sidebar
          portalLabel="Admin portal"
          items={adminNav}
          pendingCount={pendingCount()}
          user={{ name: admin.name, role: `${admin.title} · Admin` }}
          signOutAction={signOut}
        />
      }
    >
      {children}
    </AppShell>
  );
}

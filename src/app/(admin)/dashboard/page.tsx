import type { Metadata } from "next";
import { getAllLoansApi, getLoanStatsApi } from "@/api/loan";
import { PendingApprovalList } from "@/components/loan/PendingApprovalList";
import { PortfolioStats } from "@/components/loan/PortfolioStats";
import { RepaymentTracker } from "@/components/loan/RepaymentTracker";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { greeting, today, weekday } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Dashboard · GoodLife Admin" };

/** Rows shown in each dashboard list; "View all loans" has the rest. */
const LIST_SIZE = 6;

export default async function DashboardPage() {
  const { user, token } = await requireAdmin();
  const date = today();

  const [stats, running, pending] = await Promise.all([
    getLoanStatsApi(token),
    // Approved = disbursed and not yet fully repaid (completion flips it to Completed).
    getAllLoansApi(token, { status: "Approved", limit: LIST_SIZE }),
    getAllLoansApi(token, { status: "Pending", limit: LIST_SIZE }),
  ]);
  redirectIfUnauthorized(stats.error ?? running.error ?? pending.error);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting()}, ${user.firstName}`}
        subtitle={`${weekday(date)}, ${formatDate(date)} · Portfolio overview`}
      />
      {stats.data ? (
        <PortfolioStats stats={stats.data} />
      ) : (
        <Card>
          <TableEmpty>Couldn’t load portfolio stats: {stats.error?.message}</TableEmpty>
        </Card>
      )}
      <SplitLayout
        variant="wide"
        gap="md"
        main={<RepaymentTracker loans={running.data ?? []} error={running.error?.message} />}
        aside={
          <PendingApprovalList
            loans={pending.data ?? []}
            total={pending.response?.meta?.total ?? 0}
            error={pending.error?.message}
          />
        }
      />
    </div>
  );
}

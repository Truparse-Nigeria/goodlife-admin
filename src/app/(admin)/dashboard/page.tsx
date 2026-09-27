import type { Metadata } from "next";
import { PendingApprovalList } from "@/components/loan/PendingApprovalList";
import { PortfolioStats } from "@/components/loan/PortfolioStats";
import { RepaymentTracker } from "@/components/loan/RepaymentTracker";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { greeting, today, weekday } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { getAdmin } from "@/lib/loan-store";
import { getLoanViews, portfolioStats } from "@/lib/loan-views";

export const metadata: Metadata = { title: "Dashboard · GoodLife Admin" };

export default function DashboardPage() {
  const views = getLoanViews();
  const date = today();
  const firstName = getAdmin().name.split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        subtitle={`${weekday(date)}, ${formatDate(date)} · Portfolio overview`}
      />
      <PortfolioStats stats={portfolioStats(views)} />
      <SplitLayout
        variant="wide"
        gap="md"
        main={<RepaymentTracker loans={views.filter((v) => v.loan.status === "active")} />}
        aside={<PendingApprovalList loans={views.filter((v) => v.loan.status === "pending")} />}
      />
    </div>
  );
}

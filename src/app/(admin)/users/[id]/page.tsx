import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoanTable } from "@/components/loan/LoanTable";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { ActivityTimeline } from "@/components/user/ActivityTimeline";
import { UserHeader } from "@/components/user/UserHeader";
import { UserProfilePanel } from "@/components/user/UserProfilePanel";
import { UserStats } from "@/components/user/UserStats";
import { buildActivity } from "@/lib/activity";
import { findCustomer } from "@/lib/loan-store";
import { getLoanViews, summarizeCustomer } from "@/lib/loan-views";

export async function generateMetadata({ params }: PageProps<"/users/[id]">): Promise<Metadata> {
  const customer = findCustomer((await params).id);
  return { title: `${customer?.name ?? "User"} · GoodLife Admin` };
}

export default async function UserDetailPage({ params }: PageProps<"/users/[id]">) {
  const customer = findCustomer((await params).id);
  if (!customer) notFound();
  const loans = getLoanViews().filter((v) => v.customer.id === customer.id);

  return (
    <div className="flex flex-col gap-5">
      <BackLink href="/users">All users</BackLink>
      <UserHeader customer={customer} />
      <UserStats summary={summarizeCustomer(customer, loans)} />
      <SplitLayout
        variant="roomy-aside"
        main={
          <>
            <Card>
              <CardHeader title="Loans" />
              <LoanTable loans={loans} variant="compact" emptyMessage="No loans yet." />
            </Card>
            <UserProfilePanel customer={customer} />
          </>
        }
        aside={<ActivityTimeline events={buildActivity(customer, loans)} />}
      />
    </div>
  );
}

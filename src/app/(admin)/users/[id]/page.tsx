import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserApi } from "@/api/user";
import { LoanTable } from "@/components/loan/LoanTable";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { ActivityTimeline } from "@/components/user/ActivityTimeline";
import { UserHeader } from "@/components/user/UserHeader";
import { UserProfilePanel } from "@/components/user/UserProfilePanel";
import { UserStats } from "@/components/user/UserStats";
import { toISODate } from "@/lib/dates";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";
import { activityEvents, fullName, profileRows, userLoanRows, userStats } from "@/lib/user-detail";

export const metadata: Metadata = { title: "User · GoodLife Admin" };

export default async function UserDetailPage({ params }: PageProps<"/users/[id]">) {
  const { token } = await requireAdmin();
  const { id } = await params;

  const { data: user, error } = await getUserApi(token, id);
  redirectIfUnauthorized(error);
  if (error?.status === 404) notFound();

  if (!user) {
    return (
      <div className="flex flex-col gap-5">
        <BackLink href="/users">All users</BackLink>
        <Card>
          <TableEmpty>Couldn’t load this user: {error?.message ?? "no data returned"}</TableEmpty>
        </Card>
      </div>
    );
  }

  const { profile } = user;

  return (
    <div className="flex flex-col gap-5">
      <BackLink href="/users">All users</BackLink>
      <UserHeader name={fullName(profile)} email={profile.email} joinedAt={toISODate(profile.joinedAt)} />
      <UserStats stats={userStats(user)} />
      <SplitLayout
        variant="roomy-aside"
        main={
          <>
            <Card>
              <CardHeader title="Loans" />
              <LoanTable loans={userLoanRows(user)} variant="compact" emptyMessage="No loans yet." />
            </Card>
            <UserProfilePanel rows={profileRows(user)} idUrl={profile.idUrl} signatureUrl={profile.signature} />
          </>
        }
        aside={<ActivityTimeline events={activityEvents(user)} />}
      />
    </div>
  );
}

import type { Metadata } from "next";
import { inviteTeamMember, removeTeamMember, resendTeamInvite } from "@/app/actions/team";
import { getTeamApi } from "@/api/team";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { InviteTeamMemberForm } from "@/components/user/InviteTeamMemberForm";
import { TeamTable } from "@/components/user/TeamTable";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Team · GoodLife Admin" };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default async function TeamPage() {
  const { token, user } = await requireAdmin();
  const { data: members = [], error } = await getTeamApi(token);
  redirectIfUnauthorized(error);

  const invited = members.filter((m) => m.status === "Invited").length;
  const subtitle = `${plural(members.length - invited, "member")} · ${plural(invited, "pending invite")}`;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Team" subtitle={error ? "Admins who can use this portal" : subtitle} />
      <InviteTeamMemberForm inviteAction={inviteTeamMember} />
      <Card>
        {error ? (
          <TableEmpty>Couldn’t load the team: {error.message}</TableEmpty>
        ) : (
          <TeamTable
            members={members}
            currentUserId={user.id}
            resendAction={resendTeamInvite}
            removeAction={removeTeamMember}
          />
        )}
      </Card>
    </div>
  );
}

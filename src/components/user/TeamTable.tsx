import { Badge } from "@/components/ui/Badge";
import { Identity } from "@/components/ui/Identity";
import { Table } from "@/components/ui/Table";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import { toISODate } from "@/lib/dates";
import { formatDate, formatShortDate } from "@/lib/format";
import type { ITeamMember } from "@/interface/team.interface";
import type { TeamMemberAction } from "@/types/actions";
import { TeamMemberActions } from "./TeamMemberActions";

export type TeamTableProps = {
  members: ITeamMember[];
  /** The signed-in admin, who can't remove themselves. Super admins can't be removed at all. */
  currentUserId: string;
  resendAction: TeamMemberAction;
  removeAction: TeamMemberAction;
};

export function TeamTable({ members, currentUserId, resendAction, removeAction }: TeamTableProps) {
  return (
    <Table layout="team">
      <TableHead placement="standalone">
        <div>Member</div>
        <div>Role</div>
        <div>Status</div>
        <div>Added</div>
        <div />
      </TableHead>
      {members.map((member) => {
        const name = `${member.firstName} ${member.lastName}`;
        const invited = member.status === "Invited";
        return (
          <TableRow key={member.id}>
            <Identity name={name} detail={member.email} tone={invited ? "neutral" : "brand"} />
            <div>{member.role}</div>
            <div>
              <Badge tone={invited ? "warning" : "success"}>{member.status}</Badge>
            </div>
            <div className="text-13 text-ink-soft">
              {invited && member.invitedAt
                ? `Invited ${formatShortDate(toISODate(member.invitedAt))}`
                : formatDate(toISODate(member.joinedAt))}
            </div>
            {member.id === currentUserId ? (
              <div className="text-right text-13 text-muted">You</div>
            ) : member.role === "Super Admin" ? (
              <div />
            ) : (
              <TeamMemberActions
                id={member.id}
                name={name}
                status={member.status}
                resendAction={resendAction}
                removeAction={removeAction}
              />
            )}
          </TableRow>
        );
      })}
      {members.length === 0 && <TableEmpty>No team members yet.</TableEmpty>}
    </Table>
  );
}

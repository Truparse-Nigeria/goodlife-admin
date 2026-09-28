/*
 * Team members as returned by goodlife-api /admin/team. Everyone on the team
 * is an admin; "Invited" means they haven't signed in and set a password yet.
 */

export type TeamMemberStatus = "Invited" | "Active";

export interface ITeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Super admins are granted on the server, never invited, and can't be removed here. */
  role: "Admin" | "Super Admin";
  status: TeamMemberStatus;
  /** ISO timestamp of the (latest) invite. */
  invitedAt: string | null;
  joinedAt: string;
}

/** POST /admin/team/invite */
export interface IInviteTeamMember {
  /** Full name, e.g. "Kelechi Eze". */
  name: string;
  email: string;
}

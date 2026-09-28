import type { IInviteTeamMember, ITeamMember } from "@/interface/team.interface";
import { authHeader, callApi, HttpMethod } from "./client";

const memberPath = (id: string) => `/admin/team/${encodeURIComponent(id)}`;

/** Admin: every team member, oldest first. */
export const getTeamApi = async (token: string) => {
  return await callApi<never, ITeamMember[]>("/admin/team", HttpMethod.GET, { headers: authHeader(token) });
};

/** Admin: invite a new admin; they get a sign-in link and temporary password by email. */
export const inviteTeamMemberApi = async (token: string, body: IInviteTeamMember) => {
  return await callApi<IInviteTeamMember, ITeamMember>("/admin/team/invite", HttpMethod.POST, {
    data: body,
    headers: authHeader(token),
  });
};

/** Admin: email a pending invitee a fresh temporary password. */
export const resendTeamInviteApi = async (token: string, id: string) => {
  return await callApi<never, ITeamMember>(`${memberPath(id)}/resend`, HttpMethod.POST, {
    headers: authHeader(token),
  });
};

/** Admin: revoke a pending invite or remove an admin. */
export const removeTeamMemberApi = async (token: string, id: string) => {
  return await callApi<never, never>(memberPath(id), HttpMethod.DELETE, { headers: authHeader(token) });
};

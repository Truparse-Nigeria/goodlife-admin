"use server";

import { revalidatePath } from "next/cache";
import { inviteTeamMemberApi, removeTeamMemberApi, resendTeamInviteApi } from "@/api/team";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";
import type { ActionResult } from "@/types/actions";
import type { ApiError } from "@/types/api";

/** Run an admin API call for the team, then refresh the team page. */
async function mutateTeam(call: (token: string) => Promise<{ error?: ApiError }>): Promise<ActionResult> {
  const { token } = await requireAdmin();
  const { error } = await call(token);
  redirectIfUnauthorized(error);
  if (error) return { error: error.message };

  revalidatePath("/team");
  return {};
}

export type InviteState = { error?: string; sentTo?: string } | null;

export async function inviteTeamMember(_prev: InviteState, formData: FormData): Promise<InviteState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (name.split(/\s+/).length < 2) return { error: "Enter a first and last name." };
  if (!email) return { error: "Enter an email address." };

  const { error } = await mutateTeam((token) => inviteTeamMemberApi(token, { name, email }));
  return error ? { error } : { sentTo: email };
}

export async function resendTeamInvite(id: string): Promise<ActionResult> {
  return mutateTeam((token) => resendTeamInviteApi(token, id));
}

export async function removeTeamMember(id: string): Promise<ActionResult> {
  return mutateTeam((token) => removeTeamMemberApi(token, id));
}

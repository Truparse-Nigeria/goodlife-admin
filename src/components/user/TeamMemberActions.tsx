"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import type { TeamMemberStatus } from "@/interface/team.interface";
import type { TeamMemberAction } from "@/types/actions";

export type TeamMemberActionsProps = {
  id: string;
  name: string;
  status: TeamMemberStatus;
  resendAction: TeamMemberAction;
  removeAction: TeamMemberAction;
};

/** Pending invites can be resent or revoked; active members removed. */
export function TeamMemberActions({ id, name, status, resendAction, removeAction }: TeamMemberActionsProps) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const invited = status === "Invited";

  function resend() {
    startTransition(async () => {
      const { error } = await resendAction(id);
      toast(error ?? `Invite resent to ${name}`);
    });
  }

  function remove() {
    const question = invited ? `Revoke ${name}’s invite?` : `Remove ${name} from the team? They’ll lose access immediately.`;
    if (!window.confirm(question)) return;
    startTransition(async () => {
      const { error } = await removeAction(id);
      toast(error ?? (invited ? "Invite revoked" : `${name} removed from the team`));
    });
  }

  return (
    <div className="flex justify-end gap-2">
      {invited && (
        <Button variant="secondary" size="sm" onClick={resend} disabled={pending}>
          Resend
        </Button>
      )}
      <Button variant="danger" size="sm" onClick={remove} disabled={pending}>
        {invited ? "Revoke" : "Remove"}
      </Button>
    </div>
  );
}

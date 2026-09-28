"use client";

import { useActionState } from "react";
import type { InviteState } from "@/app/actions/team";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

export type InviteTeamMemberFormProps = {
  inviteAction: (state: InviteState, formData: FormData) => Promise<InviteState>;
};

/** Everyone invited joins as an admin, so there's no role to pick. */
export function InviteTeamMemberForm({ inviteAction }: InviteTeamMemberFormProps) {
  const { toast } = useToast();
  const [state, formAction, pending] = useActionState(async (prev: InviteState, formData: FormData) => {
    const result = await inviteAction(prev, formData);
    if (result?.sentTo) toast(`Invite sent to ${result.sentTo}`);
    return result;
  }, null);

  return (
    <Card padding="lg">
      <CardHeader
        className="p-0"
        title="Invite a team member"
        subtitle="They’ll get an email with a link to sign in and set their own password."
      />
      <form action={formAction} className="mt-4.5 flex flex-wrap items-end gap-3">
        <Field label="Full name" className="min-w-50 flex-1">
          {/* key restores the typed value after a failed submit resets the form */}
          <Input key={`name-${state?.error}`} name="name" placeholder="e.g. Kelechi Eze" autoComplete="off" size="sm" required />
        </Field>
        <Field label="Email" className="min-w-60 flex-[1.5]">
          <Input name="email" type="email" placeholder="name@company.com" autoComplete="off" size="sm" required />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send invite"}
        </Button>
      </form>
      {state?.error && (
        <p role="alert" className="mt-3 text-13 text-danger">
          {state.error}
        </p>
      )}
      <p className="mt-3 text-13 text-muted">
        Everyone you invite joins as an Admin: they can review, approve and reject loans, record payments and manage the
        team.
      </p>
    </Card>
  );
}

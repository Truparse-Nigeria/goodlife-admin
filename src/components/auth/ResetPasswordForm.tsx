"use client";

import { useActionState } from "react";
import type { ResetPasswordState } from "@/app/actions/auth";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

export type ResetPasswordFormProps = {
  /** The token from the emailed link. */
  token: string;
  resetAction: (state: ResetPasswordState, formData: FormData) => Promise<ResetPasswordState>;
};

/** Sets a new password; on success the action redirects to sign in. */
export function ResetPasswordForm({ token, resetAction }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(resetAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <Field label="New password">
        <Input name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Field label="Confirm new password">
        <Input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      {state?.error && (
        <p role="alert" className="text-13 text-danger">
          {state.error}
        </p>
      )}
      <Button type="submit" size="xl" fullWidth disabled={pending}>
        {pending ? "Saving…" : "Reset password"}
      </Button>
      <BackLink href="/forgot-password">Request a new link</BackLink>
    </form>
  );
}

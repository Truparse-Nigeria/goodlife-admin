"use client";

import { useActionState } from "react";
import type { ForgotPasswordState } from "@/app/actions/auth";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

export type ForgotPasswordFormProps = {
  requestAction: (state: ForgotPasswordState, formData: FormData) => Promise<ForgotPasswordState>;
};

/** Asks for the account email and confirms once the reset link is on its way. */
export function ForgotPasswordForm({ requestAction }: ForgotPasswordFormProps) {
  const [state, formAction, pending] = useActionState(requestAction, null);

  if (state && "sent" in state) {
    return (
      <div className="flex flex-col gap-5">
        <p role="status" className="text-14 text-ink-soft">
          If an account exists for <strong>{state.email}</strong>, we’ve sent a link to reset your password. It
          expires in 15 minutes.
        </p>
        <BackLink href="/login">Back to sign in</BackLink>
      </div>
    );
  }

  const error = state && "error" in state ? state.error : null;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Email">
        {/* key re-applies the typed email after a submit resets the form */}
        <Input
          key={state?.email}
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state?.email}
        />
      </Field>
      {error && (
        <p role="alert" className="text-13 text-danger">
          {error}
        </p>
      )}
      <Button type="submit" size="xl" fullWidth disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
      <BackLink href="/login">Back to sign in</BackLink>
    </form>
  );
}

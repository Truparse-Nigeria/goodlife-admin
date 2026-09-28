"use client";

import { useActionState, useRef, useState } from "react";
import type { ChangePasswordState, SignInState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ChangePasswordModal } from "./ChangePasswordModal";

export type LoginFormProps = {
  signInAction: (state: SignInState, formData: FormData) => Promise<SignInState>;
  changePasswordAction: (state: ChangePasswordState, formData: FormData) => Promise<ChangePasswordState>;
};

/** One form for everyone; the account's role decides which view opens. */
export function LoginForm({ signInAction, changePasswordAction }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, null);
  // The form resets after submitting, so keep the typed password for the change-password step.
  const passwordRef = useRef<HTMLInputElement>(null);
  const [submittedPassword, setSubmittedPassword] = useState("");
  // Each sign-in returns a new state object, so a dismissed prompt reopens on the next attempt.
  const [dismissed, setDismissed] = useState<SignInState>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const modalOpen = state != null && "passwordChangeRequired" in state && state !== dismissed;

  function handleChanged() {
    setDismissed(state);
    setSubmittedPassword("");
    setNotice("Password changed. Sign in with your new password.");
  }

  const error = state && "error" in state ? state.error : null;

  return (
    <>
      <form
        action={formAction}
        onSubmit={() => {
          setNotice(null);
          setSubmittedPassword(passwordRef.current?.value ?? "");
        }}
        className="flex flex-col gap-5"
      >
        {notice && (
          <p role="status" className="text-13 text-success">
            {notice}
          </p>
        )}
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
        <Field label="Password">
          <Input ref={passwordRef} name="password" type="password" autoComplete="current-password" required />
        </Field>
        {error && (
          <p role="alert" className="text-13 text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="xl" fullWidth disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      {/* Remount per sign-in so a previous attempt's error doesn't linger. */}
      {modalOpen && (
        <ChangePasswordModal
          open
          currentPassword={submittedPassword}
          changeAction={changePasswordAction}
          onClose={() => setDismissed(state)}
          onChanged={handleChanged}
        />
      )}
    </>
  );
}

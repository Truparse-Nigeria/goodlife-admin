"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import type { ChangePasswordState, SignInState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ChangePasswordModal } from "./ChangePasswordModal";

export type LoginFormProps = {
  signInAction: (state: SignInState, formData: FormData) => Promise<SignInState>;
  changePasswordAction: (state: ChangePasswordState, formData: FormData) => Promise<ChangePasswordState>;
  /** Shown above the form on arrival, e.g. after a password reset. */
  initialNotice?: string | null;
};

/** One form for everyone; the account's role decides which view opens. */
export function LoginForm({ signInAction, changePasswordAction, initialNotice = null }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, null);
  // The form resets after submitting, so keep the typed password for the change-password step.
  const passwordRef = useRef<HTMLInputElement>(null);
  const [submittedPassword, setSubmittedPassword] = useState("");
  // Each sign-in returns a new state object, so a dismissed prompt reopens on the next attempt.
  const [dismissed, setDismissed] = useState<SignInState>(null);
  const [notice, setNotice] = useState<string | null>(initialNotice);
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
        <div className="flex flex-col gap-2">
          <Field label="Password">
            <Input ref={passwordRef} name="password" type="password" autoComplete="current-password" required />
          </Field>
          <Link
            href="/forgot-password"
            className="self-end text-13 text-brand-strong no-underline hover:text-brand-strong hover:underline"
          >
            Forgot password?
          </Link>
        </div>
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

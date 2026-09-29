"use client";

import { useActionState } from "react";
import type { ChangePasswordState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { CardFooter } from "@/components/ui/CardFooter";
import { Field } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Modal } from "@/components/ui/Modal";

export type ChangePasswordModalProps = {
  open: boolean;
  /** The temporary password the user just signed in with. */
  currentPassword: string;
  changeAction: (state: ChangePasswordState, formData: FormData) => Promise<ChangePasswordState>;
  onClose: () => void;
  /** Password replaced; the user now has to sign in with it. */
  onChanged: () => void;
};

/** Shown after signing in with a temporary password. */
export function ChangePasswordModal({ open, currentPassword, changeAction, onClose, onChanged }: ChangePasswordModalProps) {
  const [state, formAction, pending] = useActionState(async (prev: ChangePasswordState, formData: FormData) => {
    const result = await changeAction(prev, formData);
    if (result?.done) onChanged();
    return result;
  }, null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Set a new password"
      subtitle="You signed in with a temporary password. Choose a new one to continue."
    >
      <form action={formAction}>
        <input type="hidden" name="currentPassword" value={currentPassword} />
        <div className="flex flex-col gap-4 px-6 pt-4 pb-5.5">
          <Field label="New password">
            <PasswordInput name="newPassword" autoComplete="new-password" minLength={8} required />
          </Field>
          <Field label="Confirm new password">
            <PasswordInput name="confirmPassword" autoComplete="new-password" minLength={8} required />
          </Field>
          {state?.error && (
            <p role="alert" className="text-13 text-danger">
              {state.error}
            </p>
          )}
        </div>
        <CardFooter>
          <Button variant="secondary" size="lg" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Change password"}
          </Button>
        </CardFooter>
      </form>
    </Modal>
  );
}

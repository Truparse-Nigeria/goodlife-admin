"use client";

import { useActionState, useState } from "react";
import type { SignInState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type Role = "admin" | "customer";

const ROLES: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "customer", label: "Customer" },
];

export type LoginFormProps = {
  signInAction: (state: SignInState, formData: FormData) => Promise<SignInState>;
  adminEmail: string;
  customerEmail: string;
  defaultPassword: string;
};

export function LoginForm({ signInAction, adminEmail, customerEmail, defaultPassword }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, null);
  const [role, setRole] = useState<Role>("admin");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <SegmentedControl options={ROLES} value={role} onChange={setRole} aria-label="Sign in as" />
      <input type="hidden" name="role" value={role} />
      <Field label="Email">
        {/* key resets the prefilled email when the role changes */}
        <Input
          key={role}
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={role === "admin" ? adminEmail : customerEmail}
        />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" autoComplete="current-password" required defaultValue={defaultPassword} />
      </Field>
      {state?.error && (
        <p role="alert" className="text-13 text-danger">
          {state.error}
        </p>
      )}
      <Button type="submit" size="xl" fullWidth disabled={pending}>
        {pending ? "Signing in…" : `Sign in as ${role}`}
      </Button>
      <p className="text-center text-12 text-subtle">Demo credentials are prefilled.</p>
    </form>
  );
}

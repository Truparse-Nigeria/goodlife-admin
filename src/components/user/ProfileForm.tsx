"use client";

import { useState, useTransition, type FormEvent } from "react";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Identity } from "@/components/ui/Identity";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import type { Admin } from "@/types/user";

const FIELDS: { key: keyof Admin; label: string; type?: string }[] = [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "title", label: "Job title" },
];

export type ProfileFormProps = {
  profile: Admin;
  saveAction: (profile: Admin) => Promise<void>;
};

export function ProfileForm({ profile, saveAction }: ProfileFormProps) {
  const { toast } = useToast();
  const [values, setValues] = useState(profile);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveAction(values);
      toast("Profile saved");
    });
  }

  return (
    <Card padding="lg">
      <form onSubmit={onSubmit} className="flex flex-col gap-5.5">
        <Identity name={values.name || profile.name} detail={`${values.title} · Admin`} size="profile" />
        <AutoGrid min={60}>
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <Input
                name={f.key}
                type={f.type ?? "text"}
                required
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            </Field>
          ))}
        </AutoGrid>
        <div className="flex justify-end">
          <Button type="submit" disabled={pending} className="px-5">
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}

import type { ComponentProps } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { LoanFormBinding, LoanFormField } from "@/lib/create-loan-form";

export type LoanFormInputProps = Omit<ComponentProps<typeof Input>, "name" | "value" | "onChange" | "form"> & {
  form: LoanFormBinding;
  name: LoanFormField;
  label: string;
  className?: string;
};

/** A text input bound to one create-loan field. */
export function LoanFormInput({ form, name, label, required, className, ...props }: LoanFormInputProps) {
  const error = form.errors[name];
  return (
    <Field label={label} required={required} error={error} className={className}>
      <Input
        size="sm"
        name={name}
        value={form.values[name]}
        onChange={(e) => form.set(name, e.target.value)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </Field>
  );
}

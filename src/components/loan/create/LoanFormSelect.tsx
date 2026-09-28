import { Field } from "@/components/ui/Field";
import { Select, type SelectOption } from "@/components/ui/Select";
import type { LoanFormBinding, LoanFormField } from "@/lib/create-loan-form";

export type LoanFormSelectProps = {
  form: LoanFormBinding;
  name: LoanFormField;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
};

/** A select bound to one create-loan field, with an empty "Select" choice first. */
export function LoanFormSelect({
  form,
  name,
  label,
  options,
  placeholder = "Select",
  required,
  className,
}: LoanFormSelectProps) {
  const error = form.errors[name];
  return (
    <Field label={label} required={required} error={error} className={className}>
      <Select
        size="sm"
        name={name}
        value={form.values[name]}
        onChange={(e) => form.set(name, e.target.value)}
        aria-invalid={error ? true : undefined}
        options={[{ value: "", label: placeholder }, ...options]}
      />
    </Field>
  );
}

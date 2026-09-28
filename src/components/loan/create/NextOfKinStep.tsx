import type { SelectOption } from "@/components/ui/Select";
import { GENDER_OPTIONS, RELATIONSHIP_OPTIONS, TITLE_OPTIONS } from "@/data/loan-application";
import type { LoanFormBinding } from "@/lib/create-loan-form";
import { LoanFormInput } from "./LoanFormInput";
import { LoanFormSection } from "./LoanFormSection";
import { LoanFormSelect } from "./LoanFormSelect";

export type NextOfKinStepProps = {
  form: LoanFormBinding;
  states: SelectOption[];
};

export function NextOfKinStep({ form, states }: NextOfKinStepProps) {
  return (
    <LoanFormSection title="Next of kin" columns={3}>
      <LoanFormSelect form={form} name="kinTitle" label="Title" options={TITLE_OPTIONS} required />
      <LoanFormInput form={form} name="kinFirstName" label="First name" autoComplete="off" required />
      <LoanFormInput form={form} name="kinLastName" label="Last name" autoComplete="off" required />
      <LoanFormSelect form={form} name="kinRelationship" label="Relationship" options={RELATIONSHIP_OPTIONS} required />
      <LoanFormSelect form={form} name="kinGender" label="Gender" options={GENDER_OPTIONS} required />
      <LoanFormInput form={form} name="kinPhoneNumber" label="Phone number" inputMode="tel" autoComplete="off" required />
      <LoanFormInput form={form} name="kinEmail" label="Email" type="email" autoComplete="off" required />
      <LoanFormInput form={form} name="kinStreet" label="Address" autoComplete="off" className="lg:col-span-2" required />
      <LoanFormInput form={form} name="kinCity" label="City" autoComplete="off" required />
      <LoanFormSelect form={form} name="kinState" label="State" options={states} placeholder="Select state" required />
    </LoanFormSection>
  );
}

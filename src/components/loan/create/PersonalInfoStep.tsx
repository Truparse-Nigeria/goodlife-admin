import type { SelectOption } from "@/components/ui/Select";
import { GENDER_OPTIONS, TITLE_OPTIONS } from "@/data/loan-application";
import type { LoanFormBinding } from "@/lib/create-loan-form";
import { LoanFormInput } from "./LoanFormInput";
import { LoanFormSection } from "./LoanFormSection";
import { LoanFormSelect } from "./LoanFormSelect";

export type PersonalInfoStepProps = {
  form: LoanFormBinding;
  states: SelectOption[];
  /** Existing customer: their email identifies the account, so it's fixed. */
  emailLocked: boolean;
};

export function PersonalInfoStep({ form, states, emailLocked }: PersonalInfoStepProps) {
  return (
    <LoanFormSection title="Applicant">
      <LoanFormSelect form={form} name="title" label="Title" options={TITLE_OPTIONS} required />
      <LoanFormSelect form={form} name="gender" label="Gender" options={GENDER_OPTIONS} required />
      <LoanFormInput form={form} name="firstName" label="First name" autoComplete="off" required />
      <LoanFormInput form={form} name="lastName" label="Last name" autoComplete="off" required />
      <LoanFormInput form={form} name="dob" label="Date of birth" type="date" required />
      <LoanFormInput
        form={form}
        name="email"
        label="Email"
        type="email"
        autoComplete="off"
        readOnly={emailLocked}
        title={emailLocked ? "Choose “Change” above to apply for someone else" : undefined}
        className={emailLocked ? "opacity-70" : undefined}
        required
      />
      <LoanFormInput form={form} name="phoneNumber" label="Phone number" inputMode="tel" autoComplete="off" required />
      <LoanFormInput form={form} name="nin" label="NIN" inputMode="numeric" maxLength={11} autoComplete="off" required />
      <LoanFormInput form={form} name="street" label="Address" autoComplete="off" className="sm:col-span-2" required />
      <LoanFormInput form={form} name="landmark" label="Landmark" autoComplete="off" />
      <LoanFormInput form={form} name="city" label="City" autoComplete="off" required />
      <LoanFormSelect form={form} name="state" label="State" options={states} placeholder="Select state" required />
    </LoanFormSection>
  );
}

import { buttonClasses } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { SelectOption } from "@/components/ui/Select";
import {
  DURATION_OPTIONS,
  GUARANTOR_FORM_URL,
  PURPOSE_OPTIONS,
  REPAYMENT_OPTIONS,
  WORKING_STATUS_OPTIONS,
} from "@/data/loan-application";
import type { ApiLoanType } from "@/interface/loan.interface";
import type { LoanFormBinding } from "@/lib/create-loan-form";
import { LoanFormInput } from "./LoanFormInput";
import { LoanFormSection } from "./LoanFormSection";
import { LoanFormSelect } from "./LoanFormSelect";
import { LoanFormUpload } from "./LoanFormUpload";

export type LoanInfoStepProps = {
  form: LoanFormBinding;
  states: SelectOption[];
  industries: SelectOption[];
};

const TYPE_OPTIONS: { value: ApiLoanType; label: string }[] = [
  { value: "Personal", label: "Personal" },
  { value: "Business", label: "Business" },
];

const IMAGE = { accept: "image/png,image/jpeg", kinds: "image (PNG, JPEG, JPG)" };
const PDF = { accept: "application/pdf", kinds: "document (PDF)" };
const DOC = { accept: "application/pdf,image/png,image/jpeg", kinds: "document (PDF or image)" };

const guarantorTemplate = (
  <a
    href={GUARANTOR_FORM_URL}
    target="_blank"
    rel="noreferrer"
    className={buttonClasses({ variant: "secondary", size: "md" }, "relative z-10")}
  >
    Download form
  </a>
);

export function LoanInfoStep({ form, states, industries }: LoanInfoStepProps) {
  const { values } = form;
  const business = values.type === "Business";

  return (
    <>
      <LoanFormSection title="Apply as">
        <SegmentedControl
          aria-label="Loan type"
          options={TYPE_OPTIONS}
          value={values.type as ApiLoanType}
          onChange={(type) => form.set("type", type)}
          className="sm:col-span-2 sm:max-w-sm"
        />
      </LoanFormSection>

      {business ? (
        <LoanFormSection title="Business" columns={3}>
          <LoanFormInput form={form} name="businessName" label="Business name" autoComplete="off" required />
          <LoanFormInput form={form} name="cac" label="CAC number" autoComplete="off" required />
          <LoanFormSelect form={form} name="industry" label="Industry" options={industries} required />
          <LoanFormInput form={form} name="position" label="Applicant’s position" autoComplete="off" required />
          <LoanFormInput form={form} name="businessStreet" label="Business address" autoComplete="off" className="lg:col-span-2" required />
          <LoanFormInput form={form} name="businessCity" label="City" autoComplete="off" required />
          <LoanFormSelect form={form} name="businessState" label="State" options={states} placeholder="Select state" required />
          <LoanFormUpload form={form} name="certificateURL" label="CAC certificate" {...DOC} required />
          <LoanFormUpload form={form} name="memartURL" label="MEMART" {...DOC} required />
          <LoanFormUpload form={form} name="statusReportURL" label="Status report" {...DOC} required />
        </LoanFormSection>
      ) : (
        <LoanFormSection title="Employment">
          <LoanFormInput form={form} name="employerName" label="Employer name" autoComplete="off" required />
        </LoanFormSection>
      )}

      <LoanFormSection title="Loan" columns={3}>
        <LoanFormSelect form={form} name="workingStatus" label="Working status" options={WORKING_STATUS_OPTIONS} required />
        <LoanFormInput form={form} name="monthlyIncome" label="Monthly income (₦)" inputMode="numeric" autoComplete="off" required />
        <LoanFormInput form={form} name="amount" label="Amount requested (₦)" inputMode="numeric" autoComplete="off" required />
        <LoanFormSelect form={form} name="durationInMonths" label="Loan duration" options={DURATION_OPTIONS} required />
        <LoanFormSelect form={form} name="purpose" label="Loan purpose" options={PURPOSE_OPTIONS} required />
        <LoanFormSelect form={form} name="sourceOfRepayment" label="Source of repayment" options={REPAYMENT_OPTIONS} required />
        {values.purpose === "Other" && (
          <LoanFormInput form={form} name="otherPurpose" label="Other loan purpose" autoComplete="off" required />
        )}
        {values.sourceOfRepayment === "Other" && (
          <LoanFormInput form={form} name="otherSourceOfRepayment" label="Other source of repayment" autoComplete="off" required />
        )}
      </LoanFormSection>

      <LoanFormSection
        title="Guarantor’s forms"
        hint="Each guarantor fills in and signs the form, then upload the scanned copy."
      >
        <LoanFormUpload form={form} name="guarantorForm1" label="First guarantor’s form" {...DOC} aside={guarantorTemplate} required />
        <LoanFormUpload form={form} name="guarantorForm2" label="Second guarantor’s form" {...DOC} aside={guarantorTemplate} required />
      </LoanFormSection>

      <LoanFormSection title="Bank info & IDs" columns={3}>
        <LoanFormInput form={form} name="bvn" label="BVN" inputMode="numeric" maxLength={11} autoComplete="off" required />
        <LoanFormInput form={form} name="bankName" label="Bank name" autoComplete="off" required />
        <LoanFormInput form={form} name="accountNumber" label="Account number" inputMode="numeric" maxLength={10} autoComplete="off" required />
      </LoanFormSection>

      <LoanFormSection title="Documents">
        <LoanFormUpload
          form={form}
          name="idUrl"
          label="Valid ID (NIN slip, driver’s licence or international passport)"
          {...IMAGE}
          required
        />
        <LoanFormUpload form={form} name="signature" label="Signature" {...IMAGE} required />
        <LoanFormUpload form={form} name="statementOfAccount" label="Statement of account" {...PDF} required />
        <LoanFormUpload form={form} name="utilityBill" label="Utility bill (within the last 6 months)" {...IMAGE} required />
      </LoanFormSection>
    </>
  );
}

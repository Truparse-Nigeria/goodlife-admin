"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CardFooter } from "@/components/ui/CardFooter";
import type { SelectOption } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import {
  firstInvalidStep,
  LOAN_FORM_STEPS,
  toCreateLoanPayload,
  validateStep,
  type LoanFormBinding,
  type LoanFormErrors,
  type LoanFormValues,
} from "@/lib/create-loan-form";
import type { CreateLoanAction } from "@/types/actions";
import { LoanFormStepper } from "./LoanFormStepper";
import { LoanInfoStep } from "./LoanInfoStep";
import { NextOfKinStep } from "./NextOfKinStep";
import { PersonalInfoStep } from "./PersonalInfoStep";

export type CreateLoanFormProps = {
  initialValues: LoanFormValues;
  /** True when applying for an existing customer. */
  existingCustomer: boolean;
  states: SelectOption[];
  industries: SelectOption[];
  createAction: CreateLoanAction;
};

const LAST_STEP = LOAN_FORM_STEPS.length - 1;

export function CreateLoanForm({ initialValues, existingCustomer, states, industries, createAction }: CreateLoanFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<LoanFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const top = useRef<HTMLFormElement>(null);

  const form: LoanFormBinding = {
    values,
    errors,
    set: (field, value) => {
      setValues((v) => ({ ...v, [field]: value }));
      // Clear a field's error as soon as it's edited.
      if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    },
  };

  function goTo(next: number) {
    setStep(next);
    setErrors({});
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /** Stay on the step (and show why) if it has problems. */
  function checkStep(): boolean {
    const found = validateStep(step, values);
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!checkStep()) return;
    if (step < LAST_STEP) return goTo(step + 1);

    const invalid = firstInvalidStep(values);
    if (invalid !== -1) {
      goTo(invalid);
      setErrors(validateStep(invalid, values));
      return;
    }

    setSubmitError(null);
    startTransition(async () => {
      const result = await createAction(toCreateLoanPayload(values));
      if ("error" in result) {
        setSubmitError(result.error);
        return;
      }
      toast(result.message);
      router.push(`/loans/${result.loanId}`);
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="scroll-mt-6" ref={top}>
      <Card>
        <div className="border-b border-border px-5 py-4.5">
          <LoanFormStepper steps={LOAN_FORM_STEPS} current={step} onSelect={goTo} />
        </div>

        <div className="flex flex-col gap-6 px-5 py-5.5">
          {step === 0 && <PersonalInfoStep form={form} states={states} emailLocked={existingCustomer} />}
          {step === 1 && <NextOfKinStep form={form} states={states} />}
          {step === 2 && <LoanInfoStep form={form} states={states} industries={industries} />}

          {Object.values(errors).some(Boolean) && (
            <p role="alert" className="text-13 text-danger">
              Fix the highlighted fields to continue.
            </p>
          )}
          {submitError && (
            <p role="alert" className="rounded-md bg-danger-soft px-3.5 py-2.5 text-13 text-danger">
              {submitError}
            </p>
          )}
        </div>

        <CardFooter className="justify-between">
          <Button variant="secondary" disabled={step === 0 || pending} onClick={() => goTo(step - 1)}>
            Back
          </Button>
          <Button type="submit" disabled={pending}>
            {step < LAST_STEP ? "Continue" : pending ? "Submitting…" : "Submit application"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

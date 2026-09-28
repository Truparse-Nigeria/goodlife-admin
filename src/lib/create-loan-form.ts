import type { ApiLoanType, EmploymentStatus, ICreateLoan } from "@/interface/loan.interface";
import type { Gender, IUserProfile, NextOfKinRelationship, Title } from "@/interface/user.interface";

/*
 * The create-loan stepper's state: one flat record of strings (what inputs
 * hold), checked a step at a time, then shaped into goodlife-api's
 * first-application body on submit.
 */

const PERSONAL_FIELDS = [
  "title",
  "gender",
  "firstName",
  "lastName",
  "dob",
  "email",
  "phoneNumber",
  "nin",
  "street",
  "landmark",
  "city",
  "state",
] as const;

const KIN_FIELDS = [
  "kinTitle",
  "kinFirstName",
  "kinLastName",
  "kinRelationship",
  "kinGender",
  "kinPhoneNumber",
  "kinEmail",
  "kinStreet",
  "kinCity",
  "kinState",
] as const;

const LOAN_FIELDS = [
  "type",
  "employerName",
  "workingStatus",
  "monthlyIncome",
  "amount",
  "durationInMonths",
  "purpose",
  "otherPurpose",
  "sourceOfRepayment",
  "otherSourceOfRepayment",
  "guarantorForm1",
  "guarantorForm2",
  "bvn",
  "bankName",
  "accountNumber",
  "idUrl",
  "signature",
  "statementOfAccount",
  "utilityBill",
  "businessName",
  "cac",
  "industry",
  "position",
  "businessStreet",
  "businessCity",
  "businessState",
  "memartURL",
  "certificateURL",
  "statusReportURL",
] as const;

export type LoanFormField = (typeof PERSONAL_FIELDS)[number] | (typeof KIN_FIELDS)[number] | (typeof LOAN_FIELDS)[number];
export type LoanFormValues = Record<LoanFormField, string>;
export type LoanFormErrors = Partial<Record<LoanFormField, string>>;

export const LOAN_FORM_STEPS = ["Personal info", "Next of kin", "Loan info"] as const;
const STEP_FIELDS: readonly (readonly LoanFormField[])[] = [PERSONAL_FIELDS, KIN_FIELDS, LOAN_FIELDS];

const ALL_FIELDS = STEP_FIELDS.flat();

/** Fields a business loan needs on top of the rest (and a personal loan skips). */
const BUSINESS_ONLY: LoanFormField[] = [
  "businessName",
  "cac",
  "industry",
  "position",
  "businessStreet",
  "businessCity",
  "businessState",
  "memartURL",
  "certificateURL",
  "statusReportURL",
];
const PERSONAL_ONLY: LoanFormField[] = ["employerName"];
const ALWAYS_OPTIONAL: LoanFormField[] = ["landmark", "otherPurpose", "otherSourceOfRepayment"];

const digits = (n: number) => new RegExp(`^\\d{${n}}$`);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 11 digits locally; saved profiles may hold +234 numbers.
const PHONE = { test: (v: string) => /^\+?\d{10,14}$/.test(v), message: "Enter a valid phone number" };

/** Format checks beyond "required", as the website and API apply them. */
const FORMATS: Partial<Record<LoanFormField, { test: (v: string) => boolean; message: string }>> = {
  email: { test: (v) => EMAIL.test(v), message: "Enter a valid email" },
  kinEmail: { test: (v) => EMAIL.test(v), message: "Enter a valid email" },
  phoneNumber: PHONE,
  kinPhoneNumber: PHONE,
  nin: { test: (v) => digits(11).test(v), message: "NIN must be 11 digits" },
  bvn: { test: (v) => digits(11).test(v), message: "BVN must be 11 digits" },
  accountNumber: { test: (v) => digits(10).test(v), message: "Account number must be 10 digits" },
  amount: { test: (v) => /^\d+$/.test(v) && Number(v) > 0, message: "Enter an amount in naira, digits only" },
  monthlyIncome: { test: (v) => /^\d+$/.test(v) && Number(v) > 0, message: "Enter an amount in naira, digits only" },
  dob: { test: (v) => new Date(v) < new Date(), message: "Date of birth must be in the past" },
};

function isRequired(field: LoanFormField, values: LoanFormValues): boolean {
  if (ALWAYS_OPTIONAL.includes(field)) {
    if (field === "otherPurpose") return values.purpose === "Other";
    if (field === "otherSourceOfRepayment") return values.sourceOfRepayment === "Other";
    return false;
  }
  if (BUSINESS_ONLY.includes(field)) return values.type === "Business";
  if (PERSONAL_ONLY.includes(field)) return values.type === "Personal";
  return true;
}

/** Errors for one step (0-based); empty when it can move on. */
export function validateStep(step: number, values: LoanFormValues): LoanFormErrors {
  const errors: LoanFormErrors = {};
  for (const field of STEP_FIELDS[step] ?? []) {
    const value = values[field].trim();
    if (!value) {
      if (isRequired(field, values)) errors[field] = "Required";
      continue;
    }
    const format = FORMATS[field];
    if (format && !format.test(value)) errors[field] = format.message;
  }
  return errors;
}

/** First step with a problem, or -1. */
export function firstInvalidStep(values: LoanFormValues): number {
  return STEP_FIELDS.findIndex((_, step) => Object.keys(validateStep(step, values)).length > 0);
}

const EMPTY = Object.fromEntries(ALL_FIELDS.map((f) => [f, ""])) as LoanFormValues;

/** Blank form, or one filled from an existing customer's profile. */
export function initialLoanFormValues(profile?: IUserProfile | null): LoanFormValues {
  const values: LoanFormValues = { ...EMPTY, type: "Personal" };
  if (!profile) return values;

  const kin = profile.nextOfKin;
  return {
    ...values,
    title: profile.title ?? "",
    gender: profile.gender ?? "",
    firstName: profile.firstName,
    lastName: profile.lastName,
    dob: profile.dob ? profile.dob.slice(0, 10) : "",
    email: profile.email,
    phoneNumber: profile.phoneNumber ?? "",
    nin: profile.nin ?? "",
    street: profile.address?.street ?? "",
    landmark: profile.address?.landmark ?? "",
    city: profile.address?.city ?? "",
    state: profile.address?.state ?? "",
    kinTitle: kin?.title ?? "",
    kinFirstName: kin?.firstName ?? "",
    kinLastName: kin?.lastName ?? "",
    kinRelationship: kin?.relationship ?? "",
    kinGender: kin?.gender ?? "",
    kinPhoneNumber: kin?.phoneNumber ?? "",
    kinEmail: kin?.email ?? "",
    kinStreet: kin?.address?.street ?? "",
    kinCity: kin?.address?.city ?? "",
    kinState: kin?.address?.state ?? "",
    employerName: profile.employerName && profile.employerName !== "NIL" ? profile.employerName : "",
    bvn: profile.bvn ?? "",
    bankName: profile.bankDetails?.bankName ?? "",
    accountNumber: profile.bankDetails?.accountNumber ?? "",
    idUrl: profile.idUrl ?? "",
    signature: profile.signature ?? "",
  };
}

/** The validated form → POST /admin/loans body. */
export function toCreateLoanPayload(values: LoanFormValues): ICreateLoan {
  const v = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, val.trim()])) as LoanFormValues;
  const business = v.type === "Business";

  return {
    user: {
      title: v.title as Title,
      firstName: v.firstName,
      lastName: v.lastName,
      gender: v.gender as Gender,
      dob: v.dob,
      phoneNumber: v.phoneNumber,
      email: v.email.toLowerCase(),
      address: { street: v.street, landmark: v.landmark || undefined, city: v.city, state: v.state },
      nextOfKin: {
        title: v.kinTitle as Title,
        firstName: v.kinFirstName,
        lastName: v.kinLastName,
        relationship: v.kinRelationship as NextOfKinRelationship,
        gender: v.kinGender as Gender,
        phoneNumber: v.kinPhoneNumber,
        email: v.kinEmail,
        address: { street: v.kinStreet, city: v.kinCity, state: v.kinState },
      },
      // The website sends "NIL" for business applicants, who have no employer field.
      employerName: business ? "NIL" : v.employerName,
      nin: v.nin,
      bvn: v.bvn,
      bankDetails: { bankName: v.bankName, accountNumber: v.accountNumber },
      id_url: v.idUrl,
      signature: v.signature,
    },
    loan: {
      type: v.type as ApiLoanType,
      amount: Number(v.amount),
      durationInMonths: v.durationInMonths,
      purpose: v.purpose,
      ...(v.purpose === "Other" && { otherPurpose: v.otherPurpose }),
      sourceOfRepayment: v.sourceOfRepayment,
      ...(v.sourceOfRepayment === "Other" && { otherSourceOfRepayment: v.otherSourceOfRepayment }),
      workingStatus: v.workingStatus as EmploymentStatus,
      monthlyIncome: Number(v.monthlyIncome),
      ...(business && { positionOfUserInBusiness: v.position }),
      guarantorForm1: v.guarantorForm1,
      guarantorForm2: v.guarantorForm2,
      statementOfAccount: v.statementOfAccount,
      utilityBill: v.utilityBill,
    },
    ...(business && {
      business: {
        businessName: v.businessName,
        CAC: v.cac,
        industry: v.industry,
        address: { street: v.businessStreet, city: v.businessCity, state: v.businessState },
        memartURL: v.memartURL,
        certificateURL: v.certificateURL,
        statusReportURL: v.statusReportURL,
      },
    }),
  };
}

/** What each step's controls need: current values, their errors and a setter. */
export type LoanFormBinding = {
  values: LoanFormValues;
  errors: LoanFormErrors;
  set: (field: LoanFormField, value: string) => void;
};

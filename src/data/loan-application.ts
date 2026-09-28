import type { SelectOption } from "@/components/ui/Select";

/*
 * Choices on the create-loan form. Kept in step with the website's
 * application form (good-life-credit) and goodlife-api's enums.
 */

const toOptions = (values: readonly string[]): SelectOption[] => values.map((v) => ({ value: v, label: v }));

export const TITLE_OPTIONS = toOptions(["Mr", "Mrs", "Ms", "Dr", "Miss"]);
export const GENDER_OPTIONS = toOptions(["Male", "Female", "Other"]);
export const RELATIONSHIP_OPTIONS = toOptions(["Spouse", "Parent", "Sibling", "Friend", "Colleague", "Other"]);
export const WORKING_STATUS_OPTIONS = toOptions(["Employed", "Unemployed", "Self-employed", "Student", "Retired"]);

export const DURATION_OPTIONS: SelectOption[] = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} month${i ? "s" : ""}`,
}));

export const PURPOSE_OPTIONS = toOptions([
  "Personal Expenses",
  "Business Expansion",
  "Working Capital",
  "Inventory Purchase",
  "Equipment Purchase",
  "Salary Advance",
  "Education",
  "Medical Expenses",
  "Housing",
  "Emergency Expenses",
  "Agriculture",
  "Invoice Financing",
  "Trade Financing",
  "Real Estate Investment",
  "Construction",
  "Technology",
  "Insurance Premium Payment",
  "Tax Payment",
  "Other",
]);

export const REPAYMENT_OPTIONS = toOptions([
  "Salary",
  "Business Income",
  "Self-Employment Income",
  "Daily Sales",
  "Trading",
  "Freelance Income",
  "Commission Income",
  "Agriculture",
  "Rental Income",
  "Contract Payments",
  "Pension",
  "Investments",
  "Transport Business Income",
  "Remittance",
  "Cooperative Contributions",
  "Cash Flow from Operations",
  "Invoice Payments",
  "Other",
]);

/** Blank template the applicant's guarantors fill in and sign (same file as the website). */
export const GUARANTOR_FORM_URL = "https://goodlifecreditng.com/docs/GLC%20Guarantor%20and%20Indemnity%20Form.pdf";

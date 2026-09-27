import type { Admin } from "@/types/user";
import { customers } from "./customers";

export const admin: Admin = {
  name: "Adaeze Okafor",
  email: "adaeze.okafor@credit.ng",
  phone: "0802 330 9187",
  title: "Loan Officer",
};

/** Prefilled on the sign-in form. Mock only — replaced by goodlife-api auth. */
export const demoCredentials = {
  email: admin.email,
  password: "password123",
  /** Shown when the Customer tab is picked, as in the design. */
  customerEmail: customers[0].email,
};

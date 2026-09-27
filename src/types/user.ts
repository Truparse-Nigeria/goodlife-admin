import type { ISODate } from "./common";

/** A borrower registered on the customer portal. */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bvn: string;
  employer: string;
  joinedAt: ISODate;
  /** Profile-level documents attached to every loan request. */
  idFile: string;
  signatureFile: string;
}

/** The signed-in loan officer. */
export interface Admin {
  name: string;
  email: string;
  phone: string;
  title: string;
}

/** A customer with their portfolio totals, for the users list and detail. */
export interface CustomerSummary {
  customer: Customer;
  loanCount: number;
  activeCount: number;
  /** Principal of approved loans. */
  borrowed: number;
  repaid: number;
  /** Balance across active loans. */
  outstanding: number;
}

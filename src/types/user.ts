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

/** One row of the users table. */
export interface UserRow {
  id: string;
  href: string;
  name: string;
  email: string;
  phone: string;
  loanCount: number;
  activeCount: number;
  outstanding: number;
  joinedAt: ISODate;
}

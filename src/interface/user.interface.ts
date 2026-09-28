/*
 * User as serialised by goodlife-api (models/user.model.ts, toJSON with virtuals).
 * Dates arrive as ISO strings. `password` and `__v` are stripped by the API.
 */

export type UserRole = "Admin" | "User";
export type Title = "Mr" | "Mrs" | "Ms" | "Dr" | "Miss";
export type Gender = "Male" | "Female" | "Other";
export type NextOfKinRelationship = "Spouse" | "Parent" | "Sibling" | "Friend" | "Colleague" | "Other";

export interface IAddress {
  street: string;
  landmark?: string;
  city: string;
  /** One of the API's NIGERIAN_STATES. */
  state: string;
}

export interface IPerson {
  title: Title;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  address: IAddress;
}

export interface INextOfKin extends IPerson {
  relationship: NextOfKinRelationship;
}

export interface IUser extends IPerson {
  _id: string;
  /** Mongoose virtual, same value as `_id`. */
  id: string;
  role: UserRole;
  /** True until the user replaces their temporary password. */
  requiresPasswordChange: boolean;
  isEmailVerified: boolean;
  dob: string;
  nextOfKin: INextOfKin;
  signature?: string;
  employerName: string;
  nin: string;
  bvn: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
  };
  /** Uploaded ID document URL. */
  id_url: string;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Admin users API ---------- */

import type { ActivityKind } from "@/types/activity";
import type { ApiLoanStatus, ApiLoanType, ILoanRepaymentProgress } from "./loan.interface";

/** Item of GET /admin/users (naira amounts, ISO dates). */
export interface IUserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  joinedAt: string;
  loanCount: number;
  /** Approved loans still being repaid. */
  activeCount: number;
  outstanding: number;
}

export interface IGetUsersParams {
  page?: number;
  limit?: number;
  /** Name, email or phone. */
  search?: string;
}

export interface IUserProfile {
  id: string;
  title: Title | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  gender: Gender | null;
  dob: string | null;
  address: IAddress | null;
  employerName: string | null;
  nin: string | null;
  bvn: string | null;
  bankDetails: { bankName: string; accountNumber: string } | null;
  nextOfKin: INextOfKin | null;
  /** Uploaded ID document URL. */
  idUrl: string | null;
  signature: string | null;
  isEmailVerified: boolean;
  requiresPasswordChange: boolean;
  joinedAt: string;
}

/** A customer's loan as listed on their detail page. */
export interface IUserLoan {
  id: string;
  type: ApiLoanType;
  status: ApiLoanStatus;
  amount: number;
  durationInMonths: number;
  interestPerMonth: number | null;
  createdAt: string;
  repayment: ILoanRepaymentProgress | null;
}

export interface IUserActivity {
  date: string;
  kind: ActivityKind;
  text: string;
  loanId: string | null;
}

/** GET /admin/users/:id */
export interface IUserDetail {
  profile: IUserProfile;
  stats: { loanCount: number; totalBorrowed: number; totalRepaid: number; outstanding: number };
  loans: IUserLoan[];
  activity: IUserActivity[];
}

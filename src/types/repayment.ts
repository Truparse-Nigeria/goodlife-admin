import type { ISODate } from "./common";

/** One month of a planned repayment schedule (before approval). Derived, never stored. */
export interface Installment {
  /** 1-based month number. */
  number: number;
  dueDate: ISODate;
  /** Capital outstanding that month; interest is charged on it. */
  capital: number;
  interest: number;
  /** Capital due that month: all of it in the final month, else 0. */
  principalDue: number;
  total: number;
}

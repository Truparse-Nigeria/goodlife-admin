import type { ReactNode } from "react";

/** Calendar date as "YYYY-MM-DD". Kept as a string to avoid timezone drift. */
export type ISODate = string;

/** A label / value row (KeyValueList, detail cards). */
export interface KeyValueItem {
  label: string;
  value: ReactNode;
}

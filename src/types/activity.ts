import type { ISODate } from "./common";

/** Drives the timeline dot colour; the colour itself lives in the component. */
export type ActivityKind = "joined" | "applied" | "approved" | "rejected" | "repayment" | "completed";

export interface ActivityEvent {
  date: ISODate;
  kind: ActivityKind;
  text: string;
}

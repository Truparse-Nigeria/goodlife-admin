import type { ISODate } from "@/types/common";

const BUSINESS_TIMEZONE = "Africa/Lagos";

const isoFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Today's calendar date in Lagos, as "YYYY-MM-DD". */
export function today(): ISODate {
  return isoFormatter.format(new Date());
}

/** addMonths("2026-07-05", 2) → "2026-09-05". Overflow rolls forward like Date.UTC. */
export function addMonths(iso: ISODate, months: number): ISODate {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + months, d)).toISOString().slice(0, 10);
}

const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "UTC" });

/** weekday("2026-09-26") → "Saturday" */
export function weekday(iso: ISODate): string {
  const [y, m, d] = iso.split("-").map(Number);
  return weekdayFormatter.format(new Date(Date.UTC(y, m - 1, d)));
}

const hourFormatter = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: BUSINESS_TIMEZONE });

/** "Good morning" / "Good afternoon" / "Good evening" by Lagos time. */
export function greeting(now: Date = new Date()): string {
  const hour = Number(hourFormatter.format(now));
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

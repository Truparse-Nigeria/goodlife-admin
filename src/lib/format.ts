import type { ISODate } from "@/types/common";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const moneyFormatters = new Map<string, Intl.NumberFormat>();

/**
 * The single money formatter for the app. Whole units, no decimals.
 * formatMoney(500000) → "₦500,000"
 */
export function formatMoney(amount: number, currency = "NGN"): string {
  let fmt = moneyFormatters.get(currency);
  if (!fmt) {
    fmt = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });
    moneyFormatters.set(currency, fmt);
  }
  return fmt.format(Math.round(amount));
}

// Dates are parsed by hand (not `new Date(iso)`) so output never shifts with
// the server's or browser's timezone — keeps SSR and hydration identical.
function parts(iso: ISODate) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

/** formatDate("2026-09-26") → "26 Sep 2026"; null → "—" */
export function formatDate(iso: ISODate | null | undefined): string {
  if (!iso) return "—";
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** formatShortDate("2026-09-26") → "26 Sep" */
export function formatShortDate(iso: ISODate): string {
  const { m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]}`;
}

/** formatPercent(42) → "42%" */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** initials("Chiamaka Obi") → "CO" */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** capitalize("personal") → "Personal" */
export function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/** fileExtension("statement.pdf") → "PDF" */
export function fileExtension(file: string): string {
  return (file.split(".").pop() ?? "").toUpperCase();
}

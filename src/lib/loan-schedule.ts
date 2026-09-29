import type { ISODate } from "@/types/common";
import type { Installment } from "@/types/repayment";
import { addMonths, today } from "./dates";

/**
 * Planned schedule for a loan not yet approved (first month due a month
 * from `asOf`). Each month charges rate% of the capital as interest; the
 * capital is repaid with the final month. Mirrors goodlife-api's
 * plannedSchedule so the preview matches what approval creates.
 */
export function previewSchedule(amount: number, tenureMonths: number, ratePerMonth: number, asOf: ISODate = today()): Installment[] {
  const interest = Math.round(amount * ratePerMonth) / 100;
  return Array.from({ length: tenureMonths }, (_, i) => {
    const principalDue = i === tenureMonths - 1 ? amount : 0;
    return {
      number: i + 1,
      dueDate: addMonths(asOf, i + 1),
      capital: amount,
      interest,
      principalDue,
      total: interest + principalDue,
    };
  });
}

export function sumTotals(installments: Installment[]): number {
  return installments.reduce((acc, i) => acc + i.total, 0);
}

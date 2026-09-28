import type { IUserDetail, IUserListItem } from "@/interface/user.interface";
import type { ActivityEvent } from "@/types/activity";
import type { KeyValueItem } from "@/types/common";
import type { LoanRow } from "@/types/loan";
import type { UserRow } from "@/types/user";
import { toISODate } from "./dates";
import { formatAddress, formatMoney } from "./format";
import { loanDisplayStatus, repaymentBar } from "./loan-rows";

/*
 * Turns GET /admin/users and /admin/users/:id into what the user pages show.
 */

const or = (value: string | null | undefined) => (value?.trim() ? value : "—");

export const fullName = (p: { firstName: string; middleName?: string | null; lastName: string }) =>
  [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ");

export function rowFromApiUser(user: IUserListItem): UserRow {
  return {
    id: user.id,
    href: `/users/${user.id}`,
    name: fullName(user) || user.email,
    email: user.email,
    phone: or(user.phoneNumber),
    loanCount: user.loanCount,
    activeCount: user.activeCount,
    outstanding: user.outstanding,
    joinedAt: toISODate(user.joinedAt),
  };
}

export function userStats({ stats }: IUserDetail): KeyValueItem[] {
  return [
    { label: "Loans", value: stats.loanCount },
    { label: "Total borrowed", value: formatMoney(stats.totalBorrowed) },
    { label: "Total repaid", value: formatMoney(stats.totalRepaid) },
    { label: "Outstanding", value: formatMoney(stats.outstanding) },
  ];
}

/** Profile rows without the document links (those are rendered as links). */
export function profileRows({ profile }: IUserDetail): KeyValueItem[] {
  const bank = profile.bankDetails;
  return [
    { label: "Phone", value: or(profile.phoneNumber) },
    { label: "Address", value: formatAddress(profile.address) },
    { label: "Employer", value: or(profile.employerName) },
    { label: "BVN", value: or(profile.bvn) },
    { label: "NIN", value: or(profile.nin) },
    { label: "Bank", value: bank ? `${bank.bankName} · ${bank.accountNumber}` : "—" },
    { label: "Email verified", value: profile.isEmailVerified ? "Yes" : "No" },
  ];
}

/** The customer's loans as table rows linking to each loan. */
export function userLoanRows({ profile, loans }: IUserDetail): LoanRow[] {
  return loans.map((loan) => ({
    id: loan.id,
    href: `/loans/${loan.id}`,
    applicantName: fullName(profile),
    type: loan.type,
    amount: loan.amount,
    tenureMonths: loan.durationInMonths,
    appliedAt: toISODate(loan.createdAt),
    status: loanDisplayStatus(loan.status, loan.repayment?.overdue ?? false),
    progress: repaymentBar(loan.repayment),
  }));
}

export function activityEvents({ activity }: IUserDetail): ActivityEvent[] {
  return activity.map((e) => ({
    date: toISODate(e.date),
    kind: e.kind,
    text: e.text,
    href: e.loanId ? `/loans/${e.loanId}` : undefined,
  }));
}

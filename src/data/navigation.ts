export interface NavLink {
  href: string;
  label: string;
  /** Show the pending-applications count next to this item. */
  showPendingCount?: boolean;
}

export const adminNav: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/loans", label: "Loan applications", showPendingCount: true },
  { href: "/users", label: "All users" },
  { href: "/profile", label: "Profile" },
];

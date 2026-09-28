export interface NavLink {
  href: string;
  label: string;
}

export const customerNav: NavLink[] = [{ href: "/my-loans", label: "My loans" }];

export const adminNav: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/loans", label: "Loan applications" },
  { href: "/users", label: "All users" },
  { href: "/team", label: "Team" },
  { href: "/profile", label: "Profile" },
];

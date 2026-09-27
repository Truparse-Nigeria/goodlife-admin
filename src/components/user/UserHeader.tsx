import { Identity } from "@/components/ui/Identity";
import { formatDate } from "@/lib/format";
import type { Customer } from "@/types/user";

export type UserHeaderProps = {
  customer: Customer;
};

export function UserHeader({ customer }: UserHeaderProps) {
  return (
    <Identity
      name={customer.name}
      detail={`${customer.email} · Member since ${formatDate(customer.joinedAt)}`}
      size="page"
    />
  );
}

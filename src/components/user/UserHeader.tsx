import { Identity } from "@/components/ui/Identity";
import { formatDate } from "@/lib/format";
import type { ISODate } from "@/types/common";

export type UserHeaderProps = {
  name: string;
  email: string;
  joinedAt: ISODate;
};

export function UserHeader({ name, email, joinedAt }: UserHeaderProps) {
  return <Identity name={name} detail={`${email} · Member since ${formatDate(joinedAt)}`} size="page" />;
}

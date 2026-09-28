import { Identity } from "@/components/ui/Identity";
import { Table } from "@/components/ui/Table";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import { formatDate, formatMoney } from "@/lib/format";
import type { UserRow } from "@/types/user";

export type UserTableProps = {
  users: UserRow[];
  emptyMessage?: string;
};

export function UserTable({ users, emptyMessage = "No users match your search." }: UserTableProps) {
  return (
    <Table layout="users">
      <TableHead placement="standalone">
        <div>User</div>
        <div>Phone</div>
        <div>Loans</div>
        <div>Active</div>
        <div>Outstanding</div>
        <div>Joined</div>
      </TableHead>
      {users.map((user) => (
        <TableRow key={user.id} href={user.href}>
          <Identity name={user.name} detail={user.email} />
          <div className="text-13 text-ink-soft">{user.phone}</div>
          <div>{user.loanCount}</div>
          <div>{user.activeCount}</div>
          <div className="font-medium tabular-nums">{formatMoney(user.outstanding)}</div>
          <div className="text-13 text-ink-soft">{formatDate(user.joinedAt)}</div>
        </TableRow>
      ))}
      {users.length === 0 && <TableEmpty>{emptyMessage}</TableEmpty>}
    </Table>
  );
}

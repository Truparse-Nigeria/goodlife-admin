import { Identity } from "@/components/ui/Identity";
import { Table } from "@/components/ui/Table";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import { formatDate, formatMoney } from "@/lib/format";
import type { CustomerSummary } from "@/types/user";

export type UserTableProps = {
  users: CustomerSummary[];
};

export function UserTable({ users }: UserTableProps) {
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
      {users.map(({ customer, loanCount, activeCount, outstanding }) => (
        <TableRow key={customer.id} href={`/users/${customer.id}`}>
          <Identity name={customer.name} detail={customer.email} />
          <div className="text-13 text-ink-soft">{customer.phone}</div>
          <div>{loanCount}</div>
          <div>{activeCount}</div>
          <div className="font-medium tabular-nums">{formatMoney(outstanding)}</div>
          <div className="text-13 text-ink-soft">{formatDate(customer.joinedAt)}</div>
        </TableRow>
      ))}
      {users.length === 0 && <TableEmpty>No users match your search.</TableEmpty>}
    </Table>
  );
}

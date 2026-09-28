import { Table } from "@/components/ui/Table";
import { TableHead } from "@/components/ui/TableHead";
import { TableRow } from "@/components/ui/TableRow";
import { formatDate, formatMoney } from "@/lib/format";
import type { Installment } from "@/types/repayment";

export type SchedulePreviewProps = {
  installments: Installment[];
};

/** Estimated repayment schedule shown while an admin chooses a rate. */
export function SchedulePreview({ installments }: SchedulePreviewProps) {
  return (
    <Table layout="schedule-preview">
      <TableHead>
        <div>#</div>
        <div>Due date (est.)</div>
        <div>Principal</div>
        <div>Interest</div>
        <div>Installment</div>
      </TableHead>
      {installments.map((inst) => (
        <TableRow key={inst.number} density="dense" className="tabular-nums">
          <div className="text-muted">{inst.number}</div>
          <div className="text-13">{formatDate(inst.dueDate)}</div>
          <div>{formatMoney(inst.principal)}</div>
          <div>{formatMoney(inst.interest)}</div>
          <div className="font-semibold">{formatMoney(inst.total)}</div>
        </TableRow>
      ))}
    </Table>
  );
}

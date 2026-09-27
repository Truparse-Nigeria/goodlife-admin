export type LoanIdCellProps = {
  id: string;
};

/** Loan reference as shown in the first column of loan tables. */
export function LoanIdCell({ id }: LoanIdCellProps) {
  return <div className="font-semibold text-brand-strong">{id}</div>;
}

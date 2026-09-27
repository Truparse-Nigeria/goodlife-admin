/** Server-action signatures that loan components receive as props. */
export type LoanAction = (loanId: string) => Promise<void>;
export type ApproveLoanAction = (loanId: string, ratePerMonth: number) => Promise<void>;

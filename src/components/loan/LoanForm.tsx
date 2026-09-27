import { PageTitle } from "@/components/ui/PageTitle";
import { PrintButton } from "@/components/ui/PrintButton";
import { today } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { loanFormFields } from "@/lib/loan-documents";
import type { Loan } from "@/types/loan";
import type { Customer } from "@/types/user";

export type LoanFormProps = {
  loan: Loan;
  customer: Customer;
};

/** Printable, prefilled loan application form. Use the browser's "Save as PDF". */
export function LoanForm({ loan, customer }: LoanFormProps) {
  return (
    <article className="mx-auto max-w-form bg-surface p-12 text-ink print:p-0">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <PageTitle size="sm" className="mb-1">
            Loan Application Form
          </PageTitle>
          <p className="text-13 text-muted">
            Generated {formatDate(today())} · {loan.id}
          </p>
        </div>
        <PrintButton size="md" className="print:hidden">
          Print / Save PDF
        </PrintButton>
      </div>

      <table className="w-full border-collapse text-13">
        <tbody>
          {loanFormFields(loan, customer).map((f) => (
            <tr key={f.label} className="border-b border-border">
              <th scope="row" className="w-2/5 py-2.5 text-left font-normal text-muted">
                {f.label}
              </th>
              <td className="py-2.5">{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-14 flex justify-between text-12 text-muted">
        {[`Applicant signature (${customer.signatureFile})`, "Date"].map((line) => (
          <div key={line} className="w-2/5 border-t border-ink pt-1.5">
            {line}
          </div>
        ))}
      </div>
    </article>
  );
}

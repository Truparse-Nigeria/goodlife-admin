import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Identity } from "@/components/ui/Identity";
import { KeyValueList } from "@/components/ui/KeyValueList";
import { formatDate } from "@/lib/format";
import type { Loan } from "@/types/loan";
import type { Customer } from "@/types/user";

export type ApplicantCardProps = {
  loan: Loan;
  customer: Customer;
};

export function ApplicantCard({ loan, customer }: ApplicantCardProps) {
  const rows = [
    { label: "Email", value: customer.email },
    { label: "Phone", value: customer.phone },
    { label: "Address", value: customer.address },
    { label: "BVN", value: customer.bvn },
    { label: "Employer", value: customer.employer },
    { label: "Purpose", value: loan.purpose },
    { label: "Approved", value: formatDate(loan.approvedAt) },
  ];

  return (
    <Card>
      <div className="flex items-center gap-3 border-b border-divider px-5 py-4.5">
        <Identity name={customer.name} detail="Applicant" size="card" className="flex-1" />
        <ButtonLink href={`/users/${customer.id}`} variant="secondary" size="xs">
          View user
        </ButtonLink>
      </div>
      <KeyValueList items={rows} className="px-5 pt-1.5 pb-3.5" />
    </Card>
  );
}

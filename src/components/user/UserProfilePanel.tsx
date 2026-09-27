import { Card } from "@/components/ui/Card";
import { CardTitle } from "@/components/ui/CardTitle";
import { KeyValueList } from "@/components/ui/KeyValueList";
import type { Customer } from "@/types/user";

export type UserProfilePanelProps = {
  customer: Customer;
};

export function UserProfilePanel({ customer }: UserProfilePanelProps) {
  const rows = [
    { label: "Phone", value: customer.phone },
    { label: "Address", value: customer.address },
    { label: "BVN", value: customer.bvn },
    { label: "Employer", value: customer.employer },
    { label: "Valid ID", value: customer.idFile },
    { label: "Signature", value: customer.signatureFile },
  ];
  return (
    <Card padding="md">
      <CardTitle className="mb-2.5">Profile</CardTitle>
      <KeyValueList items={rows} />
    </Card>
  );
}

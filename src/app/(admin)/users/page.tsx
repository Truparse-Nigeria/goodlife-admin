import type { Metadata } from "next";
import { UserTable } from "@/components/user/UserTable";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { listCustomers } from "@/lib/loan-store";
import { getCustomerSummaries, paramString } from "@/lib/loan-views";

export const metadata: Metadata = { title: "All users · GoodLife Admin" };

export default async function UsersPage({ searchParams }: PageProps<"/users">) {
  const query = paramString((await searchParams).q);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="All users"
        subtitle={`${listCustomers().length} registered customers`}
        actions={<SearchInput defaultValue={query} placeholder="Search by name or email" />}
      />
      <Card>
        <UserTable users={getCustomerSummaries(query)} />
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { LoanStatusFilters } from "@/components/loan/LoanStatusFilters";
import { LoanTable } from "@/components/loan/LoanTable";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { countByStatus, filterLoanViews, getLoanViews, paramString, parseLoanFilter } from "@/lib/loan-views";

export const metadata: Metadata = { title: "Loan applications · GoodLife Admin" };

export default async function LoansPage({ searchParams }: PageProps<"/loans">) {
  const params = await searchParams;
  const status = parseLoanFilter(paramString(params.status));
  const query = paramString(params.q);
  const views = getLoanViews();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Loan applications" subtitle="Review, approve and track every loan." />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LoanStatusFilters active={status} counts={countByStatus(views)} query={query} />
        <SearchInput defaultValue={query} placeholder="Search by loan ID or name" />
      </div>
      <Card>
        <LoanTable loans={filterLoanViews(views, status, query)} />
      </Card>
    </div>
  );
}

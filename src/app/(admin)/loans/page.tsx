import type { Metadata } from "next";
import { getAllLoansApi } from "@/api/loan";
import { LoanStatusFilters } from "@/components/loan/LoanStatusFilters";
import { LoanTable } from "@/components/loan/LoanTable";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { loanListHref, parseLoanListParams } from "@/lib/loan-list-params";
import { rowFromApiLoan } from "@/lib/loan-rows";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Loan applications · GoodLife Admin" };

const PAGE_SIZE = 20;

export default async function LoansPage({ searchParams }: PageProps<"/loans">) {
  const { token } = await requireAdmin();
  const params = parseLoanListParams(await searchParams);

  const { data, response, error } = await getAllLoansApi(token, {
    page: params.page,
    limit: PAGE_SIZE,
    status: params.status,
    search: params.query || undefined,
  });
  redirectIfUnauthorized(error);
  const meta = response?.meta;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Loan applications" subtitle="Review, approve and track every loan." />
      <div className="flex flex-wrap items-center justify-between gap-3">
        {meta && <LoanStatusFilters params={params} counts={meta.statusCounts} />}
        <SearchInput defaultValue={params.query} placeholder="Search by name or email" />
      </div>
      <Card>
        {error ? (
          <TableEmpty>Couldn’t load loans: {error.message}</TableEmpty>
        ) : (
          <LoanTable loans={(data ?? []).map(rowFromApiLoan)} />
        )}
      </Card>
      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          hrefFor={(page) => loanListHref(params, { page })}
        />
      )}
    </div>
  );
}

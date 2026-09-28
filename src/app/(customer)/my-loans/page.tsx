import type { Metadata } from "next";
import { getMyLoansApi } from "@/api/loan";
import { LoanTable } from "@/components/loan/LoanTable";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { rowFromMyLoan } from "@/lib/loan-rows";
import { redirectIfUnauthorized, requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "My loans · GoodLife" };

const PAGE_SIZE = 20;

export default async function MyLoansPage({ searchParams }: PageProps<"/my-loans">) {
  const { user, token } = await requireRole("User");
  const rawPage = Number.parseInt(String((await searchParams).page ?? ""), 10);
  const page = rawPage > 0 ? rawPage : 1;

  const { data, response, error } = await getMyLoansApi(token, { page, limit: PAGE_SIZE });
  redirectIfUnauthorized(error);
  const meta = response?.meta;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Hi, ${user.firstName}`} subtitle="Your loan requests and repayments." />
      <Card>
        <CardHeader
          title="Loan requests"
          subtitle={meta ? `${meta.total} request${meta.total === 1 ? "" : "s"}` : undefined}
        />
        {error ? (
          <TableEmpty>Couldn’t load your loans: {error.message}</TableEmpty>
        ) : (
          <LoanTable
            variant="compact"
            loans={(data ?? []).map(rowFromMyLoan)}
            emptyMessage="You haven’t requested a loan yet."
          />
        )}
      </Card>
      {meta && (
        <Pagination page={meta.page} totalPages={meta.totalPages} hrefFor={(p) => (p > 1 ? `/my-loans?page=${p}` : "/my-loans")} />
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { getUsersApi } from "@/api/user";
import { UserTable } from "@/components/user/UserTable";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { TableEmpty } from "@/components/ui/TableEmpty";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";
import { rowFromApiUser } from "@/lib/user-detail";

export const metadata: Metadata = { title: "All users · GoodLife Admin" };

const PAGE_SIZE = 20;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

function usersHref(query: string, page: number) {
  const qs = new URLSearchParams();
  if (query) qs.set("q", query);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `/users?${s}` : "/users";
}

export default async function UsersPage({ searchParams }: PageProps<"/users">) {
  const { token } = await requireAdmin();
  const params = await searchParams;
  const query = first(params.q);
  const page = Math.max(1, Number.parseInt(first(params.page), 10) || 1);

  const { data, response, error } = await getUsersApi(token, { page, limit: PAGE_SIZE, search: query || undefined });
  redirectIfUnauthorized(error);
  const meta = response?.meta;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="All users"
        subtitle={meta ? `${meta.total} registered customer${meta.total === 1 ? "" : "s"}` : "Registered customers"}
        actions={<SearchInput defaultValue={query} placeholder="Search by name, email or phone" />}
      />
      <Card>
        {error ? (
          <TableEmpty>Couldn’t load users: {error.message}</TableEmpty>
        ) : (
          <UserTable users={(data ?? []).map(rowFromApiUser)} />
        )}
      </Card>
      {meta && <Pagination page={meta.page} totalPages={meta.totalPages} hrefFor={(p) => usersHref(query, p)} />}
    </div>
  );
}

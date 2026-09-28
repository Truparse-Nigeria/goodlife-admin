import { NextResponse, type NextRequest } from "next/server";
import { exportLoansApi } from "@/api/loan";
import { parseLoanListParams } from "@/lib/loan-list-params";
import { requireAdmin } from "@/lib/session";

/** GET /loans/export?status=&q= → the filtered loan list as .xlsx, built by goodlife-api. */
export async function GET(request: NextRequest) {
  const { token } = await requireAdmin();
  const params = parseLoanListParams(Object.fromEntries(request.nextUrl.searchParams));

  const res = await exportLoansApi(token, { status: params.status, search: params.query || undefined });
  if (res.status === 401) return NextResponse.redirect(new URL("/logout", request.url));
  if (!res.ok || !res.body) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    return new NextResponse(`Couldn’t export loans: ${body?.message ?? res.statusText}`, { status: res.status || 502 });
  }

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Disposition": res.headers.get("Content-Disposition") ?? 'attachment; filename="loans.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}

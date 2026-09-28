import { NextResponse, type NextRequest } from "next/server";
import { homeFor, isCustomerPath, SESSION_COOKIE, verifySession } from "@/lib/session-token";

/**
 * Route by session + role:
 * - signed out → /login (a stale cookie is cleared)
 * - signed in on /login or / → the role's home
 * - admins stay out of customer routes, customers out of admin routes
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(cookie);
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url));

  if (!session) {
    if (pathname === "/login") return NextResponse.next();
    const response = redirectTo("/login");
    if (cookie) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (pathname === "/logout") return NextResponse.next();

  const { role } = session.user;
  if (pathname === "/login" || pathname === "/") return redirectTo(homeFor(role));
  const allowed = role === "Admin" ? !isCustomerPath(pathname) : isCustomerPath(pathname);
  if (!allowed) return redirectTo(homeFor(role));
  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and public assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
};

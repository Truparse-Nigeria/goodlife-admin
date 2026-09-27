import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/** Send signed-out visitors to /login, and signed-in ones away from it. */
export function proxy(request: NextRequest) {
  const signedIn = request.cookies.has(SESSION_COOKIE);
  const onLogin = request.nextUrl.pathname === "/login";

  if (!signedIn && !onLogin) return NextResponse.redirect(new URL("/login", request.url));
  if (signedIn && onLogin) return NextResponse.redirect(new URL("/dashboard", request.url));
  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and public assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
};

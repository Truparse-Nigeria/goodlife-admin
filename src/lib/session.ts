import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/interface/user.interface";
import type { ApiError } from "@/types/api";
import type { SessionPayload, SessionUser } from "@/types/session";
import { homeFor, SESSION_COOKIE, SESSION_TTL_MS, signSession, verifySession } from "./session-token";

/*
 * App session: a signed, httpOnly cookie holding the goodlife-api token and
 * the signed-in user (incl. role, which decides admin vs customer view).
 */

export async function getSession(): Promise<SessionPayload | null> {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For pages and actions: signed-out → /login, wrong role → that role's home. */
export async function requireRole(role: UserRole): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== role) redirect(homeFor(session.user.role));
  return session;
}

export const requireAdmin = () => requireRole("Admin");

/** The API no longer accepts the session token (expired/revoked): end the session. */
export function redirectIfUnauthorized(error: ApiError | undefined): void {
  if (error?.status === 401) redirect("/logout");
}

export async function createSession(token: string, user: SessionUser): Promise<void> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  (await cookies()).set(SESSION_COOKIE, await signSession({ token, user, expiresAt }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/*
 * Sign-in with a temporary password: the API token is held here instead of in
 * the session, so the only thing it can be used for is changing the password.
 */
const PASSWORD_CHANGE_COOKIE = "glc_password_change";
const PASSWORD_CHANGE_TTL_MS = 15 * 60 * 1000;

export async function createPasswordChangeSession(token: string, user: SessionUser): Promise<void> {
  const expiresAt = Date.now() + PASSWORD_CHANGE_TTL_MS;
  (await cookies()).set(PASSWORD_CHANGE_COOKIE, await signSession({ token, user, expiresAt }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function getPasswordChangeSession(): Promise<SessionPayload | null> {
  return verifySession((await cookies()).get(PASSWORD_CHANGE_COOKIE)?.value);
}

export async function deletePasswordChangeSession(): Promise<void> {
  (await cookies()).delete(PASSWORD_CHANGE_COOKIE);
}

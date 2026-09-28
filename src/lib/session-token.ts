import "server-only";
import { jwtVerify, SignJWT } from "jose";
import type { UserRole } from "@/interface/user.interface";
import type { SessionPayload } from "@/types/session";

/*
 * Signing and routing rules shared by lib/session (pages, actions) and
 * proxy.ts. No next/headers here so the proxy can import it.
 */

export const SESSION_COOKIE = "glc_session";

/** Matches the goodlife-api token lifetime (7 days). */
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Route prefixes that belong to the customer view; everything else is admin. */
export const CUSTOMER_PATHS = ["/my-loans"];

export const isSuperAdmin = (role: UserRole) => role === "Super Admin";

/** Admins and super admins use the admin view. */
export const isAdminRole = (role: UserRole) => role === "Admin" || isSuperAdmin(role);

export function homeFor(role: UserRole): string {
  return isAdminRole(role) ? "/dashboard" : "/my-loans";
}

/** Super admins can open any route; everyone else only their own view's. */
export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (isSuperAdmin(role)) return true;
  return isAdminRole(role) ? !isCustomerPath(pathname) : isCustomerPath(pathname);
}

export function isCustomerPath(pathname: string): boolean {
  return CUSTOMER_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set (see .env.example)");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(payload.expiresAt))
    .sign(secretKey());
}

/** Returns null for a missing, tampered or expired session. */
export async function verifySession(value: string | undefined): Promise<SessionPayload | null> {
  if (!value) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(value, secretKey(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

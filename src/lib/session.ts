import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "./session-cookie";

/*
 * Mock session: a single httpOnly cookie marks the admin as signed in.
 * Replace with goodlife-api auth (JWT/refresh) when wiring the backend.
 */
const SESSION_VALUE = "admin";

export async function isSignedIn(): Promise<boolean> {
  return (await cookies()).get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

/** Guard for server actions and pages; redirects to /login when signed out. */
export async function requireAdmin(): Promise<void> {
  if (!(await isSignedIn())) redirect("/login");
}

export async function startSession(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

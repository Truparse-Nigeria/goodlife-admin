import { signOut } from "@/app/actions/auth";

/**
 * End the admin session after the API rejects our credentials (401).
 * The server action clears the session cookie and redirects to /login.
 * No-op on the server, where there is no user session to end.
 */
export function setLogout(): void {
  if (typeof window === "undefined") return;
  void signOut();
}

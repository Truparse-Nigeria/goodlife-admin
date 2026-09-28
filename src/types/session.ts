import type { UserRole } from "@/interface/user.interface";

/** What the app keeps about the signed-in user (from the login response). */
export interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  requiresPasswordChange: boolean;
}

/** Contents of the signed session cookie. */
export interface SessionPayload {
  /** goodlife-api `token`, forwarded on server-side API calls. */
  token: string;
  user: SessionUser;
  /** Epoch ms. */
  expiresAt: number;
}

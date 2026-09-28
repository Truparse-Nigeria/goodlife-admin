"use server";

import { redirect } from "next/navigation";
import { changePasswordApi, forgotPasswordApi, loginApi, logoutApi, resetPasswordApi } from "@/api/auth";
import {
  createPasswordChangeSession,
  createSession,
  deletePasswordChangeSession,
  deleteSession,
  getPasswordChangeSession,
  getSession,
} from "@/lib/session";
import { homeFor } from "@/lib/session-token";

export type SignInState =
  | { error: string; email: string }
  /** Signed in with a temporary password: the UI must collect a new one. */
  | { passwordChangeRequired: true; email: string }
  | null;

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", email };

  const { data: user, token, error } = await loginApi({ email, password });
  if (error) return { error: error.message, email };
  if (!user || !token) return { error: "Sign-in failed. Please try again.", email };

  const sessionUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    requiresPasswordChange: user.requiresPasswordChange,
  };

  if (user.requiresPasswordChange) {
    await createPasswordChangeSession(token, sessionUser);
    return { passwordChangeRequired: true, email };
  }

  await createSession(token, sessionUser);
  redirect(homeFor(user.role));
}

export type ChangePasswordState = { error?: string; done?: boolean } | null;

const MIN_PASSWORD_LENGTH = 8;

/**
 * Replace a temporary password. The API revokes the user's tokens on success,
 * so this also ends the pending sign-in: the user signs in with the new password.
 */
export async function changeTemporaryPassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (newPassword !== confirmPassword) return { error: "The passwords don’t match." };
  if (newPassword === currentPassword) return { error: "Choose a password different from the temporary one." };

  const pending = await getPasswordChangeSession();
  if (!pending) return { error: "This sign-in has expired. Sign in again to set your password." };

  const { error } = await changePasswordApi(pending.token, { currentPassword, newPassword });
  if (error) return { error: error.message };

  await deletePasswordChangeSession();
  return { done: true };
}

export type ForgotPasswordState = { error: string; email: string } | { sent: true; email: string } | null;

/** Email a reset link that opens /reset-password in this portal. */
export async function requestPasswordReset(
  _prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter your email address.", email };

  const { error } = await forgotPasswordApi(email);
  if (error) return { error: error.message, email };
  return { sent: true, email };
}

export type ResetPasswordState = { error: string } | null;

/** Set a new password from the emailed link, then send the user to sign in with it. */
export async function resetPassword(_prev: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) return { error: "This reset link is invalid. Request a new one." };
  if (password.length < MIN_PASSWORD_LENGTH) return { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  if (password !== confirmPassword) return { error: "The passwords don’t match." };

  const { error } = await resetPasswordApi({ token, password });
  if (error) return { error: error.message };

  redirect("/login?reset=1");
}

export async function signOut(): Promise<void> {
  const session = await getSession();
  // Best effort: revoke the API token; the local session ends either way.
  if (session) await logoutApi(session.token);
  await deleteSession();
  redirect("/login");
}

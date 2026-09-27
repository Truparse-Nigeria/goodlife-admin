"use server";

import { redirect } from "next/navigation";
import { demoCredentials } from "@/data/admin";
import { getAdmin } from "@/lib/loan-store";
import { endSession, startSession } from "@/lib/session";

export type SignInState = { error: string } | null;

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (formData.get("role") === "customer") {
    return { error: "Customer accounts sign in on the GoodLife customer portal." };
  }

  // The admin can change their email on the profile page, so accept either.
  const knownEmails = [demoCredentials.email, getAdmin().email].map((e) => e.toLowerCase());
  if (!knownEmails.includes(email) || password !== demoCredentials.password) {
    return { error: "Incorrect email or password." };
  }

  await startSession();
  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/login");
}

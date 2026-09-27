"use server";

import { revalidatePath } from "next/cache";
import { updateAdmin } from "@/lib/loan-store";
import { requireAdmin } from "@/lib/session";
import type { Admin } from "@/types/user";

export async function updateProfile(profile: Admin): Promise<void> {
  await requireAdmin();
  updateAdmin({
    name: profile.name.trim(),
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    title: profile.title.trim(),
  });
  // Name/title also show in the sidebar and dashboard greeting.
  revalidatePath("/", "layout");
}

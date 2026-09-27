import type { Metadata } from "next";
import { updateProfile } from "@/app/actions/profile";
import { ProfileForm } from "@/components/user/ProfileForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdmin } from "@/lib/loan-store";

export const metadata: Metadata = { title: "Profile · GoodLife Admin" };

export default function ProfilePage() {
  return (
    <div className="flex max-w-form flex-col gap-5">
      <PageHeader title="Profile" />
      <ProfileForm profile={getAdmin()} saveAction={updateProfile} />
    </div>
  );
}

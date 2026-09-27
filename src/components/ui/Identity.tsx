import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Avatar, type AvatarSize, type AvatarTone } from "./Avatar";
import { PageTitle } from "./PageTitle";

/**
 * sidebar — signed-in user in the sidebar footer
 * row     — table / list rows
 * card    — card header (applicant)
 * profile — profile card header
 * page    — page header (user detail); name renders as the h1
 */
export type IdentitySize = "sidebar" | "row" | "card" | "profile" | "page";

const SIZES: Record<IdentitySize, { avatar: AvatarSize; avatarText?: string; gap: string; name: string; detail: string }> = {
  sidebar: { avatar: "md", avatarText: "text-13", gap: "gap-2.5", name: "truncate text-13 font-semibold", detail: "text-12 text-muted" },
  row: { avatar: "md", gap: "gap-3", name: "text-14 font-medium", detail: "truncate text-12 text-muted" },
  card: { avatar: "lg", gap: "gap-3", name: "text-15 font-semibold", detail: "text-12 text-muted" },
  profile: { avatar: "2xl", gap: "gap-4", name: "text-18 font-semibold", detail: "text-13 text-muted" },
  page: { avatar: "xl", gap: "gap-4", name: "", detail: "mt-1 text-14 text-muted" },
};

export type IdentityProps = {
  name: string;
  detail?: ReactNode;
  size?: IdentitySize;
  tone?: AvatarTone;
  className?: string;
};

/** Avatar with a name and one line of detail. */
export function Identity({ name, detail, size = "row", tone = "brand", className }: IdentityProps) {
  const s = SIZES[size];
  return (
    <div className={cn("flex min-w-0 items-center", s.gap, className)}>
      <Avatar name={name} size={s.avatar} tone={tone} className={s.avatarText} />
      <div className="min-w-0 flex-1">
        {size === "page" ? <PageTitle size="md">{name}</PageTitle> : <div className={s.name}>{name}</div>}
        {detail != null && <div className={s.detail}>{detail}</div>}
      </div>
    </div>
  );
}

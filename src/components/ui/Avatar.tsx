import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

export type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarTone = "brand" | "warning" | "neutral";

const sizes: Record<AvatarSize, string> = {
  sm: "size-7.5 text-11", // 30px — table rows
  md: "size-9 text-12", // 36px — lists, sidebar
  lg: "size-10 text-14", // 40px — applicant card
  xl: "size-14 text-18", // 56px — user header
  "2xl": "size-15 text-20", // 60px — profile
};

const tones: Record<AvatarTone, string> = {
  brand: "bg-brand-soft text-brand-strong",
  warning: "bg-warning-soft text-warning",
  neutral: "bg-track text-ink-soft",
};

export type AvatarProps = {
  name: string;
  size?: AvatarSize;
  tone?: AvatarTone;
  className?: string;
};

/** Initials in a circle. Decorative — the name is always rendered next to it. */
export function Avatar({ name, size = "md", tone = "brand", className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

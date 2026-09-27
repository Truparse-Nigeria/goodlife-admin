import Image from "next/image";
import { cn } from "@/lib/cn";

export type LogoProps = {
  size?: "sm" | "lg";
  priority?: boolean;
  className?: string;
};

// Source asset is 229 × 98.
const LOGO_WIDTH = 229;
const LOGO_HEIGHT = 98;

/** Brand mark. Designed for the dark brand-deep background. */
export function Logo({ size = "sm", priority = false, className }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="GoodLife Credit"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn("block w-auto", size === "sm" ? "h-11.5" : "h-17", className)}
    />
  );
}

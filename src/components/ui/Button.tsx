import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "soft" | "link" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand font-semibold hover:bg-brand-hover",
  secondary: "border border-border bg-surface text-ink",
  danger: "border border-danger-border bg-surface text-danger font-semibold hover:bg-danger-soft",
  soft: "bg-brand-soft text-brand-strong font-semibold hover:bg-brand-soft-hover",
  link: "bg-transparent p-0 text-brand-strong hover:text-ink",
  ghost: "bg-transparent text-muted underline",
};

// `link` / `ghost` ignore padding from size so they sit inline with text.
const sizes: Record<ButtonSize, string> = {
  xs: "rounded-sm px-2.5 py-1.5 text-12",
  sm: "rounded-sm px-3 py-1.75 text-12",
  md: "rounded-sm px-3 py-2 text-13",
  lg: "rounded-md px-4.5 py-2.75 text-14",
  xl: "rounded-md p-3.25 text-15",
};

const inlineVariants: ButtonVariant[] = ["link", "ghost"];

export type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export type ButtonProps = ButtonStyleProps & ComponentProps<"button">;

/** Shared by Button and ButtonLink so both render identically. */
export function buttonClasses({ variant = "primary", size = "lg", fullWidth }: ButtonStyleProps, className?: string) {
  const inline = inlineVariants.includes(variant);
  return cn(
    base,
    variants[variant],
    inline ? "p-0 text-13" : sizes[size],
    inline && variant === "ghost" && "px-1 py-1.5 text-12",
    fullWidth && "w-full",
    className,
  );
}

export function Button({ variant, size, fullWidth, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, fullWidth }, className)} {...props} />;
}

import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClasses, type ButtonStyleProps } from "./Button";

export type ButtonLinkProps = ButtonStyleProps & ComponentProps<typeof Link>;

/** A Next.js Link styled as a button. */
export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, fullWidth }, className)} {...props} />;
}

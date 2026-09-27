import Link from "next/link";

export type BackLinkProps = {
  href: string;
  children: string;
};

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link href={href} className="self-start text-13 text-brand-strong no-underline hover:text-brand-strong">
      <span aria-hidden>← </span>
      {children}
    </Link>
  );
}

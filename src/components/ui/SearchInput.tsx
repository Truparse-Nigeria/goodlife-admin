"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Input } from "./Input";

export type SearchInputProps = {
  /** Current value, read by the page from its `searchParams`. */
  defaultValue?: string;
  placeholder: string;
  /** Query-string key to write. */
  param?: string;
  className?: string;
};

const DEBOUNCE_MS = 250;

/**
 * Text input that mirrors its value into the URL (?q=…) so the Server
 * Component page can filter. Other query params are preserved.
 */
export function SearchInput({ defaultValue = "", placeholder, param = "q", className }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(defaultValue);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function onChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (next.trim()) params.set(param, next);
      else params.delete(param);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, DEBOUNCE_MS);
  }

  return (
    <Input
      type="text"
      role="searchbox"
      enterKeyHint="search"
      size="sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={cn("w-full sm:w-65", className)}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Identity } from "@/components/ui/Identity";
import { Input } from "@/components/ui/Input";
import type { CustomerMatch, SearchCustomersAction } from "@/types/actions";

export type CustomerPickerProps = {
  /** The existing customer the form is filled from, if any. */
  selected: CustomerMatch | null;
  searchAction: SearchCustomersAction;
};

const DEBOUNCE_MS = 250;

/**
 * Apply for an existing customer (fills the form from their profile and adds
 * the loan to their account) or leave it blank for a new applicant.
 */
export function CustomerPicker({ selected, searchAction }: CustomerPickerProps) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<CustomerMatch[] | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef("");

  useEffect(() => () => clearTimeout(timer.current), []);

  function onChange(next: string) {
    setQuery(next);
    latest.current = next;
    clearTimeout(timer.current);
    if (next.trim().length < 2) return setMatches(null);
    timer.current = setTimeout(async () => {
      const found = await searchAction(next);
      // Ignore answers to queries the admin has typed past.
      if (latest.current === next) setMatches(found);
    }, DEBOUNCE_MS);
  }

  if (selected) {
    return (
      <Card padding="md" className="flex flex-wrap items-center justify-between gap-3">
        <Identity name={selected.name} detail={`Existing customer · ${selected.email}`} size="card" />
        <ButtonLink href="/loans/new" variant="secondary" size="md">
          Change
        </ButtonLink>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <CardHeader
        className="p-0"
        title="Existing customer?"
        subtitle="Find them to fill the form from their profile and add the loan to their account. Leave this empty for a new applicant: an account is created for them."
        subtitleSize="sm"
      />
      <Input
        type="search"
        size="sm"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search customers by name, email or phone"
        aria-label="Search customers"
        className="mt-3.5"
      />
      {matches && (
        <ul className="mt-2 flex flex-col">
          {matches.length === 0 && <li className="py-2 text-13 text-muted">No customers match “{query}”.</li>}
          {matches.map((m) => (
            <li key={m.id}>
              {/* Full navigation so the server page loads their profile. */}
              <a
                href={`/loans/new?customer=${encodeURIComponent(m.id)}`}
                className="block rounded-md px-2 py-2 hover:bg-surface-sunken"
              >
                <Identity name={m.name} detail={m.email} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

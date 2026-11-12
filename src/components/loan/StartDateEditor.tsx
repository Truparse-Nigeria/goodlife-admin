"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import { toISODate, today } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import type { UpdateStartDateAction } from "@/types/actions";

export type StartDateEditorProps = {
  loanId: string;
  /** Current start date, ISO timestamp. */
  startDate: string;
  updateAction: UpdateStartDateAction;
};

/**
 * Start date with an edit control. Every due date is worked out from it, so
 * changing it shifts the whole schedule.
 */
export function StartDateEditor({ loanId, startDate, updateAction }: StartDateEditorProps) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const current = toISODate(startDate);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(current);

  function open() {
    setValue(current);
    setEditing(true);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!value) return toast("Pick a start date");
    if (value === current) return setEditing(false);
    startTransition(async () => {
      const { error } = await updateAction(loanId, value);
      if (error) return toast(error);
      toast(`Start date changed to ${formatDate(value)}`);
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <div className="mx-5 mb-3.5 flex items-center gap-2 text-13 text-ink-soft">
        <span>
          Start date <strong className="font-semibold text-ink">{formatDate(current)}</strong>
        </span>
        <Button variant="link" size="sm" onClick={open}>
          Edit
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-5 mb-4.5 flex flex-col gap-3 rounded-lg border border-brand-border bg-brand-tint p-4.5"
    >
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Start date" className="w-44">
          <Input type="date" required autoFocus max={today()} value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={() => setEditing(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" size="md" disabled={pending}>
            {pending ? "Saving…" : "Save start date"}
          </Button>
        </div>
      </div>
      <p className="text-13 text-warning">
        Every due date, and the end date, moves with the start date. Recorded payments stay on the same month numbers.
      </p>
    </form>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import type { LoanFormBinding, LoanFormField } from "@/lib/create-loan-form";

export type LoanFormUploadProps = {
  form: LoanFormBinding;
  name: LoanFormField;
  label: ReactNode;
  /** e.g. "application/pdf" or "image/*". */
  accept: string;
  /** Shown in the empty drop area, e.g. "PDF" or "PNG, JPEG, JPG". */
  kinds: string;
  required?: boolean;
  /** Extra control beside the upload, e.g. a template download. */
  aside?: ReactNode;
  className?: string;
};

/** Uploads through /api/uploads and stores the file's URL in the field. */
export function LoanFormUpload({ form, name, label, accept, kinds, required, aside, className }: LoanFormUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const url = form.values[name];

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok || !json.url) throw new Error(json.message ?? "Upload failed.");
      form.set(name, json.url);
      setFileName(file.name);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const status = uploading ? "Uploading…" : url ? (fileName ?? "Uploaded") : `Upload ${kinds}`;

  return (
    <Field label={label} required={required} error={uploadError ?? form.errors[name]} className={className}>
      <div className="flex gap-2.5">
        {aside}
        <div
          className={cn(
            "relative flex min-w-0 flex-1 items-center gap-2.5 rounded-md border border-dashed px-3.5 py-2.5 text-13",
            url ? "border-brand bg-brand-soft text-brand-strong" : "border-border-input bg-surface-sunken text-ink-soft",
            uploading && "opacity-70",
          )}
        >
          <span aria-hidden className="font-semibold">
            {url ? "✓" : "↑"}
          </span>
          <span className="min-w-0 flex-1 truncate">{status}</span>
          {url && !uploading && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="relative z-10 font-semibold text-brand-strong underline"
            >
              View
            </a>
          )}
          {/* Covers the box so a click anywhere picks a file; View sits above it. */}
          <input
            type="file"
            accept={accept}
            disabled={uploading}
            aria-label={typeof label === "string" ? label : undefined}
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
            className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-wait"
          />
        </div>
      </div>
    </Field>
  );
}

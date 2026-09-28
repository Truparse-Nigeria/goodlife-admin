"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export type ExportLoansButtonProps = {
  /** /loans/export with the list's current filters. */
  href: string;
};

const FALLBACK_NAME = "loans.xlsx";

/** `attachment; filename="loans-all-2026-09-28.xlsx"` → the file name. */
const fileNameFrom = (disposition: string | null) => disposition?.match(/filename="?([^";]+)"?/)?.[1] ?? FALLBACK_NAME;

/** Downloads the filtered loan list as .xlsx without leaving the page; failures show as a toast. */
export function ExportLoansButton({ href }: ExportLoansButtonProps) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  async function onExport() {
    setPending(true);
    try {
      const res = await fetch(href, { cache: "no-store" });
      const type = res.headers.get("Content-Type") ?? "";
      if (!res.ok || !type.includes("spreadsheet")) {
        const message = (await res.text()).trim();
        throw new Error(message.startsWith("<") || !message ? `Export failed (${res.status}).` : message);
      }

      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = fileNameFrom(res.headers.get("Content-Disposition"));
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="secondary" className="font-semibold" disabled={pending} onClick={onExport}>
      {pending ? "Exporting…" : "Export XLSX"}
    </Button>
  );
}

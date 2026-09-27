import { FileRow } from "@/components/ui/FileRow";
import { ToastButton } from "@/components/ui/ToastButton";
import type { DocumentEntry } from "@/lib/loan-documents";

export type DocumentListProps = {
  docs: DocumentEntry[];
};

/** Downloadable file rows. Downloads are mocked until the API serves files. */
export function DocumentList({ docs }: DocumentListProps) {
  return docs.map((d) => (
    <FileRow
      key={d.label}
      label={d.label}
      fileName={d.fileName}
      action={
        <ToastButton variant="soft" size="sm" message={`Downloading ${d.fileName}`}>
          Download
        </ToastButton>
      }
    />
  ));
}

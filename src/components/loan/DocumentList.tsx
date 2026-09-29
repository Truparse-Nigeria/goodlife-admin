import { DocumentViewer } from "@/components/ui/DocumentViewer";
import { FileRow } from "@/components/ui/FileRow";
import { fileFromUrl } from "@/lib/format";
import type { DocumentLink } from "@/lib/loan-detail";

export type DocumentListProps = {
  docs: DocumentLink[];
};

/** Uploaded files, each viewable in a modal on the page. */
export function DocumentList({ docs }: DocumentListProps) {
  return docs.map(({ label, url }) => {
    const file = url ? fileFromUrl(url) : null;
    return (
      <FileRow
        key={label}
        label={label}
        fileName={file?.name ?? "Not provided"}
        ext={file?.ext ?? "—"}
        action={url ? <DocumentViewer label={label} url={url} /> : null}
      />
    );
  });
}

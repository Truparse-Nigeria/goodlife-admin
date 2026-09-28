import { buttonClasses } from "@/components/ui/Button";
import { FileRow } from "@/components/ui/FileRow";
import { fileFromUrl } from "@/lib/format";
import type { DocumentLink } from "@/lib/loan-detail";

export type DocumentListProps = {
  docs: DocumentLink[];
};

/** Uploaded files, each opening in a new tab (inline data URLs download). */
export function DocumentList({ docs }: DocumentListProps) {
  return docs.map(({ label, url }) => {
    const file = url ? fileFromUrl(url) : null;
    return (
      <FileRow
        key={label}
        label={label}
        fileName={file?.name ?? "Not provided"}
        ext={file?.ext ?? "—"}
        action={
          url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              download={url.startsWith("data:") ? label : undefined}
              className={buttonClasses({ variant: "soft", size: "sm" })}
            >
              View
            </a>
          ) : null
        }
      />
    );
  });
}

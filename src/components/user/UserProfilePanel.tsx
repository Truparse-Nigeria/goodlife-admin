import { buttonClasses } from "@/components/ui/Button";
import { DetailsCard } from "@/components/ui/DetailsCard";
import type { KeyValueItem } from "@/types/common";

export type UserProfilePanelProps = {
  rows: KeyValueItem[];
  idUrl: string | null;
  signatureUrl: string | null;
};

function DocumentLink({ url, label }: { url: string | null; label: string }) {
  if (!url) return "Not provided";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download={url.startsWith("data:") ? label : undefined}
      className={buttonClasses({ variant: "link" })}
    >
      View
    </a>
  );
}

export function UserProfilePanel({ rows, idUrl, signatureUrl }: UserProfilePanelProps) {
  return (
    <DetailsCard
      title="Profile"
      items={[
        ...rows,
        { label: "Valid ID", value: <DocumentLink url={idUrl} label="Valid ID" /> },
        { label: "Signature", value: <DocumentLink url={signatureUrl} label="Signature" /> },
      ]}
    />
  );
}

import { DetailsCard } from "@/components/ui/DetailsCard";
import { DocumentViewer } from "@/components/ui/DocumentViewer";
import type { KeyValueItem } from "@/types/common";

export type UserProfilePanelProps = {
  rows: KeyValueItem[];
  idUrl: string | null;
  signatureUrl: string | null;
};

function DocumentLink({ url, label }: { url: string | null; label: string }) {
  if (!url) return "Not provided";
  return <DocumentViewer label={label} url={url} variant="link" />;
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

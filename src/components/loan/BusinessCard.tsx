import { Card } from "@/components/ui/Card";

export type BusinessCardProps = {
  name: string;
  /** e.g. "RC 1843221 · Logistics · Ikeja, Lagos" */
  detail: string;
};

export function BusinessCard({ name, detail }: BusinessCardProps) {
  return (
    <Card padding="md" className="flex flex-col gap-1">
      <div className="text-12 text-muted">Business attached</div>
      <div className="text-15 font-semibold">{name}</div>
      {detail && <div className="text-13 text-ink-soft">{detail}</div>}
    </Card>
  );
}

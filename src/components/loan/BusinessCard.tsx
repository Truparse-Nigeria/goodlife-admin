import { Card } from "@/components/ui/Card";
import type { Business } from "@/types/loan";

export type BusinessCardProps = {
  business: Business;
};

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card padding="md" className="flex flex-col gap-1">
      <div className="text-12 text-muted">Business attached</div>
      <div className="text-15 font-semibold">{business.name}</div>
      <div className="text-13 text-ink-soft">
        {business.rcNumber} · {business.address}
      </div>
    </Card>
  );
}

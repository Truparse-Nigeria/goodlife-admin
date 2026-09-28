import type { KeyValueItem } from "@/types/common";
import { Card } from "./Card";
import { CardTitle } from "./CardTitle";
import { KeyValueList } from "./KeyValueList";

export type DetailsCardProps = {
  title: string;
  items: KeyValueItem[];
};

/** Titled card of label / value rows. */
export function DetailsCard({ title, items }: DetailsCardProps) {
  return (
    <Card padding="md">
      <CardTitle className="mb-2.5">{title}</CardTitle>
      <KeyValueList items={items} />
    </Card>
  );
}

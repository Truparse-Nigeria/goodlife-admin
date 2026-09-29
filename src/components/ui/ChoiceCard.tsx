import { cn } from "@/lib/cn";

export type ChoiceCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
};

/** One option of a radio-style choice: a bordered card with a title and explanation. */
export function ChoiceCard({ title, description, selected, onSelect }: ChoiceCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col gap-1 rounded-md border px-3.5 py-3 text-left transition-colors",
        selected ? "border-brand bg-surface ring-1 ring-brand" : "border-border-input bg-transparent hover:bg-surface",
      )}
    >
      <span className="text-14 font-semibold text-ink">{title}</span>
      <span className="text-12 leading-normal text-ink-soft">{description}</span>
    </button>
  );
}

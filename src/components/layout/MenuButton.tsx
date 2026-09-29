import { cn } from "@/lib/cn";

export type MenuButtonProps = {
  open: boolean;
  /** id of the element the button shows and hides. */
  controls: string;
  onClick: () => void;
};

/** Hamburger that turns into a close mark while the menu is open. */
export function MenuButton({ open, controls, onClick }: MenuButtonProps) {
  const bar = "absolute left-0 h-0.5 w-5 rounded-full bg-on-brand transition-transform";
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-md hover:bg-on-brand/10"
    >
      <span aria-hidden className="relative block h-3.5 w-5">
        <span className={cn(bar, "top-0", open && "top-1.5 rotate-45")} />
        <span className={cn(bar, "top-1.5", open && "opacity-0")} />
        <span className={cn(bar, "top-3", open && "top-1.5 -rotate-45")} />
      </span>
    </button>
  );
}

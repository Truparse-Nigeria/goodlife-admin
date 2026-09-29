export type ToastProps = {
  message: string;
};

/** Presentational toast. Rendered by ToastProvider. */
export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 flex items-center gap-2.5 rounded-md bg-ink px-4.5 py-3 text-14 text-on-ink shadow-toast"
    >
      <span aria-hidden className="size-2 rounded-full bg-accent" />
      {message}
    </div>
  );
}

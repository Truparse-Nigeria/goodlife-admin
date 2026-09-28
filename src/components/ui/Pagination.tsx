import { ButtonLink } from "./ButtonLink";

export type PaginationProps = {
  page: number;
  totalPages: number;
  /** Link for a given page (keeps the rest of the URL state). */
  hrefFor: (page: number) => string;
};

/** Previous / next links with the current position. Hidden for a single page. */
export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-end gap-3 text-13 text-muted">
      <span>
        Page {page} of {totalPages}
      </span>
      {page > 1 && (
        <ButtonLink href={hrefFor(page - 1)} variant="secondary" size="md" scroll={false}>
          Previous
        </ButtonLink>
      )}
      {page < totalPages && (
        <ButtonLink href={hrefFor(page + 1)} variant="secondary" size="md" scroll={false}>
          Next
        </ButtonLink>
      )}
    </nav>
  );
}

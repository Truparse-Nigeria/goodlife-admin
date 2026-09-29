"use client";

import Image from "next/image";
import { useState } from "react";
import { fileFromUrl } from "@/lib/format";
import { Button, buttonClasses, type ButtonVariant } from "./Button";
import { Modal } from "./Modal";

export type DocumentViewerProps = {
  /** e.g. "Utility Bill"; the modal title. */
  label: string;
  url: string;
  /** Look of the trigger: `soft` in document lists, `link` inline in text. */
  variant?: Extract<ButtonVariant, "soft" | "link">;
};

type Kind = "image" | "pdf" | "other";

const IMAGE_TYPES = ["PNG", "JPG", "JPEG", "WEBP", "GIF", "SVG", "SVG+", "AVIF"];

function kindOf(url: string): Kind {
  if (url.startsWith("data:image/")) return "image";
  if (url.startsWith("data:application/pdf")) return "pdf";
  const { ext } = fileFromUrl(url);
  if (IMAGE_TYPES.includes(ext)) return "image";
  if (ext === "PDF") return "pdf";
  return "other";
}

/** "View" button that opens a document in a modal on the page, not a new tab. */
export function DocumentViewer({ label, url, variant = "soft" }: DocumentViewerProps) {
  const [open, setOpen] = useState(false);
  const kind = kindOf(url);
  const { name } = fileFromUrl(url);

  return (
    <>
      <Button variant={variant} size="sm" onClick={() => setOpen(true)}>
        View
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={label} subtitle={name} className="sm:max-w-5xl">
        {/* Only rendered while open, so documents load on demand. */}
        {open && (
          <div className="flex flex-col gap-3 px-6 pt-3 pb-5">
            <div className="relative h-(--viewer-height) overflow-hidden rounded-md border border-border bg-surface-sunken">
              {kind === "image" && (
                <Image src={url} alt={label} fill unoptimized sizes="100vw" className="object-contain" />
              )}
              {kind === "pdf" && <iframe src={url} title={label} className="size-full" />}
              {kind === "other" && (
                <div className="flex size-full items-center justify-center p-6 text-center text-14 text-muted">
                  This file type can’t be previewed here. Use “Open original” to see it.
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download={url.startsWith("data:") ? label : undefined}
                className={buttonClasses({ variant: "secondary", size: "md" })}
              >
                Open original
              </a>
              <Button size="md" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

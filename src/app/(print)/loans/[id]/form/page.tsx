import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoanForm } from "@/components/loan/LoanForm";
import { getLoanView } from "@/lib/loan-views";
import { requireAdmin } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/loans/[id]/form">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Loan form ${decodeURIComponent(id)}` };
}

/** Standalone printable page — no sidebar. */
export default async function LoanFormPage({ params }: PageProps<"/loans/[id]/form">) {
  await requireAdmin();
  const { id } = await params;
  const view = getLoanView(decodeURIComponent(id));
  if (!view) notFound();

  return (
    <div className="min-h-screen bg-surface">
      <LoanForm loan={view.loan} customer={view.customer} />
    </div>
  );
}

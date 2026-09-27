import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { PageTitle } from "@/components/ui/PageTitle";

export default function NotFound() {
  return (
    <div className="flex justify-center px-8 py-24">
      <Card padding="lg" className="flex max-w-auth flex-col items-start gap-3">
        <PageTitle size="sm">Not found</PageTitle>
        <p className="text-14 text-muted">That loan or user doesn’t exist, or the link is out of date.</p>
        <ButtonLink href="/dashboard" size="md">
          Back to dashboard
        </ButtonLink>
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { createLoan, searchCustomers } from "@/app/actions/loans";
import { getIndustriesApi, getStatesApi } from "@/api/loan";
import { getUserApi } from "@/api/user";
import { CreateLoanForm } from "@/components/loan/create/CreateLoanForm";
import { CustomerPicker } from "@/components/loan/create/CustomerPicker";
import { BackLink } from "@/components/ui/BackLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { initialLoanFormValues } from "@/lib/create-loan-form";
import { redirectIfUnauthorized, requireAdmin } from "@/lib/session";
import { fullName } from "@/lib/user-detail";

export const metadata: Metadata = { title: "Create loan · GoodLife Admin" };

const toOptions = (values: string[] = []) => values.map((v) => ({ value: v, label: v }));

/** /loans/new?customer=<userId> fills the form from that customer's profile. */
export default async function CreateLoanPage({ searchParams }: PageProps<"/loans/new">) {
  const { token } = await requireAdmin();
  const { customer: rawCustomer } = await searchParams;
  const customerId = typeof rawCustomer === "string" ? rawCustomer : undefined;

  const [states, industries, customer] = await Promise.all([
    getStatesApi(),
    getIndustriesApi(),
    customerId ? getUserApi(token, customerId) : undefined,
  ]);
  redirectIfUnauthorized(customer?.error);
  const profile = customer?.data?.profile ?? null;

  return (
    <div className="flex flex-col gap-5">
      <BackLink href="/loans">Loan applications</BackLink>
      <PageHeader
        title="Create loan"
        subtitle="Apply on a customer’s behalf. They get the same emails as when they apply themselves."
      />
      <CustomerPicker
        selected={profile && { id: profile.id, name: fullName(profile), email: profile.email }}
        searchAction={searchCustomers}
      />
      {customer?.error && (
        <p role="alert" className="text-13 text-danger">
          Couldn’t load that customer: {customer.error.message}
        </p>
      )}
      <CreateLoanForm
        // A different customer starts a fresh form.
        key={profile?.id ?? "new"}
        initialValues={initialLoanFormValues(profile)}
        existingCustomer={profile != null}
        states={toOptions(states.data)}
        industries={toOptions(industries.data)}
        createAction={createLoan}
      />
    </div>
  );
}

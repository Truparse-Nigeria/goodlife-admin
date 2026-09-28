import { admin as seedAdmin } from "@/data/admin";
import { customers as seedCustomers } from "@/data/customers";
import { loans as seedLoans } from "@/data/loans";
import type { Loan } from "@/types/loan";
import type { Admin, Customer } from "@/types/user";

/*
 * In-memory mock backend, seeded from src/data. Mutations persist until the
 * server restarts. This module is the single seam to swap for goodlife-api.
 * Kept on globalThis so dev hot-reloads don't reset it between requests.
 */
interface Store {
  loans: Loan[];
  customers: Customer[];
  admin: Admin;
}

const globalForStore = globalThis as typeof globalThis & { __goodlifeStore?: Store };

function store(): Store {
  globalForStore.__goodlifeStore ??= {
    loans: structuredClone(seedLoans),
    customers: structuredClone(seedCustomers),
    admin: structuredClone(seedAdmin),
  };
  return globalForStore.__goodlifeStore;
}

export function listLoans(): Loan[] {
  return store().loans;
}

export function findCustomer(id: string): Customer | undefined {
  return store().customers.find((c) => c.id === id);
}

export function getAdmin(): Admin {
  return store().admin;
}

export function updateAdmin(patch: Partial<Admin>): Admin {
  const s = store();
  s.admin = { ...s.admin, ...patch };
  return s.admin;
}

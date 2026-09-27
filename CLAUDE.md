@AGENTS.md

# goodlife-admin

## Stack

Next.js App Router, TypeScript, Tailwind. No CSS files except `src/app/globals.css`.

## Design source

The reference design comes from Claude Design via the `claude_design` MCP. Treat it as a visual spec only. Never paste its HTML/CSS/JS in directly; rebuild it idiomatically.

## Structure

- `src/app/` → routes and layouts only, kept thin
- `src/components/ui/` → primitives (Button, Card, Input, Badge, Table, Stat, etc.)
- `src/components/loan/` → domain components (LoanCard, RepaymentSchedule, LoanStatusBadge, etc.)
- `src/components/layout/` → Sidebar, Header, Container
- `src/components/user/` → customer/admin components (UserTable, ActivityTimeline, ProfileForm, etc.)
- `src/components/auth/` → sign-in components
- `src/app/actions/` → server actions; `src/lib/loan-store.ts` is the only data access seam (in-memory mock, swap for goodlife-api)
- `src/lib/` → utils (`cn` helper, currency/date formatters)
- `src/types/` → shared TypeScript types (Loan, Repayment, etc.)
- `src/api/` → axios client for goodlife-api (`callApi`, `HttpMethod`); response envelope types in `src/types/api.ts`
- `src/store/` → client auth state (`setLogout`)
- `src/data/` → mock data as typed objects, never hardcoded in JSX

## Rules

- Design tokens (colors, fonts, radii, shadows) live in `globals.css` / Tailwind theme. No raw hex values in components.
- Table column layouts are tokens too (`--table-<layout>-cols` / `-min` in `globals.css`); components pick one with `<Table layout="…">`. No arbitrary `[…]` Tailwind values.
- Shared patterns have primitives — use them rather than re-styling: `Identity` (avatar + name + detail), `PageTitle`, `CardTitle`, `Overline`, `KeyValueList items`.
- One component per file, named exports, typed props.
- Server Components by default; `"use client"` only where interaction requires it.
- Variants via props, not duplicated components.
- Repeated markup gets extracted into a component.
- Use `next/image` and `next/font`.
- Format money with a single formatter in `src/lib` (NGN by default).

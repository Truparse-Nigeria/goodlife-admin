import type { ReactNode } from "react";
import { Container } from "./Container";

export type AppShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

/** Sidebar (a top bar + drawer below `lg`) and an independently scrolling main column. */
export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden lg:flex-row">
      {sidebar}
      <main className="min-w-0 flex-1 overflow-auto bg-canvas">
        <Container>{children}</Container>
      </main>
    </div>
  );
}

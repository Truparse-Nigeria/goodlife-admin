import type { ReactNode } from "react";
import { Container } from "./Container";

export type AppShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

/** Fixed sidebar + independently scrolling main column. */
export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {sidebar}
      <main className="min-w-0 flex-1 overflow-auto bg-canvas">
        <Container>{children}</Container>
      </main>
    </div>
  );
}

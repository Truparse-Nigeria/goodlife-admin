"use client";

import { Button, type ButtonProps } from "./Button";

export type PrintButtonProps = Omit<ButtonProps, "onClick">;

export function PrintButton({ children = "Print", ...props }: PrintButtonProps) {
  return (
    <Button onClick={() => window.print()} {...props}>
      {children}
    </Button>
  );
}

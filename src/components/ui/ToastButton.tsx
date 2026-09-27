"use client";

import { Button, type ButtonProps } from "./Button";
import { useToast } from "./ToastProvider";

export type ToastButtonProps = Omit<ButtonProps, "onClick"> & {
  /** Message shown when clicked. */
  message: string;
};

/** Button whose only effect is a toast — used for mock actions (downloads). */
export function ToastButton({ message, ...props }: ToastButtonProps) {
  const { toast } = useToast();
  return <Button onClick={() => toast(message)} {...props} />;
}

"use client";

import { useState } from "react";
import { Input, type InputProps } from "./Input";

export type PasswordInputProps = Omit<InputProps, "type" | "suffix">;

/** Password field with a Show / Hide toggle. */
export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      suffix={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="cursor-pointer text-13 font-medium text-brand-strong hover:text-brand-strong hover:underline"
        >
          {visible ? "Hide" : "Show"}
        </button>
      }
    />
  );
}

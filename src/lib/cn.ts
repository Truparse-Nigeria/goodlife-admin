import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom theme keys so e.g. `text-13` is treated
// as a font size (not a color) and `rounded-segment` as a radius.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["10", "11", "12", "13", "14", "15", "16", "18", "19", "20", "22", "24", "26"],
      radius: ["segment"],
      shadow: ["elevated", "toast", "segment"],
      tracking: ["overline", "stat"],
      container: ["sidebar", "page", "form", "auth"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

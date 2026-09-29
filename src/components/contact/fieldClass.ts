import { cn } from "../../utils/cn";

export function getContactFieldClass(hasError: boolean, className?: string) {
  return cn(
    "w-full border border-border-subtle bg-bg-app p-3 text-sm text-text-main outline-none transition-colors placeholder-secondary focus:border-text-main focus-visible:ring-2 focus-visible:ring-text-main/15",
    hasError && "border-it-red focus:border-it-red focus-visible:ring-it-red/20",
    className,
  );
}

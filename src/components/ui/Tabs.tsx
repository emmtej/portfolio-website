import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const TabButton = forwardRef<HTMLButtonElement, {
  id: string;
  label: string;
  onClick: (id: string) => void;
  isActive: boolean;
}>(({
  id,
  label,
  onClick,
  isActive,
}, ref) => (
  <button
    ref={ref}
    id={`tab-${id}`}
    role="tab"
    aria-selected={isActive}
    aria-controls={`panel-${id}`}
    tabIndex={isActive ? 0 : -1}
    className={cn(
      "-mb-px border-b-2 py-4 text-sm transition-colors uppercase font-bold tracking-widest border-transparent text-text-muted/40 hover:text-text-main/80",
      "aria-selected:border-text-main aria-selected:text-text-main",
    )}
    onClick={() => onClick(id)}
  >
    {label}
  </button>
));

TabButton.displayName = "TabButton";

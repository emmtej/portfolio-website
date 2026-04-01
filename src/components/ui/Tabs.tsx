import { cn } from "../../utils/cn";

export const TabButton = ({
  id,
  label,
  onClick,
  isActive,
}: {
  id: string;
  label: string;
  onClick: (id: string) => void;
  isActive: boolean;
}) => (
  <button
    id={`tab-${id}`}
    role="tab"
    aria-selected={isActive}
    aria-controls={`panel-${id}`}
    className={cn(
      "-mb-px border-b-2 py-2 text-small transition-colors uppercase font-semibold tracking-wide border-transparent text-text-muted/60 hover:text-text-main",
      "aria-selected:border-text-main aria-selected:text-text-main",
    )}
    onClick={() => onClick(id)}
  >
    {label}
  </button>
);

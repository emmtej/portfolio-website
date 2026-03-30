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
    className={`-mb-px border-b-2 py-2 text-xs transition-colors uppercase font-semibold tracking-[0.1em] ${
      isActive
        ? "border-text-main text-text-main"
        : "border-transparent text-text-muted/60 hover:text-text-main"
    }`}
    onClick={() => onClick(id)}
  >
    {label}
  </button>
);

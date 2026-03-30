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
    className={`-mb-px border-b-2 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "border-black text-black"
        : "border-transparent text-gray-400 hover:text-gray-600"
    }`}
    onClick={() => onClick(id)}
  >
    {label}
  </button>
);

import { cn } from "../../utils/cn";

type RomeAvailabilityDotIndicatorProps = {
  available: boolean;
  className?: string;
};

/** Presentational pulse dot — no timer. Live updates come from `RomeAvailability` portal. */
export function RomeAvailabilityDotIndicator({
  available,
  className,
}: RomeAvailabilityDotIndicatorProps) {
  return (
    <div
      className={cn(
        "size-1.5 shrink-0 rounded-full transition-colors duration-normal",
        available
          ? "bg-it-green animate-rome-availability-pulse"
          : "bg-text-muted/20",
        className,
      )}
      aria-hidden="true"
    />
  );
}

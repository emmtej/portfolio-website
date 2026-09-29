import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

type RomeAvailabilityDotIndicatorProps = {
  available: boolean;
  className?: string;
};

/** Presentational pulse dot — live updates come from `RomeAvailability` portal. */
export function RomeAvailabilityDotIndicator({
  available,
  className,
}: RomeAvailabilityDotIndicatorProps) {
  if (!available) {
    return (
      <span
        className={cn("size-1.5 shrink-0 rounded-full bg-text-muted/20", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.span
      className={cn("size-1.5 shrink-0 rounded-full bg-it-green", className)}
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    />
  );
}

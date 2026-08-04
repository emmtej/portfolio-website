import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import {
  intlLocaleFromLanguage,
  useRomeAvailability,
} from "../../hooks/useRomeAvailability";

type RomeAvailabilityDotIndicatorProps = {
  available: boolean;
  className?: string;
};

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

type RomeAvailabilityDotProps = {
  className?: string;
};

export function RomeAvailabilityDot({ className }: RomeAvailabilityDotProps) {
  const { i18n } = useTranslation();
  const intlLocale = intlLocaleFromLanguage(i18n.language);
  const { available } = useRomeAvailability(intlLocale);

  return (
    <RomeAvailabilityDotIndicator available={available} className={className} />
  );
}

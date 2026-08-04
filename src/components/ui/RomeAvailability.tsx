import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import {
  intlLocaleFromLanguage,
  useRomeAvailability,
  type RomeAvailabilityState,
} from "../../hooks/useRomeAvailability";
import { MetaLabel } from "./Typography";
import { ChromeControl, ListRow } from "./ReactLayout";
import { RomeAvailabilityDotIndicator } from "./RomeAvailabilityDot";
import {
  buildRomeAvailabilityDisplay,
  type RomeAvailabilityDisplay,
} from "./rome-availability-display";

type RomeAvailabilityProps = {
  className?: string;
  variant?: "row" | "chrome";
};

function StatusPrefix({ emoji }: { emoji: RomeAvailabilityDisplay["statusEmoji"] }) {
  return (
    <MetaLabel size="tiny" className="text-it-green">
      [{emoji}]
    </MetaLabel>
  );
}

function LocalRangeLabel({
  localRange,
  className,
}: {
  localRange: string;
  className: string;
}) {
  return (
    <MetaLabel size="tiny" className={className}>
      {localRange}
    </MetaLabel>
  );
}

function RomeAvailabilityChrome({
  display,
  state,
  className,
}: {
  display: RomeAvailabilityDisplay;
  state: RomeAvailabilityState;
  className?: string;
}) {
  return (
    <ChromeControl
      className={cn("max-w-[calc(100vw-8.5rem)]", className)}
      aria-live="polite"
      aria-label={`${display.location} ${state.romeTime} ${display.statusLabel}`}
    >
      <StatusPrefix emoji={display.statusEmoji} />
      <span className="min-w-0 truncate">
        {display.location}
        <span className="text-border-subtle mx-1.5">·</span>
        {state.romeTime}
      </span>
      <span className="hidden shrink-0 text-text-muted sm:inline">
        <span className="text-border-subtle mx-1.5">·</span>
        {display.statusLabel}
      </span>
      {state.showLocalRange ? (
        <LocalRangeLabel
          localRange={state.localRange}
          className="hidden md:inline text-inactive shrink-0"
        />
      ) : null}
      <RomeAvailabilityDotIndicator available={state.available} />
    </ChromeControl>
  );
}

function RomeAvailabilityRow({
  display,
  state,
  className,
}: {
  display: RomeAvailabilityDisplay;
  state: RomeAvailabilityState;
  className?: string;
}) {
  const trailing = (
    <div className="flex items-center gap-4">
      {state.showLocalRange ? (
        <LocalRangeLabel
          localRange={state.localRange}
          className="text-inactive group-hover:text-secondary"
        />
      ) : null}
      <RomeAvailabilityDotIndicator available={state.available} />
    </div>
  );

  return (
    <ListRow
      prefix={<StatusPrefix emoji={display.statusEmoji} />}
      title={display.location}
      subtitle={display.subtitle}
      trailing={trailing}
      className={className}
    />
  );
}

export function RomeAvailability({
  className,
  variant = "row",
}: RomeAvailabilityProps) {
  const { t, i18n } = useTranslation();
  const intlLocale = intlLocaleFromLanguage(i18n.language);
  const state = useRomeAvailability(intlLocale);
  const display = buildRomeAvailabilityDisplay(t, state.available, state.romeTime);

  if (variant === "chrome") {
    return (
      <RomeAvailabilityChrome
        display={display}
        state={state}
        className={className}
      />
    );
  }

  return (
    <RomeAvailabilityRow
      display={display}
      state={state}
      className={className}
    />
  );
}

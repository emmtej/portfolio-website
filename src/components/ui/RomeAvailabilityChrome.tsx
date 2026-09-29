import { MetaLabel } from "./Typography";
import { ChromeControl } from "./ReactLayout";
import { RomeAvailabilityDotIndicator } from "./RomeAvailabilityDot";
import { cn } from "../../utils/cn";
import type { RomeAvailabilityState } from "../../hooks/useRomeAvailability";
import type { RomeAvailabilityDisplay } from "./rome-availability-display";

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

export function RomeAvailabilityChrome({
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
      className={cn("max-w-full", className)}
      aria-live="polite"
      aria-label={`${display.location} ${state.romeTime} ${display.statusLabel}`}
    >
      <StatusPrefix emoji={display.statusEmoji} />
      <span className="min-w-0 truncate">
        {display.location}
        <span className="text-border-subtle mx-1.5">·</span>
        {state.romeTime}
      </span>
      <span className="hidden shrink-0 text-text-secondary sm:inline">
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

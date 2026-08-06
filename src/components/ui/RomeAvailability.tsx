import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useState } from "react";
import { cn } from "../../utils/cn";
import {
  intlLocaleFromLanguage,
  useRomeAvailability,
  type RomeAvailabilityState,
} from "../../hooks/useRomeAvailability";
import { MetaLabel } from "./Typography";
import { ChromeControl } from "./ReactLayout";
import { ErrorBoundary } from "./ErrorBoundary";
import { RomeAvailabilityDotIndicator } from "./RomeAvailabilityDot";
import {
  buildRomeAvailabilityDisplay,
  type RomeAvailabilityDisplay,
} from "./rome-availability-display";
import { ROME_NAV_DOT_HOST_ID } from "./rome-availability-ids";

export { ROME_NAV_DOT_HOST_ID } from "./rome-availability-ids";

type RomeAvailabilityProps = {
  className?: string;
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

function RomeAvailabilityLive({ className }: RomeAvailabilityProps) {
  const { t, i18n } = useTranslation();
  const intlLocale = intlLocaleFromLanguage(i18n.language);
  const state = useRomeAvailability(intlLocale);
  const display = buildRomeAvailabilityDisplay(t, state.available, state.romeTime);
  const [navDotHost] = useState(() => {
    const host = document.getElementById(ROME_NAV_DOT_HOST_ID);
    if (!host) return null;
    // Drop SSR placeholder so the portal owns the host exclusively.
    host.replaceChildren();
    return host;
  });

  return (
    <>
      <RomeAvailabilityChrome
        display={display}
        state={state}
        className={className}
      />
      {navDotHost
        ? createPortal(
            <RomeAvailabilityDotIndicator available={state.available} />,
            navDotHost,
          )
        : null}
    </>
  );
}

function ChromeFallback() {
  return (
    <ChromeControl className="max-w-full text-inactive" aria-hidden="true">
      —
    </ChromeControl>
  );
}

export function RomeAvailability(props: RomeAvailabilityProps) {
  return (
    <ErrorBoundary fallback={<ChromeFallback />}>
      <RomeAvailabilityLive {...props} />
    </ErrorBoundary>
  );
}

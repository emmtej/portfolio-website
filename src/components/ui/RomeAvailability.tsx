import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import "../../i18n";
import {
  intlLocaleFromLanguage,
  useRomeAvailability,
} from "../../hooks/useRomeAvailability";
import { useRomeNavDotHost } from "../../hooks/useRomeNavDot";
import { ChromeControl } from "./ReactLayout";
import { ErrorBoundary } from "./ErrorBoundary";
import { RomeAvailabilityDotIndicator } from "./RomeAvailabilityDot";
import { buildRomeAvailabilityDisplay } from "./rome-availability-display";
import { RomeAvailabilityChrome } from "./RomeAvailabilityChrome";

type RomeAvailabilityProps = {
  className?: string;
};

function RomeAvailabilityLive({ className }: RomeAvailabilityProps) {
  const { t, i18n } = useTranslation();
  const intlLocale = intlLocaleFromLanguage(i18n.language);
  const state = useRomeAvailability(intlLocale);
  const display = buildRomeAvailabilityDisplay(t, state.available, state.romeTime);
  const navDotHost = useRomeNavDotHost();

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

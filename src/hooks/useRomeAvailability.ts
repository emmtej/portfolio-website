import { useEffect, useMemo, useState } from "react";
import {
  formatCountdown,
  formatNextRome8amLocal,
  formatRomeBusinessWindowLocal,
  getMsUntilNextRome8am,
  isRomeAvailableHours,
  formatRomeTime,
  getRomeSkyPhase,
  getRomeWorkdayProgress,
} from "../utils/rome-sky-phase";
import type { RomeSkyPhase } from "../utils/rome-sky-phase";

/** Map app i18n language to `Intl` locale for time formatting. */
export function intlLocaleFromLanguage(i18nLanguage: string): string {
  return i18nLanguage.startsWith("it") ? "it-IT" : "en-GB";
}

export type RomeAvailabilityState = {
  /** Current instant used for all calculations (updates on the timer). */
  instant: Date;
  /** Whether current time falls in 08:00–20:00 Europe/Rome. */
  available: boolean;
  /** Local time range equivalent to today's Rome 08:00–20:00. */
  localRange: string;
  /** Fixed Rome schedule label, e.g. `08:00–20:00`. */
  romeRange: string;
  /** Next moment of Rome 08:00, formatted in the user's local timezone. */
  localNext: string;
  /** Human-readable countdown until next Rome 08:00. */
  countdown: string;
  /** Current time in Rome. */
  romeTime: string;
  /** Current sky phase in Rome. */
  skyPhase: RomeSkyPhase;
  /** Progress through the workday (if available) or until it starts. */
  progress: number;
};

/**
 * Live Rome availability window (Europe/Rome) with times shown in the user's
 * local timezone. Timer ticks every 1s when unavailable, every 60s when available.
 */
export function useRomeAvailability(intlLocale: string): RomeAvailabilityState {
  const [instant, setInstant] = useState(() => new Date());
  const available = isRomeAvailableHours(instant);

  useEffect(() => {
    const tick = () => setInstant(new Date());
    tick();
    const ms = available ? 60_000 : 1_000;
    const id = window.setInterval(tick, ms);
    return () => window.clearInterval(id);
  }, [available]);

  return useMemo(() => {
    const { localRange, romeRange } = formatRomeBusinessWindowLocal(
      instant,
      intlLocale,
    );
    const localNext = formatNextRome8amLocal(instant, intlLocale);
    const countdown = formatCountdown(getMsUntilNextRome8am(instant));
    const romeTime = formatRomeTime(instant);
    const skyPhase = getRomeSkyPhase(instant);
    const progress = getRomeWorkdayProgress(instant);

    return {
      instant,
      available,
      localRange,
      romeRange,
      localNext,
      countdown,
      romeTime,
      skyPhase,
      progress,
    };
  }, [instant, available, intlLocale]);
}

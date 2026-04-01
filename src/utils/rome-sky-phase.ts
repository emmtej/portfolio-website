import { fromZonedTime } from "date-fns-tz/fromZonedTime";

export const ROME_TZ = "Europe/Rome";

const ROME_DAY_START_MIN = 8 * 60;
const ROME_DAY_END_MIN = 20 * 60;

/** Minutes since local midnight in Rome (0–1439). */
export function getRomeMinutesSinceMidnight(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ROME_TZ,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(instant);
  const h = Number(parts.find((p) => p.type === "hour")!.value);
  const m = Number(parts.find((p) => p.type === "minute")!.value);
  return h * 60 + m;
}

/** 08:00–20:00 in Europe/Rome (20:00 exclusive). */
export function isRomeAvailableHours(instant: Date): boolean {
  const mins = getRomeMinutesSinceMidnight(instant);
  return mins >= ROME_DAY_START_MIN && mins < ROME_DAY_END_MIN;
}

/** Progress of the workday (0–1) if within 08:00–20:00, otherwise progress until 08:00. */
export function getRomeWorkdayProgress(instant: Date): number {
  const mins = getRomeMinutesSinceMidnight(instant);
  if (isRomeAvailableHours(instant)) {
    return (mins - ROME_DAY_START_MIN) / (ROME_DAY_END_MIN - ROME_DAY_START_MIN);
  }
  
  // Progress from 20:00 (yesterday or today) until 08:00 (today or tomorrow)
  const minsSince20 = mins >= ROME_DAY_END_MIN ? mins - ROME_DAY_END_MIN : mins + (1440 - ROME_DAY_END_MIN);
  return minsSince20 / (24 * 60 - (ROME_DAY_END_MIN - ROME_DAY_START_MIN));
}

export type RomeSkyPhase = "dawn" | "day" | "dusk" | "night";

export function getRomeSkyPhase(instant: Date): RomeSkyPhase {
  const mins = getRomeMinutesSinceMidnight(instant);
  if (mins >= 360 && mins < 480) return "dawn"; // 06:00 - 08:00
  if (mins >= 480 && mins < 1080) return "day"; // 08:00 - 18:00
  if (mins >= 1080 && mins < 1260) return "dusk"; // 18:00 - 21:00
  return "night";
}

/** Current Rome time as HH:mm. */
export function formatRomeTime(instant: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ROME_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(instant);
}

function nextRomeCalendarYmd(ymd: string): string {
  const dayFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  let t = fromZonedTime(`${ymd}T12:00:00`, ROME_TZ).getTime();
  for (let step = 0; step < 30; step++) {
    t += 3600000;
    const next = dayFmt.format(new Date(t));
    if (next !== ymd) {
      return next;
    }
  }
  throw new Error("nextRomeCalendarYmd: could not resolve next calendar day");
}

/** Next moment when the clock shows 08:00 in Europe/Rome (same logic as countdown target). */
export function getNextRome8amInstant(instant: Date): Date {
  const ymd = instant.toLocaleDateString("en-CA", { timeZone: ROME_TZ });
  const today8 = fromZonedTime(`${ymd}T08:00:00`, ROME_TZ);
  const t = instant.getTime();
  if (t < today8.getTime()) {
    return today8;
  }
  const ymdNext = nextRomeCalendarYmd(ymd);
  return fromZonedTime(`${ymdNext}T08:00:00`, ROME_TZ);
}

/** Milliseconds from `instant` until the next 08:00 in Rome. */
export function getMsUntilNextRome8am(instant: Date): number {
  const next = getNextRome8amInstant(instant);
  return next.getTime() - instant.getTime();
}

function localCalendarYmd(d: Date): string {
  return d.toLocaleDateString("en-CA");
}

function formatLocalTimeRange(start: Date, end: Date, locale: string): string {
  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  if (localCalendarYmd(start) === localCalendarYmd(end)) {
    return `${timeFmt.format(start)}–${timeFmt.format(end)}`;
  }
  const dateTimeFmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  return `${dateTimeFmt.format(start)} – ${dateTimeFmt.format(end)}`;
}

/**
 * Rome schedule 08:00–20:00 (Europe/Rome) expressed in the user's local timezone
 * for the current Rome calendar day, plus the fixed Rome label for reference.
 */
export function formatRomeBusinessWindowLocal(
  reference: Date,
  locale: string,
): { localRange: string; romeRange: string } {
  const ymd = reference.toLocaleDateString("en-CA", { timeZone: ROME_TZ });
  const start = fromZonedTime(`${ymd}T08:00:00`, ROME_TZ);
  const end = fromZonedTime(`${ymd}T20:00:00`, ROME_TZ);
  return {
    localRange: formatLocalTimeRange(start, end, locale),
    romeRange: "08:00–20:00",
  };
}

/** Next Rome 08:00 as a short string in the user's local timezone. */
export function formatNextRome8amLocal(reference: Date, locale: string): string {
  const next = getNextRome8amInstant(reference);
  if (localCalendarYmd(reference) === localCalendarYmd(next)) {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(next);
  }
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(next);
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

export function getRomeAvailabilitySnapshot(instant: Date): {
  available: boolean;
  countdownMs: number | null;
} {
  const available = isRomeAvailableHours(instant);
  return {
    available,
    countdownMs: available ? null : getMsUntilNextRome8am(instant),
  };
}

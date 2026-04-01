import { describe, expect, it } from "vitest";
import {
  formatCountdown,
  formatRomeBusinessWindowLocal,
  getMsUntilNextRome8am,
  getNextRome8amInstant,
  getRomeAvailabilitySnapshot,
  isRomeAvailableHours,
} from "./rome-sky-phase";

describe("isRomeAvailableHours", () => {
  it("is true for 12:00 Rome on a fixed instant", () => {
    const instant = new Date("2026-06-15T10:00:00.000Z");
    expect(isRomeAvailableHours(instant)).toBe(true);
  });

  it("is false before 08:00 Rome", () => {
    const instant = new Date("2026-06-15T05:00:00.000Z");
    expect(isRomeAvailableHours(instant)).toBe(false);
  });

  it("is false from 20:00 Rome onward", () => {
    const instant = new Date("2026-06-15T18:05:00.000Z");
    expect(isRomeAvailableHours(instant)).toBe(false);
  });
});

describe("getRomeAvailabilitySnapshot", () => {
  it("returns available with no countdown during working hours", () => {
    const instant = new Date("2026-06-15T10:00:00.000Z");
    expect(getRomeAvailabilitySnapshot(instant)).toEqual({
      available: true,
      countdownMs: null,
    });
  });

  it("returns countdown when outside working hours", () => {
    const instant = new Date("2026-06-15T05:00:00.000Z");
    const snap = getRomeAvailabilitySnapshot(instant);
    expect(snap.available).toBe(false);
    expect(snap.countdownMs).toBeGreaterThan(0);
  });
});

describe("formatCountdown", () => {
  it("formats hours and minutes", () => {
    expect(formatCountdown(3 * 3600000 + 5 * 60000)).toBe("3h 5m");
  });
});

describe("getMsUntilNextRome8am", () => {
  it("returns positive ms before 08:00 Rome", () => {
    const instant = new Date("2026-06-15T05:00:00.000Z");
    expect(getMsUntilNextRome8am(instant)).toBeGreaterThan(0);
  });

  it("matches delta to getNextRome8amInstant", () => {
    const instant = new Date("2026-06-15T05:00:00.000Z");
    const next = getNextRome8amInstant(instant);
    expect(getMsUntilNextRome8am(instant)).toBe(next.getTime() - instant.getTime());
  });
});

describe("formatRomeBusinessWindowLocal", () => {
  it("keeps Rome reference range for the schedule", () => {
    const ref = new Date("2026-06-15T12:00:00.000Z");
    const { romeRange } = formatRomeBusinessWindowLocal(ref, "en-GB");
    expect(romeRange).toBe("08:00–20:00");
  });
});

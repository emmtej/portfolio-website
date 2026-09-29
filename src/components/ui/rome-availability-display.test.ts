import { describe, it, expect } from "vitest";
import { buildRomeAvailabilityDisplay } from "./rome-availability-display";

const t = (key: string, fallback?: string) => {
  const map: Record<string, string> = {
    "contact.availability.location": "Italy",
    "contact.availability.available_short": "Available",
    "contact.availability.away_short": "Away",
  };
  return map[key] ?? fallback ?? key;
};

describe("buildRomeAvailabilityDisplay", () => {
  it("builds available display", () => {
    expect(buildRomeAvailabilityDisplay(t, true, "14:30")).toEqual({
      location: "Italy",
      statusLabel: "Available",
      statusEmoji: "☀️",
      subtitle: "14:30 • Available",
    });
  });

  it("builds away display", () => {
    expect(buildRomeAvailabilityDisplay(t, false, "02:15")).toEqual({
      location: "Italy",
      statusLabel: "Away",
      statusEmoji: "🌙",
      subtitle: "02:15 • Away",
    });
  });
});

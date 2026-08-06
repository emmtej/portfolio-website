import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import {
  RomeAvailability,
} from "./RomeAvailability";
import { ROME_NAV_DOT_HOST_ID } from "./rome-availability-ids";

const setIntervalSpy = vi.spyOn(window, "setInterval");

vi.mock("../../hooks/useRomeAvailability", () => ({
  intlLocaleFromLanguage: () => "en-GB",
  useRomeAvailability: () => ({
    instant: new Date("2026-06-15T12:00:00Z"),
    available: true,
    localRange: "08:00–20:00 local",
    showLocalRange: true,
    romeRange: "08:00–20:00",
    localNext: "Tomorrow 08:00",
    countdown: "2h",
    romeTime: "14:00",
    skyPhase: "day",
    progress: 0.5,
  }),
}));

beforeEach(() => {
  setIntervalSpy.mockClear();
  const host = document.createElement("span");
  host.id = ROME_NAV_DOT_HOST_ID;
  document.body.appendChild(host);
});

afterEach(() => {
  cleanup();
  document.getElementById(ROME_NAV_DOT_HOST_ID)?.remove();
});

describe("RomeAvailability", () => {
  it("renders chrome availability", () => {
    render(<RomeAvailability />);
    expect(screen.getByText(/Italy/)).toBeTruthy();
    expect(screen.getByText(/14:00/)).toBeTruthy();
    expect(screen.getByText(/08:00–20:00 local/)).toBeTruthy();
  });

  it("portals the nav dot into the host without a second island", async () => {
    render(<RomeAvailability />);
    const host = document.getElementById(ROME_NAV_DOT_HOST_ID);
    expect(host).toBeTruthy();
    await waitFor(() => {
      expect(host?.querySelector("[aria-hidden=\"true\"]")).toBeTruthy();
    });
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { RomeAvailability } from "./RomeAvailability";

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

afterEach(() => {
  cleanup();
});

describe("RomeAvailability", () => {
  it("renders chrome variant", () => {
    render(<RomeAvailability variant="chrome" />);
    expect(screen.getByText(/Italy/)).toBeTruthy();
    expect(screen.getByText(/14:00/)).toBeTruthy();
    expect(screen.getByText(/08:00–20:00 local/)).toBeTruthy();
  });

  it("renders row variant", () => {
    render(<RomeAvailability variant="row" />);
    expect(screen.getByText("Italy")).toBeTruthy();
    expect(screen.getByText("14:00 • Available")).toBeTruthy();
  });
});

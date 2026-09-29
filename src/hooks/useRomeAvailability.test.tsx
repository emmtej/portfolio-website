import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useRomeAvailability } from "./useRomeAvailability";

function Probe() {
  useRomeAvailability("en-GB");
  return null;
}

describe("useRomeAvailability", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("starts a single interval timer", () => {
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    render(<Probe />);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
  });
});

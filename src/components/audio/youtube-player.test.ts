import { describe, it, expect } from "vitest";
import {
  buildPlayerCommand,
  isPlayingState,
  parseYouTubeInfoDeliveryState,
} from "./youtube-player";

describe("parseYouTubeInfoDeliveryState", () => {
  it("returns playing for playerState 1", () => {
    expect(
      parseYouTubeInfoDeliveryState({
        event: "infoDelivery",
        info: { playerState: 1 },
      }),
    ).toBe(1);
  });

  it("returns paused for playerState 2", () => {
    expect(
      parseYouTubeInfoDeliveryState({
        event: "infoDelivery",
        info: { playerState: 2 },
      }),
    ).toBe(2);
  });

  it("returns ended for playerState 0", () => {
    expect(
      parseYouTubeInfoDeliveryState({
        event: "infoDelivery",
        info: { playerState: 0 },
      }),
    ).toBe(0);
  });

  it("returns undefined for non-infoDelivery events", () => {
    expect(parseYouTubeInfoDeliveryState({ event: "command" })).toBeUndefined();
  });

  it("returns undefined for invalid payloads", () => {
    expect(parseYouTubeInfoDeliveryState(null)).toBeUndefined();
    expect(parseYouTubeInfoDeliveryState("bad")).toBeUndefined();
  });
});

describe("isPlayingState", () => {
  it("maps YouTube states to playing boolean", () => {
    expect(isPlayingState(1)).toBe(true);
    expect(isPlayingState(2)).toBe(false);
    expect(isPlayingState(0)).toBe(false);
    expect(isPlayingState(undefined)).toBeUndefined();
  });
});

describe("buildPlayerCommand", () => {
  it("serializes play and pause commands", () => {
    expect(buildPlayerCommand("playVideo")).toBe(
      JSON.stringify({ event: "command", func: "playVideo", args: "" }),
    );
    expect(buildPlayerCommand("pauseVideo")).toBe(
      JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
    );
  });
});

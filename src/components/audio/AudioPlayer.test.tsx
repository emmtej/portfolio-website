import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { AudioPlayer } from "./AudioPlayer";
import { YOUTUBE_NOCOOKIE_ORIGIN } from "./youtube-player";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const labels = {
  playLabel: "Play audio",
  pauseLabel: "Pause audio",
  iframeTitle: "Demo track",
};

describe("AudioPlayer", () => {
  it("shows play label before interaction", () => {
    render(<AudioPlayer {...labels} />);
    expect(screen.getByRole("button", { name: labels.playLabel })).toBeTruthy();
  });

  it("switches to pause after first click", () => {
    render(<AudioPlayer {...labels} />);
    fireEvent.click(screen.getByRole("button", { name: labels.playLabel }));
    expect(screen.getByRole("button", { name: labels.pauseLabel })).toBeTruthy();
  });

  it("updates playing state from YouTube postMessage", () => {
    render(<AudioPlayer {...labels} />);
    fireEvent.click(screen.getByRole("button", { name: labels.playLabel }));

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: YOUTUBE_NOCOOKIE_ORIGIN,
          data: JSON.stringify({
            event: "infoDelivery",
            info: { playerState: 2 },
          }),
        }),
      );
    });

    expect(screen.getByRole("button", { name: labels.playLabel })).toBeTruthy();
  });

  it("ignores messages from other origins", () => {
    render(<AudioPlayer {...labels} />);

    window.dispatchEvent(
      new MessageEvent("message", {
        origin: "https://evil.example",
        data: JSON.stringify({
          event: "infoDelivery",
          info: { playerState: 1 },
        }),
      }),
    );

    expect(screen.getByRole("button", { name: labels.playLabel })).toBeTruthy();
  });
});

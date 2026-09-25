import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { TAB_ROUTE_EVENT } from "../tab-shell";
import { AudioPlayer } from "./AudioPlayer";
import { buildPlayerCommand, YOUTUBE_NOCOOKIE_ORIGIN } from "./youtube-player";

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

  it("mounts a paused iframe and sends playVideo on the first click", () => {
    const { container } = render(<AudioPlayer {...labels} />);
    const iframe = container.querySelector("iframe")!;
    const url = new URL(iframe.src);
    expect(url.origin).toBe(YOUTUBE_NOCOOKIE_ORIGIN);
    expect(url.searchParams.has("autoplay")).toBe(false);
    expect(url.searchParams.has("controls")).toBe(false);
    const postMessage = vi.spyOn(iframe.contentWindow!, "postMessage");
    fireEvent.click(screen.getByRole("button", { name: labels.playLabel }));
    expect(screen.getByRole("button", { name: labels.pauseLabel })).toBeTruthy();
    expect(postMessage).toHaveBeenCalledWith(
      buildPlayerCommand("playVideo"),
      YOUTUBE_NOCOOKIE_ORIGIN,
    );
  });

  it("updates playing state from YouTube postMessage", () => {
    const { container } = render(<AudioPlayer {...labels} />);
    fireEvent.click(screen.getByRole("button", { name: labels.playLabel }));

    const iframe = container.querySelector("iframe");
    const contentWindow = {} as Window;
    Object.defineProperty(iframe, "contentWindow", {
      configurable: true,
      value: contentWindow,
    });

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: YOUTUBE_NOCOOKIE_ORIGIN,
          source: contentWindow,
          data: JSON.stringify({
            event: "infoDelivery",
            info: { playerState: 2 },
          }),
        }),
      );
    });

    expect(screen.getByRole("button", { name: labels.playLabel })).toBeTruthy();
  });

  it("ignores messages from the nocookie origin without the player frame source", () => {
    render(<AudioPlayer {...labels} />);
    fireEvent.click(screen.getByRole("button", { name: labels.playLabel }));

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: YOUTUBE_NOCOOKIE_ORIGIN,
          source: {} as Window,
          data: JSON.stringify({
            event: "infoDelivery",
            info: { playerState: 2 },
          }),
        }),
      );
    });

    expect(screen.getByRole("button", { name: labels.pauseLabel })).toBeTruthy();
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

  it("pauses on leaving audio and ignores a late play message", () => {
    const { container } = render(<AudioPlayer {...labels} />);
    fireEvent.click(screen.getByRole("button", { name: labels.playLabel }));

    const iframe = container.querySelector("iframe");
    const postMessage = vi.fn();
    const contentWindow = { postMessage } as unknown as Window;
    Object.defineProperty(iframe, "contentWindow", {
      configurable: true,
      value: contentWindow,
    });

    act(() => {
      window.dispatchEvent(
        new CustomEvent(TAB_ROUTE_EVENT, { detail: { from: "audio", to: "about" } }),
      );
    });

    expect(postMessage).toHaveBeenCalledWith(
      buildPlayerCommand("pauseVideo"),
      YOUTUBE_NOCOOKIE_ORIGIN,
    );
    expect(screen.getByRole("button", { name: labels.playLabel })).toBeTruthy();
    expect(container.querySelector("iframe")).toBeTruthy();

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: YOUTUBE_NOCOOKIE_ORIGIN,
          source: contentWindow,
          data: JSON.stringify({
            event: "infoDelivery",
            info: { playerState: 1 },
          }),
        }),
      );
    });

    expect(screen.getByRole("button", { name: labels.playLabel })).toBeTruthy();
    expect(postMessage).toHaveBeenCalledTimes(2);
  });

  it("pauses a player that becomes ready after leaving, then resumes explicitly", () => {
    const { container } = render(<AudioPlayer {...labels} />);
    fireEvent.click(screen.getByRole("button", { name: labels.playLabel }));

    act(() => {
      window.dispatchEvent(
        new CustomEvent(TAB_ROUTE_EVENT, { detail: { from: "audio", to: "contact" } }),
      );
    });

    const iframe = container.querySelector("iframe");
    const postMessage = vi.fn();
    Object.defineProperty(iframe, "contentWindow", {
      configurable: true,
      value: { postMessage },
    });
    fireEvent.load(iframe as HTMLIFrameElement);

    expect(postMessage).toHaveBeenCalledWith(
      buildPlayerCommand("pauseVideo"),
      YOUTUBE_NOCOOKIE_ORIGIN,
    );

    fireEvent.click(screen.getByRole("button", { name: labels.playLabel }));
    expect(postMessage).toHaveBeenCalledWith(
      buildPlayerCommand("playVideo"),
      YOUTUBE_NOCOOKIE_ORIGIN,
    );
    expect(screen.getByRole("button", { name: labels.pauseLabel })).toBeTruthy();
  });
});

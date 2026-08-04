export const YOUTUBE_NOCOOKIE_ORIGIN = "https://www.youtube-nocookie.com" as const;

/** YouTube IFrame API playerState: 0 ended, 1 playing, 2 paused */
export type YouTubePlayerState = 0 | 1 | 2;

export function parseYouTubeInfoDeliveryState(raw: unknown): YouTubePlayerState | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const event = (raw as { event?: unknown }).event;
  if (event !== "infoDelivery") return undefined;
  const state = (raw as { info?: { playerState?: unknown } }).info?.playerState;
  if (state === 1 || state === 2 || state === 0) return state;
  return undefined;
}

export function isPlayingState(state: YouTubePlayerState | undefined): boolean | undefined {
  if (state === undefined) return undefined;
  return state === 1;
}

export function buildPlayerCommand(func: "playVideo" | "pauseVideo"): string {
  return JSON.stringify({ event: "command", func, args: "" });
}

import { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import {
  YOUTUBE_NOCOOKIE_ORIGIN,
  buildPlayerCommand,
  isPlayingState,
  parseYouTubeInfoDeliveryState,
} from "./youtube-player";

export function AudioPlayer({ playLabel, pauseLabel, iframeTitle }: { playLabel: string; pauseLabel: string; iframeTitle: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== YOUTUBE_NOCOOKIE_ORIGIN) return;

      try {
        const state = parseYouTubeInfoDeliveryState(JSON.parse(event.data));
        const playing = isPlayingState(state);
        if (playing !== undefined) setIsPlaying(playing);
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage, { passive: true });
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const togglePlay = () => {
    if (!showIframe) {
      setShowIframe(true);
      setIsPlaying(true);
      return;
    }

    if (!iframeRef.current) return;

    const command = isPlaying ? "pauseVideo" : "playVideo";
    iframeRef.current.contentWindow?.postMessage(
      buildPlayerCommand(command),
      YOUTUBE_NOCOOKIE_ORIGIN,
    );
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="group relative aspect-video w-full min-h-48 overflow-hidden border border-border-subtle bg-black/5 sm:min-h-0">
      {showIframe ? (
        <iframe
          ref={iframeRef}
          className="pointer-events-none h-full w-full scale-[1.01]"
          src={`${YOUTUBE_NOCOOKIE_ORIGIN}/embed/9AVBGNRMMZM?enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&autoplay=1`}
          title={iframeTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ backgroundImage: `url('https://img.youtube.com/vi/9AVBGNRMMZM/maxresdefault.jpg')` }}
        />
      )}

      <button
        type="button"
        onClick={togglePlay}
        className="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center bg-black/20 transition-colors duration-300 hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-text-main/30"
        aria-label={isPlaying ? pauseLabel : playLabel}
      >
        <div
          className={cn(
            "flex items-center justify-center transition-all duration-300",
            "h-14 w-14 sm:h-20 sm:w-20",
            isPlaying
              ? "scale-90 bg-white/10 opacity-0 backdrop-blur-sm group-hover:scale-100 group-hover:opacity-100"
              : "scale-100 bg-white/20 opacity-90 backdrop-blur-sm group-hover:scale-105 group-hover:opacity-100",
          )}
        >
          {isPlaying ? (
            <svg className="h-8 w-8 text-white sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="h-8 w-8 translate-x-0.5 text-white sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}

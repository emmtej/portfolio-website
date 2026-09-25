import { useEffect, useRef, useState } from "react";
import { TAB_ROUTE_EVENT, type TabRouteDetail } from "../components/tab-shell";
import {
  YOUTUBE_NOCOOKIE_ORIGIN,
  buildPlayerCommand,
  isPlayingState,
  parseYouTubeInfoDeliveryState,
} from "../components/audio/youtube-player";

export function useAudioControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const suppressPlaybackRef = useRef(false);

  const sendCommand = (func: "playVideo" | "pauseVideo") => {
    iframeRef.current?.contentWindow?.postMessage(
      buildPlayerCommand(func),
      YOUTUBE_NOCOOKIE_ORIGIN,
    );
  };


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== YOUTUBE_NOCOOKIE_ORIGIN) {
        return;
      }

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      try {
        const state = parseYouTubeInfoDeliveryState(JSON.parse(event.data));
        if (suppressPlaybackRef.current) {
          if (isPlayingState(state) === true) {
            iframeRef.current?.contentWindow?.postMessage(
              buildPlayerCommand("pauseVideo"),
              YOUTUBE_NOCOOKIE_ORIGIN,
            );
          }
          setIsPlaying(false);
          return;
        }

        const playing = isPlayingState(state);
        if (playing !== undefined) {
          setIsPlaying(() => playing);
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage, { passive: true });
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const onRoute = (event: Event) => {
      const detail = (event as CustomEvent<TabRouteDetail>).detail;
      if (detail.from !== "audio" || detail.to === "audio") return;
      suppressPlaybackRef.current = true;
      iframeRef.current?.contentWindow?.postMessage(
        buildPlayerCommand("pauseVideo"),
        YOUTUBE_NOCOOKIE_ORIGIN,
      );
      setIsPlaying(false);
    };

    window.addEventListener(TAB_ROUTE_EVENT, onRoute);
    return () => window.removeEventListener(TAB_ROUTE_EVENT, onRoute);
  }, []);

  const onIframeLoad = () => {
    if (suppressPlaybackRef.current) sendCommand("pauseVideo");
  };

  const togglePlay = () => {
    if (suppressPlaybackRef.current) {
      suppressPlaybackRef.current = false;
      sendCommand("playVideo");
      setIsPlaying(true);
      return;
    }

    if (!iframeRef.current) {
      return;
    }

    const command = isPlaying ? "pauseVideo" : "playVideo";
    sendCommand(command);
    setIsPlaying((current) => !current);
  };

  return {
    iframeRef,
    isPlaying,
    togglePlay,
    onIframeLoad,
  };
}

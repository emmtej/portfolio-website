import { useEffect, useRef, useState } from "react";
import {
  YOUTUBE_NOCOOKIE_ORIGIN,
  buildPlayerCommand,
  isPlayingState,
  parseYouTubeInfoDeliveryState,
} from "../components/audio/youtube-player";

export function useAudioControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const togglePlay = () => {
    if (!showIframe) {
      setShowIframe(true);
      setIsPlaying(true);
      return;
    }

    if (!iframeRef.current) {
      return;
    }

    const command = isPlaying ? "pauseVideo" : "playVideo";
    iframeRef.current.contentWindow?.postMessage(
      buildPlayerCommand(command),
      YOUTUBE_NOCOOKIE_ORIGIN,
    );
    setIsPlaying((current) => !current);
  };

  return {
    iframeRef,
    isPlaying,
    showIframe,
    togglePlay,
  };
}

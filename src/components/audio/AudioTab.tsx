import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { Text, Title } from "../ui/Text";

const audioSoftware = ["iZotope RX", "Reaper", "DaVinci Resolve"];

export function AudioTab() {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube-nocookie.com") return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === "infoDelivery" && data.info && data.info.playerState !== undefined) {
          const state = data.info.playerState;
          // 1 is playing, 2 is paused, 0 is ended
          if (state === 1) setIsPlaying(true);
          else if (state === 2 || state === 0) setIsPlaying(false);
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const togglePlay = () => {
    if (!iframeRef.current) return;

    const command = isPlaying ? "pauseVideo" : "playVideo";
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: "" }),
      "https://www.youtube-nocookie.com"
    );
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <Text>{t("audio.intro")}</Text>
      </section>

      {/* Software Expertise */}
      <section className="space-y-8">
        <Title>{t("audio.tools_title")}</Title>
        <div className="flex flex-wrap gap-3">
          {audioSoftware.map((software) => (
            <span
              key={software}
              className="text-xs md:text-sm font-bold px-4 py-2 bg-border-subtle text-text-muted/80 uppercase tracking-widest hover:bg-text-main/5 hover:text-text-main/60 transition-colors duration-300"
            >
              {software}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex flex-col gap-4 max-w-4xl">
          <Title>{t("audio.restoration_title")}</Title>
          <Text>{t("audio.restoration_desc")}</Text>
        </div>

        <div className="max-w-4xl">
          <div className="group relative aspect-video w-full overflow-hidden border border-text-main/10 bg-black/5 shadow-2xl shadow-text-main/[0.01] transition-all duration-500 hover:border-text-main/20 hover:shadow-text-main/[0.04]">
            <iframe
              ref={iframeRef}
              className="w-full h-full pointer-events-none scale-[1.01]"
              src="https://www.youtube-nocookie.com/embed/9AVBGNRMMZM?enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1"
              title={t("audio.iframe_title")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>

            {/* Play/Pause Overlay */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300 cursor-pointer"
              aria-label={isPlaying ? t("audio.pause") : t("audio.play")}
            >
              {isPlaying ? (
                <div className="w-20 h-20 flex items-center justify-center bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                </div>
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-white/20 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-all duration-300 scale-100 group-hover:scale-110 shadow-xl">
                  <svg
                    className="w-10 h-10 text-white translate-x-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

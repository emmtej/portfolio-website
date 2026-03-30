const audioSoftware = ["iZotope RX", "Reaper", "DaVinci Resolve"];

export function AudioTab() {
  return (
    <div className="space-y-12">
      <section className="max-w-2xl">
        <p className="text-[15px] text-text-main/80 leading-relaxed tracking-tight">
          Specializing in audio restoration, dialogue editing, and
          post-production for digital media. I focus on achieving professional
          loudness standards and crystal-clear clarity for voice actors.
        </p>
      </section>

      {/* Software Expertise */}
      <section className="space-y-4">
        <h2 className="uppercase font-semibold tracking-[0.1em] text-text-main/80 text-xs">
          Audio Software & Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {audioSoftware.map((software) => (
            <span
              key={software}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-border-subtle text-text-muted/80 uppercase tracking-wider hover:bg-text-main/5 hover:text-text-main/60 transition-colors duration-300"
            >
              {software}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="uppercase font-semibold tracking-[0.1em] text-text-main/80 text-xs">
            Restoration Demo
          </h2>
          <p className="text-sm text-text-muted leading-relaxed max-w-lg">
            Demonstration of the process of cleaning up field-recorded dialogue,
            moving from the raw capture to a polished, professional result.
          </p>
        </div>

        <div className="max-w-3xl">
          <div className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-text-main/10 bg-black/5 shadow-2xl shadow-text-main/[0.01] transition-all duration-500 hover:border-text-main/20 hover:shadow-text-main/[0.04]">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/9AVBGNRMMZM"
              title="Audio Restoration Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

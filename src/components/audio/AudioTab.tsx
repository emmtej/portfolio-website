import { Text, Title } from "../ui/Text";

const audioSoftware = ["iZotope RX", "Reaper", "DaVinci Resolve"];

export function AudioTab() {
  return (
    <div className="space-y-12">
      <section className="max-w-2xl">
        <Text>
          Specializing in audio restoration, dialogue editing, and
          post-production for digital media. I focus on achieving professional
          loudness standards and crystal-clear clarity for voice actors.
        </Text>
      </section>

      {/* Software Expertise */}
      <section className="space-y-4">
        <Title>Audio Software & Tools</Title>
        <div className="flex flex-wrap gap-2">
          {audioSoftware.map((software) => (
            <span
              key={software}
              className="text-[11px] font-bold px-3 py-1.5 bg-border-subtle text-text-muted/80 uppercase tracking-wider hover:bg-text-main/5 hover:text-text-main/60 transition-colors duration-300"
            >
              {software}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-2">
          <Title>Restoration Demo</Title>
          <Text>
            Demonstration of the process of cleaning up field-recorded dialogue,
            moving from the raw capture to a polished, professional result.
          </Text>
        </div>

        <div className="max-w-3xl">
          <div className="group relative aspect-video w-full overflow-hidden border border-text-main/10 bg-black/5 shadow-2xl shadow-text-main/[0.01] transition-all duration-500 hover:border-text-main/20 hover:shadow-text-main/[0.04]">
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

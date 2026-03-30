import { ExperienceTimeline } from "./ExperienceTimeline";

export function AboutTab() {
  return (
    <div className="space-y-16">
      <section className="max-w-2xl">
        <div className="text-[15px] text-[#37352f]/80 space-y-5 leading-relaxed tracking-tight">
          <p>
            Full-stack web developer currently based in{" "}
            <span className="font-semibold text-[#37352f]">
              Palagianello, Italy
            </span>
            , and previously from{" "}
            <span className="font-semibold text-[#37352f]">New York City</span>.
          </p>
          <p>
            My passion for travel inspired me to work freelance, giving me the
            flexibility to explore new places while helping small businesses and
            companies establish their online presence.
          </p>
          <p>
            I specialize in building modern, responsive websites using the
            latest technologies to ensure my clients effectively connect with
            their audience.
          </p>
          <p>
            Over the last 4 years, I’ve dedicated myself to the React ecosystem,
            blending frontend expertise with the backend logic needed to help
            small businesses outgrow their static sites.
          </p>
        </div>
      </section>

      <section className="space-y-10">
        <h2 className="uppercase font-semibold tracking-[0.1em] text-[#37352f]/80 text-xs">
          Experience
        </h2>
        <ExperienceTimeline />
      </section>
    </div>
  );
}

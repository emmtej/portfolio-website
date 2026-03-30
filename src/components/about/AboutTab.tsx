import { ExperienceTimeline } from "./ExperienceTimeline";

export function AboutTab() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <div className="text-md text-[#37352f]/90 space-y-2">
          <p className="">
            Full-stack web developer currently based in{" "}
            <span className="font-bold text-[#37352f]">
              Palagianello, Italy
            </span>
            , and previously from{" "}
            <span className="font-bold text-[#37352f]">New York City</span>.
          </p>
          <p className="">
            My passion for travel inspired me to work freelance, giving me the
            flexibility to explore new places while helping small businesses and
            companies establish their online presence.
          </p>
          <p className="">
            I specialize in building modern, responsive websites using the
            latest technologies to ensure my clients effectively connect with
            their audience.
          </p>
          <p className="">
            Over the last 4 years, I’ve dedicated myself to the React ecosystem,
            blending frontend expertise with the backend logic needed to help
            small businesses outgrow their static sites.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="uppercase font-bold tracking-tight text-[#37352f]/60 text-sm">
          Experience
        </h2>
        <ExperienceTimeline />
      </section>
    </div>
  );
}

const experiences = [
  {
    time: "2024 - 2025",
    company: "Greative Media (Contractor)",
    location: "Remote | Bologna, Italy",
    title: "Audio Engineering & Audio Mastering",
    description:
      "Standardized diverse voice talent recordings to achieve a unified, high-fidelity studio sound using iZotope RX spectral de-noising and de-plosive modules. Utilized Reaper for precision editing and DaVinci Resolve for final audio-to-video synchronization, spatial balancing and adhering to strict loudness standards (LUFS) for diverse online platforms.",
  },
  {
    time: "2021 - 2024",
    company: "Consultant",
    location: "Remote | Brooklyn, New York",
    title: "Frontend Development",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga officiis tempora ipsum adipisci tenetur sunt quae exercitationem sed pariatur porro!",
  },
  {
    time: "2015 - 2017",
    company: "Brooklyn College",
    location: "Brooklyn, NY",
    title: "IT Service Desk",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga officiis tempora ipsum adipisci tenetur sunt quae exercitationem sed pariatur porro!",
  },
];

export function ExperienceTimeline() {
  return (
    <ol className="relative space-y-12 before:absolute before:left-[4.5px] before:h-full before:w-px before:bg-gray-100">
      {experiences.map((exp, index) => (
        <li key={index} className="group relative flex items-start gap-6">
          <span className="mt-1.5 size-2.5 shrink-0 rounded-full border border-gray-200 bg-white ring-4 ring-white transition-colors duration-1000 group-hover:bg-black group-hover:border-black"></span>

          <div className="flex-1">
            <time className="block mb-1 text-xs font-semibold tracking-[0.15em] uppercase text-gray-400">
              {exp.time}
            </time>

            <h3 className="text-base font-semibold text-[#37352f] tracking-tight">
              {exp.title} — {exp.company}
            </h3>

            <p className="text-xs font-medium text-gray-400 mt-0.5 tracking-wide">
              {exp.location}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-gray-500 tracking-tight">
              {exp.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

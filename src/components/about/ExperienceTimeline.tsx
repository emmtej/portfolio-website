import { Text } from "../ui/Text";
import { cn } from "../../utils/cn";

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
      "Over the last few years, I've worked with various clients to build modern, responsive web applications, focusing on the React ecosystem and performance optimization.",
  },
  {
    time: "2015 - 2017",
    company: "Brooklyn College",
    location: "Brooklyn, NY",
    title: "IT Service Desk",
    description:
      "Provided technical support and troubleshooting for students and faculty, managing hardware and software deployments across the campus.",
  },
];

export function ExperienceTimeline() {
  return (
    <ol className="relative space-y-12 before:absolute before:left-[4.5px] before:h-full before:w-px before:bg-border-subtle">
      {experiences.map((exp, index) => (
        <li key={index} className={cn("group relative flex items-start gap-6")}>
          <span
            className={cn(
              "mt-1.5 size-2.5 shrink-0 rounded-full border border-border-subtle bg-bg-app ring-4 ring-bg-app transition-colors duration-slower",
              "group-hover:bg-text-main group-hover:border-text-main",
            )}
          ></span>

          <div className="flex-1">
            <time className="block mb-1 text-small font-semibold tracking-wider uppercase text-text-muted/60">
              {exp.time}
            </time>
            <h3 className="text-base font-bold text-text-main tracking-tight">
              {exp.title} — {exp.company}
            </h3>
            <p className="text-small font-bold text-text-muted/60 mt-0.5 tracking-wide">
              {exp.location}
            </p>
            <Text className="mt-2 text-text-muted/90">{exp.description}</Text>
          </div>
        </li>
      ))}
    </ol>
  );
}

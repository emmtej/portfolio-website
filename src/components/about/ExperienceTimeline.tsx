import { useTranslation } from "react-i18next";
import { Text } from "../ui/Text";
import { cn } from "../../utils/cn";

export function ExperienceTimeline() {
  const { t } = useTranslation();

  const experiences = [
    {
      time: "2024 - 2025",
      company: t("about.experiences.greative.company"),
      location: t("about.experiences.greative.location"),
      title: t("about.experiences.greative.title"),
      description: t("about.experiences.greative.description"),
    },
    {
      time: "2021 - 2024",
      company: t("about.experiences.consultant.company"),
      location: t("about.experiences.consultant.location"),
      title: t("about.experiences.consultant.title"),
      description: t("about.experiences.consultant.description"),
    },
    {
      time: "2015 - 2017",
      company: t("about.experiences.it_desk.company"),
      location: t("about.experiences.it_desk.location"),
      title: t("about.experiences.it_desk.title"),
      description: t("about.experiences.it_desk.description"),
    },
  ];

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

          <div className="flex-1 -mt-0.5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <time className="text-xs font-mono uppercase tracking-widest text-text-muted/80">
                {exp.time}
              </time>
              <span className="size-1 rounded-full bg-border-subtle" />
              <span className="text-xs font-mono uppercase tracking-widest text-text-muted/80">
                {exp.location}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
              <h3 className="text-base font-bold text-text-main tracking-tight">
                {exp.title}
              </h3>
              <span className="text-xs font-mono uppercase tracking-widest text-text-muted/80 group-hover:text-text-main transition-colors duration-normal">
                [{exp.company}]
              </span>
            </div>

            <Text className="mt-3 text-text-muted/80 leading-relaxed">
              {exp.description}
            </Text>
          </div>
        </li>
      ))}
    </ol>
  );
}

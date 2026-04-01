import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { ProjectCard, ProjectModal, type Project } from "./ProjectUI";
import { SkillsCarousel } from "./SkillsCarousel";
import { Text, Title } from "../ui/Text";

export function DevelopmentTab() {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const PROJECTS: Project[] = useMemo(() => [
    {
      id: "invoice",
      title: t("dev.projects.invoice.title"),
      shortDesc: t("dev.projects.invoice.shortDesc"),
      fullDesc: t("dev.projects.invoice.fullDesc"),
      tech: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Mantine UI"],
      features: t("dev.projects.invoice.features", { returnObjects: true }) as string[],
      link: "https://invoice-demo.example.com",
      github: "https://github.com/example/invoice",
    },
  ], [t]);

  return (
    <div className="space-y-16">
      <Text className="max-w-4xl">
        {t("dev.intro")}
      </Text>
      <SkillsCarousel />
      <section className="max-w-5xl">
        <Title className="mb-6">{t("dev.projects_title")}</Title>
        <div className="grid grid-cols-1 gap-10">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

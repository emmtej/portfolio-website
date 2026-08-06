import { useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import type { Project } from "./types";

export function ProjectGallery({
  projects,
  repoLinksUnavailable = false,
}: {
  projects: Project[];
  repoLinksUnavailable?: boolean;
}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openProject = (project: Project, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelectedProject(project);
  };

  const restoreTriggerFocus = () => {
    if (triggerRef.current?.isConnected) {
      triggerRef.current.focus();
    }
    triggerRef.current = null;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={(trigger) => openProject(project, trigger)}
          />
        ))}
      </div>

      <AnimatePresence onExitComplete={restoreTriggerFocus}>
        {selectedProject ? (
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            repoLinksUnavailable={repoLinksUnavailable}
          />
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  );
}

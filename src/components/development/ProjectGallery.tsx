import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { TAB_ROUTE_EVENT, type TabRouteDetail } from "../tab-shell";
import { useIsHydrated } from "../../utils/hydration";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import type { Project } from "./types";

interface ProjectGalleryProps {
  projects: Project[];
  repoLinksUnavailable?: boolean;
}

function useProjectModal() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [forceClosed, setForceClosed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openProject = (project: Project, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setForceClosed(false);
    setSelectedProject(project);
  };

  const restoreTriggerFocus = () => {
    if (triggerRef.current?.isConnected) {
      triggerRef.current.focus();
    }
    triggerRef.current = null;
  };

  useEffect(() => {
    const onRoute = (event: Event) => {
      const detail = (event as CustomEvent<TabRouteDetail>).detail;
      if (detail.from !== "development" || detail.to === "development") return;
      triggerRef.current = null;
      flushSync(() => {
        setForceClosed(true);
        setSelectedProject(null);
      });
    };

    window.addEventListener(TAB_ROUTE_EVENT, onRoute);
    return () => window.removeEventListener(TAB_ROUTE_EVENT, onRoute);
  }, []);

  return {
    selectedProject,
    openProject,
    closeProject: () => setSelectedProject(null),
    restoreTriggerFocus,
    forceClosed,
  };
}

export function ProjectGallery({
  projects,
  repoLinksUnavailable = false,
}: ProjectGalleryProps) {
  const isHydrated = useIsHydrated();
  const {
    selectedProject,
    openProject,
    closeProject,
    restoreTriggerFocus,
    forceClosed,
  } = useProjectModal();

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="grid grid-cols-1 gap-6 md:gap-8"
        data-island="project-gallery"
        data-hydrated={isHydrated ? "true" : "false"}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={(trigger) => openProject(project, trigger)}
          />
        ))}
      </div>

      {forceClosed ? null : (
        <AnimatePresence onExitComplete={restoreTriggerFocus}>
          {selectedProject ? (
            <ProjectModal
              key={selectedProject.id}
              project={selectedProject}
              onClose={closeProject}
              repoLinksUnavailable={repoLinksUnavailable}
            />
          ) : null}
        </AnimatePresence>
      )}
    </MotionConfig>
  );
}

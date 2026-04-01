import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ArrowRightIcon } from "../ui/icons/ArrowRightIcon";

export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  tech: string[];
  features: string[];
  link?: string;
  github?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { t } = useTranslation();

  return (
    <motion.button
      type="button"
      layoutId={`card-${project.id}`}
      onClick={onClick}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 32,
      }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
      className="text-left w-full group relative cursor-pointer overflow-hidden border border-border-subtle bg-bg-app hover:border-text-main/20 hover:shadow-2xl hover:shadow-text-main/[0.04]"
    >
      {/* Visual Preview Area - Full Width */}
      <div className="aspect-[16/10] w-full bg-gradient-to-br from-text-main/5 to-text-main/10 relative overflow-hidden border-b border-border-subtle transition-colors duration-slow group-hover:from-text-main/[0.07] group-hover:to-text-main/[0.12]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-40 transition-opacity duration-slow group-hover:opacity-60" />

          <div className="relative flex flex-col items-center gap-2">
            <span className="text-lg font-bold tracking-tighter text-text-main/10 group-hover:text-text-main/20 transition-all duration-slow ease-out">
              {project.title}
            </span>
            <div className="px-3 py-1 bg-text-main/5 border border-text-main/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-slow delay-75">
              <span className="text-xs font-bold uppercase tracking-widest text-text-main/40">
                {t("dev.view_project")}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-slow" />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-main tracking-tight transition-colors duration-normal">
              {project.title}
            </h3>
            <p className="text-sm text-text-muted/80 leading-relaxed tracking-tight max-w-lg">
              {project.shortDesc}
            </p>
          </div>

          <motion.div
            whileHover={{ x: 4 }}
            className="mt-1 size-8 border border-border-subtle flex items-center justify-center text-text-muted/40 group-hover:border-text-main/20 group-hover:text-text-main/60 transition-all duration-normal"
          >
            <ArrowRightIcon />
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((techItem) => (
            <Badge
              key={techItem}
              variant="subtle"
              className="group-hover:bg-text-main/5 group-hover:text-text-main/60 transition-colors duration-normal"
            >
              {techItem}
            </Badge>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      layoutId={`card-${project.id}`}
      title={project.title}
    >
      <div className="h-64 shrink-0 bg-gradient-to-br from-text-main/5 to-text-main/10 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-50" />
        <h2 className="text-xl font-bold tracking-tighter text-text-main/30">
          {project.title}
        </h2>
      </div>

      <div className="p-8 space-y-8">
        <div className="space-y-4">
          <h3
            id="modal-title"
            className="text-lg font-bold tracking-tight text-text-main"
          >
            {project.title}
          </h3>
          <p className="text-md leading-relaxed text-text-muted tracking-tight">
            {project.fullDesc}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="uppercase font-semibold tracking-wide text-text-main/80 text-sm">
            {t("dev.features_title")}
          </h4>
          <ul className="grid grid-cols-1 gap-3">
            {project.features.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="flex items-start gap-3 text-sm text-text-muted tracking-tight"
              >
                <span className="mt-1.5 size-1.5 shrink-0 bg-text-main/20" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 pt-4 border-t border-border-subtle">
          <h4 className="uppercase font-semibold tracking-wide text-text-main/80 text-sm">
            {t("dev.tech_stack")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((techItem) => (
              <Badge
                key={techItem}
                variant="subtle"
                size="sm"
                className="text-text-main/60"
              >
                {techItem}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-6">
          {project.github && (
            <Button
              as="a"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
            >
              {t("dev.view_source")}
            </Button>
          )}
          {project.link && (
            <Button
              as="a"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
            >
              {t("dev.view_demo")}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

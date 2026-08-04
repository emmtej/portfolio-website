import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { Heading, Text, Title } from "../ui/Typography";
import { Badge } from "../ui/ReactLayout";
import { Modal } from "../ui/Modal";
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
  preview?: {
    src: string;
    alt: string;
  };
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectPreviewWell({ preview }: { preview?: Project["preview"] }) {
  return (
    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-border-subtle bg-surface-muted md:aspect-auto md:min-h-[14rem] md:border-b-0">
      <div className="absolute inset-3 overflow-hidden border border-border-subtle bg-bg-app">
        {preview ? (
          <img
            src={preview.src}
            alt={preview.alt}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        ) : null}
      </div>
    </div>
  );
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const previewTech = project.tech.slice(0, 4);
  const remainingTech = project.tech.length - previewTech.length;

  return (
    <motion.button
      type="button"
      layoutId={`card-${project.id}`}
      onClick={onClick}
      aria-label={`${project.title}. ${project.shortDesc}`}
      className="group relative w-full overflow-hidden border border-border-subtle bg-bg-app text-left transition-all duration-normal hover:border-text-main/20 hover:bg-text-main/[0.02]"
    >
      <div className="md:grid md:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
        <ProjectPreviewWell preview={project.preview} />

        <div className="flex min-w-0 flex-col p-5 md:border-l md:border-border-subtle md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <Heading className="transition-colors duration-normal group-hover:text-text-main">
                {project.title}
              </Heading>
              <p className="max-w-2xl text-sm leading-relaxed tracking-tight text-secondary">
                {project.shortDesc}
              </p>
            </div>

            <div
              className="mt-1 flex size-8 shrink-0 items-center justify-center border border-text-main/20 text-text-main/60 transition-all duration-normal group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            >
              <ArrowRightIcon />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {previewTech.map((techItem) => (
              <Badge
                key={techItem}
                className="bg-surface-muted text-secondary transition-colors duration-normal group-hover:bg-text-main/5 group-hover:text-text-main/60"
              >
                {techItem}
              </Badge>
            ))}
            {remainingTech > 0 ? (
              <Badge className="bg-surface-muted text-tertiary">
                +{remainingTech}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModalLinks({ project }: { project: Project }) {
  const { t } = useTranslation();
  const hasGithub = Boolean(project.github);
  const hasDemo = Boolean(project.link);

  if (!hasGithub && !hasDemo) {
    return (
      <Text size="sm" className="text-secondary">
        {t("dev.links_private")}
      </Text>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4">
        {project.github ? (
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
        ) : null}
        {project.link ? (
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
        ) : null}
      </div>
      {hasGithub && !hasDemo ? (
        <Text size="sm" className="text-secondary">
          {t("dev.source_only_note")}
        </Text>
      ) : null}
      {!hasGithub && hasDemo ? (
        <Text size="sm" className="text-secondary">
          {t("dev.demo_only_note")}
        </Text>
      ) : null}
    </div>
  );
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
      {project.preview ? (
        <div className="relative max-h-72 shrink-0 overflow-hidden bg-surface-muted aspect-[16/10]">
          <div className="absolute inset-4 overflow-hidden border border-border-subtle bg-bg-app">
            <img
              src={project.preview.src}
              alt={project.preview.alt}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-8 p-6 md:p-8">
        <Text className="max-w-2xl">{project.fullDesc}</Text>

        <div className="space-y-4">
          <Title as="h3" className="text-text-main/80">
            {t("dev.features_title")}
          </Title>
          <ul className="grid grid-cols-1 gap-3">
            {project.features.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="flex items-start gap-3 text-sm tracking-tight text-secondary"
              >
                <span className="mt-1.5 size-1.5 shrink-0 bg-text-main/20" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 border-t border-border-subtle pt-4">
          <Title as="h3" className="text-text-main/80">
            {t("dev.tech_stack")}
          </Title>
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

        <div className="space-y-4 border-t border-border-subtle pt-6">
          <Title as="h3" className="text-text-main/80">
            {t("dev.links_title")}
          </Title>
          <ProjectModalLinks project={project} />
        </div>
      </div>
    </Modal>
  );
}

import { Heading } from "../ui/Typography";
import { Badge } from "../ui/ReactLayout";
import { ArrowRightIcon } from "../ui/icons/ArrowRightIcon";
import type { Project } from "./types";

interface ProjectCardProps {
  project: Project;
  onClick: (trigger: HTMLButtonElement) => void;
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
    <button
      type="button"
      onClick={(event) => onClick(event.currentTarget)}
      aria-label={`${project.title}. ${project.shortDesc}`}
      className="group relative w-full overflow-hidden border border-border-subtle bg-bg-app text-left transition-[background-color,border-color] duration-normal hover:border-text-main/20 hover:bg-text-main/[0.02]"
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
              className="mt-1 flex size-8 shrink-0 items-center justify-center border border-text-main/20 text-text-tertiary transition-[color,transform] duration-normal group-hover:translate-x-1 group-hover:text-text-main motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            >
              <ArrowRightIcon />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {previewTech.map((techItem) => (
              <Badge
                key={techItem}
                className="bg-surface-muted text-secondary transition-colors duration-normal group-hover:bg-text-main/5 group-hover:text-text-main"
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
    </button>
  );
}

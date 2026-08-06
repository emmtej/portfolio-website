import { useTranslation } from "react-i18next";
import "../../i18n";
import { Button } from "../ui/Button";
import { Text, Title } from "../ui/Typography";
import { Badge } from "../ui/ReactLayout";
import { Modal } from "../ui/Modal";
import type { Project } from "./types";

function ProjectModalLinks({
  project,
  repoLinksUnavailable,
}: {
  project: Project;
  repoLinksUnavailable: boolean;
}) {
  const { t } = useTranslation();
  const hasGithub = Boolean(project.github);
  const hasDemo = Boolean(project.link);
  const githubUnavailable = repoLinksUnavailable && hasGithub;

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
        {hasGithub ? (
          githubUnavailable ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled
              aria-disabled="true"
            >
              {t("dev.view_source")}
            </Button>
          ) : (
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
          )
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
      {githubUnavailable ? (
        <Text size="sm" className="text-secondary">
          {t("dev.repo_transfer_notice.links_unavailable")}
        </Text>
      ) : null}
      {hasGithub && !hasDemo && !githubUnavailable ? (
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

export function ProjectModal({
  project,
  onClose,
  repoLinksUnavailable = false,
}: {
  project: Project;
  onClose: () => void;
  repoLinksUnavailable?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      title={project.title}
      closeLabel={t("dev.close_modal")}
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
          <Title as="h3" className="text-text-main">
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
          <Title as="h3" className="text-text-main">
            {t("dev.tech_stack")}
          </Title>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((techItem) => (
              <Badge
                key={techItem}
                variant="subtle"
                size="sm"
                className="text-text-secondary"
              >
                {techItem}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-t border-border-subtle pt-6">
          <Title as="h3" className="text-text-main">
            {t("dev.links_title")}
          </Title>
          <ProjectModalLinks
            project={project}
            repoLinksUnavailable={repoLinksUnavailable}
          />
        </div>
      </div>
    </Modal>
  );
}

import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import type { Project } from "./types";

function GithubLinkButton({
  github,
  unavailable,
  label,
}: {
  github: string;
  unavailable: boolean;
  label: string;
}) {
  if (unavailable) {
    return (
      <Button
        type="button"
        variant="primary"
        size="md"
        disabled
        aria-disabled="true"
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      as="a"
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      variant="primary"
      size="md"
    >
      {label}
    </Button>
  );
}

export function ProjectLinkButtons({
  project,
  hasGithub,
  hasDemo,
  githubUnavailable,
}: {
  project: Pick<Project, "github" | "link">;
  hasGithub: boolean;
  hasDemo: boolean;
  githubUnavailable: boolean;
}) {
  const { t } = useTranslation();
  const sourceLabel = t("dev.view_source");
  const demoLabel = t("dev.view_demo");

  return (
    <div className="flex flex-wrap gap-4">
      {hasGithub && project.github ? (
        <GithubLinkButton
          github={project.github}
          unavailable={githubUnavailable}
          label={sourceLabel}
        />
      ) : null}
      {hasDemo && project.link ? (
        <Button
          as="a"
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="md"
        >
          {demoLabel}
        </Button>
      ) : null}
    </div>
  );
}

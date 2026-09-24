import { getProjectLinkState } from "./projectLinkState";
import { ProjectLinkButtons } from "./ProjectLinkButtons";
import { ProjectLinkNotice } from "./ProjectLinkNotice";
import type { Project } from "./types";

export function ProjectModalLinks({
  project,
  repoLinksUnavailable,
}: {
  project: Project;
  repoLinksUnavailable: boolean;
}) {
  const state = getProjectLinkState(project, repoLinksUnavailable);

  if (!state.showButtons) {
    return <ProjectLinkNotice noticeKey={state.noticeKey} />;
  }

  return (
    <div className="space-y-3">
      <ProjectLinkButtons
        project={project}
        hasGithub={state.hasGithub}
        hasDemo={state.hasDemo}
        githubUnavailable={state.githubUnavailable}
      />
      <ProjectLinkNotice noticeKey={state.noticeKey} />
    </div>
  );
}

import type { Project } from "./types";

export type ProjectLinkNoticeKey =
  | "dev.links_private"
  | "dev.repo_transfer_notice.links_unavailable"
  | "dev.source_only_note"
  | "dev.demo_only_note";

export interface ProjectLinkState {
  hasGithub: boolean;
  hasDemo: boolean;
  githubUnavailable: boolean;
  showButtons: boolean;
  noticeKey: ProjectLinkNoticeKey | null;
}

export function getProjectLinkState(
  project: Pick<Project, "github" | "link">,
  repoLinksUnavailable: boolean,
): ProjectLinkState {
  const hasGithub = Boolean(project.github);
  const hasDemo = Boolean(project.link);
  const githubUnavailable = repoLinksUnavailable && hasGithub;

  if (!hasGithub && !hasDemo) {
    return {
      hasGithub,
      hasDemo,
      githubUnavailable,
      showButtons: false,
      noticeKey: "dev.links_private",
    };
  }

  let noticeKey: ProjectLinkNoticeKey | null = null;
  if (githubUnavailable) {
    noticeKey = "dev.repo_transfer_notice.links_unavailable";
  } else if (hasGithub && !hasDemo) {
    noticeKey = "dev.source_only_note";
  } else if (!hasGithub && hasDemo) {
    noticeKey = "dev.demo_only_note";
  }

  return {
    hasGithub,
    hasDemo,
    githubUnavailable,
    showButtons: true,
    noticeKey,
  };
}

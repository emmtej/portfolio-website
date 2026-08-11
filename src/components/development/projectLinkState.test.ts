import { describe, expect, it } from "vitest";
import { getProjectLinkState } from "./projectLinkState";

const project = {
  github: "https://github.com/example/repo",
  link: "https://example.com",
};

describe("getProjectLinkState", () => {
  it("returns private-only notice when no links exist", () => {
    expect(getProjectLinkState({}, false)).toEqual({
      hasGithub: false,
      hasDemo: false,
      githubUnavailable: false,
      showButtons: false,
      noticeKey: "dev.links_private",
    });
  });

  it("marks github unavailable when repo transfer blocks source links", () => {
    expect(getProjectLinkState({ github: project.github }, true)).toEqual({
      hasGithub: true,
      hasDemo: false,
      githubUnavailable: true,
      showButtons: true,
      noticeKey: "dev.repo_transfer_notice.links_unavailable",
    });
  });

  it("returns source-only notice for github without demo", () => {
    expect(getProjectLinkState({ github: project.github }, false)).toEqual({
      hasGithub: true,
      hasDemo: false,
      githubUnavailable: false,
      showButtons: true,
      noticeKey: "dev.source_only_note",
    });
  });

  it("returns demo-only notice when only demo link exists", () => {
    expect(getProjectLinkState({ link: project.link }, false)).toEqual({
      hasGithub: false,
      hasDemo: true,
      githubUnavailable: false,
      showButtons: true,
      noticeKey: "dev.demo_only_note",
    });
  });

  it("returns no footer notice when both links are available", () => {
    expect(getProjectLinkState(project, false)).toEqual({
      hasGithub: true,
      hasDemo: true,
      githubUnavailable: false,
      showButtons: true,
      noticeKey: null,
    });
  });
});

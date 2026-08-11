import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ProjectModalLinks } from "./ProjectModalLinks";
import type { Project } from "./types";

const baseProject: Project = {
  id: "test",
  title: "Test Project",
  shortDesc: "Short",
  fullDesc: "Full",
  tech: [],
  features: [],
};

const github = "https://github.com/example/repo";
const demo = "https://example.com";

afterEach(() => {
  cleanup();
});

describe("ProjectModalLinks", () => {
  it("renders private notice when no links exist", () => {
    render(<ProjectModalLinks project={baseProject} repoLinksUnavailable={false} />);

    expect(
      screen.getByText("Source and demo are not public for this project."),
    ).toBeTruthy();
    expect(screen.queryByRole("link", { name: "View Source" })).toBeNull();
    expect(screen.queryByRole("link", { name: "View demo" })).toBeNull();
  });

  it("renders source link and source-only notice", () => {
    render(
      <ProjectModalLinks
        project={{ ...baseProject, github }}
        repoLinksUnavailable={false}
      />,
    );

    const sourceLink = screen.getByRole("link", { name: "View Source" });
    expect(sourceLink.getAttribute("href")).toBe(github);
    expect(sourceLink.getAttribute("target")).toBe("_blank");
    expect(sourceLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(
      screen.getByText(
        "No separate live demo — the repository is the production codebase for this site.",
      ),
    ).toBeTruthy();
  });

  it("renders demo link and demo-only notice", () => {
    render(
      <ProjectModalLinks
        project={{ ...baseProject, link: demo }}
        repoLinksUnavailable={false}
      />,
    );

    const demoLink = screen.getByRole("link", { name: "View demo" });
    expect(demoLink.getAttribute("href")).toBe(demo);
    expect(demoLink.getAttribute("target")).toBe("_blank");
    expect(demoLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(
      screen.getByText("Live demo is available; source is not public."),
    ).toBeTruthy();
  });

  it("renders both links without a footer notice", () => {
    render(
      <ProjectModalLinks
        project={{ ...baseProject, github, link: demo }}
        repoLinksUnavailable={false}
      />,
    );

    expect(screen.getByRole("link", { name: "View Source" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "View demo" })).toBeTruthy();
    expect(
      screen.queryByText("Source and demo are not public for this project."),
    ).toBeNull();
    expect(
      screen.queryByText(
        "No separate live demo — the repository is the production codebase for this site.",
      ),
    ).toBeNull();
    expect(
      screen.queryByText("Live demo is available; source is not public."),
    ).toBeNull();
  });

  it("renders disabled source control when repository links are unavailable", () => {
    render(
      <ProjectModalLinks
        project={{ ...baseProject, github }}
        repoLinksUnavailable={true}
      />,
    );

    const sourceButton = screen.getByRole("button", { name: "View Source" });
    expect(sourceButton.getAttribute("disabled")).not.toBeNull();
    expect(sourceButton.getAttribute("aria-disabled")).toBe("true");
    expect(screen.queryByRole("link", { name: "View Source" })).toBeNull();
    expect(
      screen.getByText(
        "Source link unavailable during the GitHub to GitLab transfer.",
      ),
    ).toBeTruthy();
  });
});

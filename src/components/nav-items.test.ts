import { describe, expect, it } from "vitest";
import {
  buildNavRouteMetadata,
  buildNavTabs,
  getLocalizedNavUrl,
  resolveActiveTabId,
} from "./nav-items";

const t = (key: string) => key;

describe("resolveActiveTabId", () => {
  it("defaults to about on the locale root", () => {
    expect(resolveActiveTabId("/", "en")).toBe("about");
    expect(resolveActiveTabId("/it", "it")).toBe("about");
  });

  it("reads the active tab from localized paths", () => {
    expect(resolveActiveTabId("/contact", "en")).toBe("contact");
    expect(resolveActiveTabId("/it/audio", "it")).toBe("audio");
  });
});

describe("getLocalizedNavUrl", () => {
  it("builds english and italian tab urls", () => {
    expect(getLocalizedNavUrl("en", "about")).toBe("/");
    expect(getLocalizedNavUrl("en", "development")).toBe("/development");
    expect(getLocalizedNavUrl("it", "about")).toBe("/it");
    expect(getLocalizedNavUrl("it", "contact")).toBe("/it/contact");
  });
});

describe("buildNavRouteMetadata", () => {
  const site = new URL("https://www.emmanueltejeda.com");

  it("maps about to meta.home and the other locale switcher", () => {
    expect(buildNavRouteMetadata("en", "about", t, site)).toMatchObject({
      title: "meta.home.title",
      description: "meta.home.description",
      canonical: "https://www.emmanueltejeda.com/",
      switcherHref: "/it",
    });
    expect(buildNavRouteMetadata("it", "development", t, site).switcherHref).toBe(
      "/development",
    );
  });
});

describe("buildNavTabs", () => {
  it("returns the four primary tabs", () => {
    expect(buildNavTabs(t).map((tab) => tab.id)).toEqual([
      "about",
      "development",
      "audio",
      "contact",
    ]);
  });
});

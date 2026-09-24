import { afterEach, describe, expect, it } from "vitest";
import {
  applyRouteMetadata,
  decideNavClick,
  installTabShell,
  readRouteMetadata,
  scrollFromState,
  withScroll,
} from "./tab-shell";

const pageOrigin = "http://localhost:3000";

function clickInput(overrides: Partial<Parameters<typeof decideNavClick>[0]> = {}) {
  return {
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
    hasDownload: false,
    target: null,
    destination: new URL("/development", pageOrigin),
    pageOrigin,
    pageLocale: "en" as const,
    currentTab: "about",
    tabId: "development",
    ...overrides,
  };
}

describe("decideNavClick", () => {
  it("navigates an ordinary same-locale primary click", () => {
    expect(decideNavClick(clickInput())).toBe("navigate");
  });

  it("treats the current tab as same after modifier checks", () => {
    expect(decideNavClick(clickInput({ tabId: "about", destination: new URL("/", pageOrigin) }))).toBe(
      "same",
    );
    expect(decideNavClick(clickInput({ tabId: "about", metaKey: true }))).toBe("ignore");
  });

  it("ignores modified, non-primary, download, and cross-locale clicks", () => {
    expect(decideNavClick(clickInput({ ctrlKey: true }))).toBe("ignore");
    expect(decideNavClick(clickInput({ button: 1 }))).toBe("ignore");
    expect(decideNavClick(clickInput({ hasDownload: true }))).toBe("ignore");
    expect(decideNavClick(clickInput({ target: "_blank" }))).toBe("ignore");
    expect(decideNavClick(clickInput({ destination: new URL("/it/development", pageOrigin) }))).toBe(
      "ignore",
    );
  });
});

describe("scroll state", () => {
  it("keeps unrelated history fields", () => {
    expect(withScroll({ marker: 1 }, 40)).toEqual({ marker: 1, tabScroll: 40 });
    expect(scrollFromState(withScroll(null, 12))).toBe(12);
    expect(scrollFromState(null)).toBeNull();
  });
});

describe("route metadata", () => {
  it("reads a complete attribute set and rejects a partial one", () => {
    document.body.innerHTML = `
      <a id="complete"
        data-title="Title"
        data-description="Description"
        data-canonical="https://www.emmanueltejeda.com/audio/"
        data-og-image="https://www.emmanueltejeda.com/og-image.png"
        data-english-url="https://www.emmanueltejeda.com/audio/"
        data-italian-url="https://www.emmanueltejeda.com/it/audio/"
        data-switcher-href="/it/audio"></a>
      <a id="partial" data-title="Title"></a>
    `;

    const complete = document.getElementById("complete");
    const partial = document.getElementById("partial");
    expect(complete && readRouteMetadata(complete)?.title).toBe("Title");
    expect(partial && readRouteMetadata(partial)).toBeNull();
  });

  it("writes title, social metadata, alternates, and the language switcher", () => {
    document.body.innerHTML = `
      <meta name="title" content="">
      <meta name="description" content="">
      <link rel="canonical" href="">
      <meta property="og:title" content="">
      <meta property="og:description" content="">
      <meta property="og:url" content="">
      <meta property="og:image" content="">
      <meta property="twitter:title" content="">
      <meta property="twitter:description" content="">
      <meta property="twitter:url" content="">
      <meta property="twitter:image" content="">
      <link rel="alternate" hreflang="en" href="">
      <link rel="alternate" hreflang="it" href="">
      <link rel="alternate" hreflang="x-default" href="">
      <a data-language-switcher href="/"></a>
    `;

    applyRouteMetadata(document, {
      title: "Audio title",
      description: "Audio description",
      canonical: "https://www.emmanueltejeda.com/audio/",
      ogImage: "https://www.emmanueltejeda.com/og-image.png",
      englishUrl: "https://www.emmanueltejeda.com/audio/",
      italianUrl: "https://www.emmanueltejeda.com/it/audio/",
      switcherHref: "/it/audio",
    });

    expect(document.title).toBe("Audio title");
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      "Audio description",
    );
    expect(document.querySelector('a[data-language-switcher]')?.getAttribute("href")).toBe(
      "/it/audio",
    );
    expect(document.querySelector('link[hreflang="x-default"]')?.getAttribute("href")).toBe(
      "https://www.emmanueltejeda.com/audio/",
    );
  });
});

describe("installTabShell", () => {
  let dispose = () => {};

  afterEach(() => {
    dispose();
    document.body.innerHTML = "";
    history.scrollRestoration = "auto";
  });

  it("switches one panel, pushes history, and ignores a same-tab click", () => {
    document.body.innerHTML = `
      <div id="tab-panels-container" data-locale="en">
        <section id="tab-panel-about" data-tab-panel="about" tabindex="-1"></section>
        <section id="tab-panel-development" data-tab-panel="development" tabindex="-1" hidden></section>
      </div>
      <a id="tab-link-about" data-nav-tab="about" href="/" aria-current="page"
        data-title="About" data-description="About description"
        data-canonical="https://www.emmanueltejeda.com/"
        data-og-image="https://www.emmanueltejeda.com/og-image.png"
        data-english-url="https://www.emmanueltejeda.com/"
        data-italian-url="https://www.emmanueltejeda.com/it/"
        data-switcher-href="/it">About</a>
      <a id="tab-link-development" data-nav-tab="development" href="/development"
        data-title="Development" data-description="Development description"
        data-canonical="https://www.emmanueltejeda.com/development/"
        data-og-image="https://www.emmanueltejeda.com/og-image.png"
        data-english-url="https://www.emmanueltejeda.com/development/"
        data-italian-url="https://www.emmanueltejeda.com/it/development/"
        data-switcher-href="/it/development">Development</a>
      <p id="tab-route-status"></p>
      <meta name="title" content="About">
      <meta name="description" content="About description">
      <link rel="canonical" href="https://www.emmanueltejeda.com/">
      <meta property="og:title" content="About">
      <meta property="og:description" content="About description">
      <meta property="og:url" content="https://www.emmanueltejeda.com/">
      <meta property="og:image" content="https://www.emmanueltejeda.com/og-image.png">
      <meta property="twitter:title" content="About">
      <meta property="twitter:description" content="About description">
      <meta property="twitter:url" content="https://www.emmanueltejeda.com/">
      <meta property="twitter:image" content="https://www.emmanueltejeda.com/og-image.png">
      <link rel="alternate" hreflang="en" href="https://www.emmanueltejeda.com/">
      <link rel="alternate" hreflang="it" href="https://www.emmanueltejeda.com/it/">
      <link rel="alternate" hreflang="x-default" href="https://www.emmanueltejeda.com/">
      <a data-language-switcher href="/it"></a>
    `;

    dispose = installTabShell();
    const before = history.length;
    document.getElementById("tab-link-about")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, button: 0, cancelable: true }),
    );
    expect(history.length).toBe(before);

    document.getElementById("tab-link-development")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, button: 0, cancelable: true }),
    );

    expect(document.getElementById("tab-panel-about")?.hidden).toBe(true);
    expect(document.getElementById("tab-panel-development")?.hidden).toBe(false);
    expect(document.getElementById("tab-link-development")?.getAttribute("aria-current")).toBe("page");
    expect(document.getElementById("tab-link-about")?.hasAttribute("aria-current")).toBe(false);
    expect(document.title).toBe("Development");
    expect(document.getElementById("tab-route-status")?.textContent).toBe("Development");
    expect(document.querySelector("a[data-language-switcher]")?.getAttribute("href")).toBe(
      "/it/development",
    );
    expect(history.length).toBe(before + 1);

    const sameTab = document.getElementById("tab-link-development");
    sameTab?.removeAttribute("data-title");
    const incomplete = new MouseEvent("click", { bubbles: true, button: 0, cancelable: true });
    sameTab?.dispatchEvent(incomplete);
    expect(incomplete.defaultPrevented).toBe(false);
  });

  it("does nothing when the shell is missing", () => {
    dispose = installTabShell();
    expect(history.scrollRestoration).not.toBe("manual");
  });
});

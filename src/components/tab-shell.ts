import {
  resolveActiveTabId,
  type NavRouteMetadata,
  type NavTabId,
} from "./nav-items";
import type { Locale } from "../utils/server-t";

export const TAB_ROUTE_EVENT = "tab-route-change";
export const TAB_SCROLL_KEY = "tabScroll";

export interface TabRouteDetail {
  from: NavTabId;
  to: NavTabId;
}

const TAB_IDS: readonly NavTabId[] = ["about", "development", "audio", "contact"];

export function isNavTabId(value: string): value is NavTabId {
  return (TAB_IDS as readonly string[]).includes(value);
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/it" || pathname.startsWith("/it/") ? "it" : "en";
}

export type NavClickDecision = "ignore" | "same" | "navigate";

export function decideNavClick(input: {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
  hasDownload: boolean;
  target: string | null;
  destination: URL;
  pageOrigin: string;
  pageLocale: Locale;
  currentTab: string | null;
  tabId: string | null;
}): NavClickDecision {
  const target = input.target;
  const ordinaryTarget = target === null || target === "" || target === "_self";
  if (
    input.button !== 0 ||
    input.metaKey ||
    input.ctrlKey ||
    input.shiftKey ||
    input.altKey ||
    input.defaultPrevented ||
    input.hasDownload ||
    !ordinaryTarget ||
    input.destination.origin !== input.pageOrigin ||
    localeFromPathname(input.destination.pathname) !== input.pageLocale ||
    !input.tabId ||
    !isNavTabId(input.tabId)
  ) {
    return "ignore";
  }

  return input.tabId === input.currentTab ? "same" : "navigate";
}

export function readRouteMetadata(anchor: HTMLElement): NavRouteMetadata | null {
  const title = anchor.dataset.title;
  const description = anchor.dataset.description;
  const canonical = anchor.dataset.canonical;
  const ogImage = anchor.dataset.ogImage;
  const englishUrl = anchor.dataset.englishUrl;
  const italianUrl = anchor.dataset.italianUrl;
  const switcherHref = anchor.dataset.switcherHref;
  if (!title || !description || !canonical || !ogImage || !englishUrl || !italianUrl || !switcherHref) {
    return null;
  }

  return { title, description, canonical, ogImage, englishUrl, italianUrl, switcherHref };
}

export function withScroll(state: unknown, y: number): Record<string, unknown> {
  const base =
    state !== null && typeof state === "object"
      ? { ...(state as Record<string, unknown>) }
      : {};
  base[TAB_SCROLL_KEY] = y;
  return base;
}

export function scrollFromState(state: unknown): number | null {
  if (state === null || typeof state !== "object") return null;
  const y = (state as Record<string, unknown>)[TAB_SCROLL_KEY];
  return typeof y === "number" ? y : null;
}

function setContent(doc: Document, selector: string, value: string) {
  const element = doc.querySelector(selector);
  if (element) element.setAttribute("content", value);
}

export function applyRouteMetadata(doc: Document, metadata: NavRouteMetadata) {
  doc.title = metadata.title;
  setContent(doc, 'meta[name="title"]', metadata.title);
  setContent(doc, 'meta[name="description"]', metadata.description);
  doc.querySelector('link[rel="canonical"]')?.setAttribute("href", metadata.canonical);
  setContent(doc, 'meta[property="og:title"]', metadata.title);
  setContent(doc, 'meta[property="og:description"]', metadata.description);
  setContent(doc, 'meta[property="og:url"]', metadata.canonical);
  setContent(doc, 'meta[property="og:image"]', metadata.ogImage);
  setContent(doc, 'meta[property="twitter:title"]', metadata.title);
  setContent(doc, 'meta[property="twitter:description"]', metadata.description);
  setContent(doc, 'meta[property="twitter:url"]', metadata.canonical);
  setContent(doc, 'meta[property="twitter:image"]', metadata.ogImage);
  doc.querySelector('link[rel="alternate"][hreflang="en"]')?.setAttribute("href", metadata.englishUrl);
  doc.querySelector('link[rel="alternate"][hreflang="it"]')?.setAttribute("href", metadata.italianUrl);
  doc.querySelector('link[rel="alternate"][hreflang="x-default"]')?.setAttribute("href", metadata.englishUrl);
  doc.querySelector("a[data-language-switcher]")?.setAttribute("href", metadata.switcherHref);
}

function visibleTab(shell: HTMLElement): string | null {
  return shell.querySelector<HTMLElement>("[data-tab-panel]:not([hidden])")?.dataset.tabPanel ?? null;
}

export function installTabShell(doc: Document = document, view: Window = window): () => void {
  const shell = doc.getElementById("tab-panels-container");
  const locale = shell?.dataset.locale;
  if (!shell || (locale !== "en" && locale !== "it")) return () => {};

  view.history.scrollRestoration = "manual";
  const status = doc.getElementById("tab-route-status");

  const persistScroll = () => {
    view.history.replaceState(withScroll(view.history.state, view.scrollY), "");
  };

  const onScroll = () => {
    persistScroll();
  };

  if (scrollFromState(view.history.state) === null) persistScroll();
  view.addEventListener("scroll", onScroll, { passive: true });

  const apply = (tabId: NavTabId, metadata: NavRouteMetadata, kind: "push" | "pop") => {
    const from = visibleTab(shell);
    if (from && isNavTabId(from) && from !== tabId) {
      view.dispatchEvent(
        new CustomEvent<TabRouteDetail>(TAB_ROUTE_EVENT, { detail: { from, to: tabId } }),
      );
    }

    for (const panel of shell.querySelectorAll<HTMLElement>("[data-tab-panel]")) {
      panel.hidden = panel.dataset.tabPanel !== tabId;
    }

    for (const link of doc.querySelectorAll<HTMLAnchorElement>("a[data-nav-tab]")) {
      if (link.dataset.navTab === tabId) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }

    applyRouteMetadata(doc, metadata);
    shell.querySelector<HTMLElement>(`[data-tab-panel="${tabId}"]`)?.focus({ preventScroll: true });
    if (status) status.textContent = metadata.title;
    if (kind === "push") view.scrollTo(0, 0);
    else view.scrollTo(0, scrollFromState(view.history.state) ?? 0);
  };

  const onClick = (event: Event) => {
    if (!(event instanceof MouseEvent) || !(event.target instanceof Element)) return;
    const anchor = event.target.closest("a[data-nav-tab]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const decision = decideNavClick({
      button: event.button,
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      defaultPrevented: event.defaultPrevented,
      hasDownload: anchor.hasAttribute("download"),
      target: anchor.getAttribute("target"),
      destination: new URL(anchor.href, view.location.origin),
      pageOrigin: view.location.origin,
      pageLocale: locale,
      currentTab: visibleTab(shell),
      tabId: anchor.dataset.navTab ?? null,
    });
    if (decision === "ignore" || !shell.isConnected) return;

    const tabId = anchor.dataset.navTab ?? "";
    const metadata = readRouteMetadata(anchor);
    const panel = isNavTabId(tabId)
      ? shell.querySelector(`[data-tab-panel="${tabId}"]`)
      : null;
    if (!panel || !metadata || !isNavTabId(tabId)) return;

    event.preventDefault();
    if (decision === "same") return;

    persistScroll();
    const url = new URL(anchor.href, view.location.origin);
    view.history.pushState(withScroll(view.history.state, 0), "", `${url.pathname}${url.search}${url.hash}`);
    apply(tabId, metadata, "push");
  };

  const onPopState = () => {
    const tabId = resolveActiveTabId(view.location.pathname, locale);
    if (!isNavTabId(tabId)) {
      view.location.assign(view.location.href);
      return;
    }

    if (visibleTab(shell) === tabId) {
      const y = scrollFromState(view.history.state);
      if (y !== null) view.scrollTo(0, y);
      return;
    }

    const link = doc.querySelector<HTMLAnchorElement>(`a[data-nav-tab="${tabId}"]`);
    const metadata = link ? readRouteMetadata(link) : null;
    const panel = shell.querySelector(`[data-tab-panel="${tabId}"]`);
    if (!link || !panel || !metadata) {
      view.location.assign(view.location.href);
      return;
    }

    apply(tabId, metadata, "pop");
  };

  doc.addEventListener("click", onClick);
  view.addEventListener("popstate", onPopState);

  return () => {
    doc.removeEventListener("click", onClick);
    view.removeEventListener("popstate", onPopState);
    view.removeEventListener("scroll", onScroll);
  };
}

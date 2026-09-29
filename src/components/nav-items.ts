import { buildPageMetadataUrls } from "../layouts/metadata/buildLocaleUrls";
import type { Locale } from "../utils/server-t";

export type NavTabId = "about" | "development" | "audio" | "contact";

export interface NavTab {
  id: NavTabId;
  label: string;
  shortLabel: string;
}

export const NAV_TAB_LINK_CLASS =
  "relative inline-flex h-chrome-control items-center gap-2 whitespace-nowrap shrink-0 snap-center -mb-px border-b-2 border-transparent text-xs font-bold uppercase tracking-wider md:tracking-widest text-inactive transition-colors hover:text-text-main aria-[current=page]:border-text-main aria-[current=page]:text-text-main";

export function resolveActiveTabId(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  return (locale === "it" ? segments[1] : segments[0]) || "about";
}

export function getLocalizedNavUrl(locale: Locale, id: NavTabId): string {
  const prefix = locale === "it" ? "/it" : "";
  if (id === "about") {
    return prefix || "/";
  }

  return `${prefix}/${id}`;
}

const META_PREFIX: Record<NavTabId, string> = {
  about: "meta.home",
  development: "meta.development",
  audio: "meta.audio",
  contact: "meta.contact",
};

export interface NavRouteMetadata {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  englishUrl: string;
  italianUrl: string;
  switcherHref: string;
}

export function buildNavRouteMetadata(
  locale: Locale,
  id: NavTabId,
  t: (key: string) => string | unknown,
  site: URL,
): NavRouteMetadata {
  const urls = buildPageMetadataUrls(getLocalizedNavUrl(locale, id), site);
  const otherLocale: Locale = locale === "en" ? "it" : "en";

  return {
    title: String(t(`${META_PREFIX[id]}.title`)),
    description: String(t(`${META_PREFIX[id]}.description`)),
    canonical: urls.canonical,
    ogImage: urls.ogImage,
    englishUrl: urls.englishUrl,
    italianUrl: urls.italianUrl,
    switcherHref: getLocalizedNavUrl(otherLocale, id),
  };
}

export function buildNavTabs(
  t: (key: string) => string | unknown,
): NavTab[] {
  return [
    { id: "about", label: String(t("nav.about")), shortLabel: String(t("nav.about")) },
    { id: "development", label: String(t("nav.development")), shortLabel: "Dev" },
    { id: "audio", label: String(t("nav.audio")), shortLabel: "Audio" },
    { id: "contact", label: String(t("nav.contact")), shortLabel: String(t("nav.contact")) },
  ];
}

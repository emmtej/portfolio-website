import type { Locale } from "../utils/server-t";

export type NavTabId = "about" | "development" | "audio" | "contact";

export interface NavTab {
  id: NavTabId;
  label: string;
  shortLabel: string;
}

export const NAV_TAB_LINK_CLASS =
  "relative inline-flex h-chrome-control items-center gap-2 whitespace-nowrap shrink-0 snap-center -mb-px border-b-2 border-transparent text-xs font-bold uppercase tracking-wider md:tracking-widest text-inactive transition-colors hover:text-text-main";

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

export const socialLinkClassName =
  "social-link group flex w-full items-center gap-4 border-b border-border-subtle py-4 text-left transition-colors duration-normal hover:bg-text-main/[0.02] cursor-pointer appearance-none border-x-0 border-t-0 bg-transparent px-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-main/20";

export function getSocialLinkComponent(href: string) {
  return href.startsWith("mailto:") ? "button" : "a";
}

export function isMailtoLink(href: string) {
  return href.startsWith("mailto:");
}

export function getSocialLinkAriaLabel(
  label: string,
  value: string,
  isMailto: boolean,
) {
  return isMailto ? `Copy ${label}: ${value}` : `Visit ${label}: ${value}`;
}

export function getSocialLinkType(isMailto: boolean) {
  return isMailto ? "button" : undefined;
}

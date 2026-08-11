import { normalizePagePath } from "./normalizePagePath";

export interface PageMetadataUrls {
  pagePath: string;
  canonical: string;
  ogImage: string;
  englishUrl: string;
  italianUrl: string;
}

export function buildPageMetadataUrls(
  pathname: string,
  site: URL,
): PageMetadataUrls {
  const pagePath = normalizePagePath(pathname);
  const canonical = new URL(pagePath, site).href;
  const ogImage = new URL("/og-image.png", site).href;
  const defaultLocalePath = pagePath.replace(/^\/it(?=\/)/, "") || "/";
  const italianPath = defaultLocalePath === "/" ? "/it/" : `/it${defaultLocalePath}`;
  const englishUrl = new URL(defaultLocalePath, site).href;
  const italianUrl = new URL(italianPath, site).href;

  return {
    pagePath,
    canonical,
    ogImage,
    englishUrl,
    italianUrl,
  };
}

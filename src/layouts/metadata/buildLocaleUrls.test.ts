import { describe, expect, it } from "vitest";
import { buildPageMetadataUrls } from "./buildLocaleUrls";

const site = new URL("https://example.com");

describe("buildPageMetadataUrls", () => {
  it("builds canonical and social metadata for english pages", () => {
    expect(buildPageMetadataUrls("/contact", site)).toEqual({
      pagePath: "/contact/",
      canonical: "https://example.com/contact/",
      ogImage: "https://example.com/og-image.png",
      englishUrl: "https://example.com/contact/",
      italianUrl: "https://example.com/it/contact/",
    });
  });

  it("maps italian locale paths back to english alternates", () => {
    expect(buildPageMetadataUrls("/it/contact", site)).toEqual({
      pagePath: "/it/contact/",
      canonical: "https://example.com/it/contact/",
      ogImage: "https://example.com/og-image.png",
      englishUrl: "https://example.com/contact/",
      italianUrl: "https://example.com/it/contact/",
    });
  });

  it("uses the italian homepage alternate for the english root", () => {
    expect(buildPageMetadataUrls("/", site)).toEqual({
      pagePath: "/",
      canonical: "https://example.com/",
      ogImage: "https://example.com/og-image.png",
      englishUrl: "https://example.com/",
      italianUrl: "https://example.com/it/",
    });
  });
});

import { describe, expect, it } from "vitest";
import type { APIContext } from "astro";
import { GET } from "../pages/robots.txt";

describe("robots.txt endpoint", () => {
  it("uses the configured site and sitemap index", async () => {
    const response = await GET({
      site: new URL("https://www.emmanueltejeda.com"),
    } as APIContext);

    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(await response.text()).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://www.emmanueltejeda.com/sitemap-index.xml\n",
    );
  });

  it("rejects builds without a configured production site", () => {
    expect(() => GET({ site: undefined } as APIContext)).toThrow(
      "Astro site configuration is required for robots.txt.",
    );
  });
});

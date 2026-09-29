import { expect, test } from "@playwright/test";

const primaryOrigin = "https://www.emmanueltejeda.com";

const routeCases = [
  { path: "/", canonical: "/", english: "/", italian: "/it/" },
  { path: "/audio", canonical: "/audio/", english: "/audio/", italian: "/it/audio/" },
  { path: "/contact", canonical: "/contact/", english: "/contact/", italian: "/it/contact/" },
  { path: "/development", canonical: "/development/", english: "/development/", italian: "/it/development/" },
  { path: "/it", canonical: "/it/", english: "/", italian: "/it/" },
  { path: "/it/audio", canonical: "/it/audio/", english: "/audio/", italian: "/it/audio/" },
  { path: "/it/contact", canonical: "/it/contact/", english: "/contact/", italian: "/it/contact/" },
  { path: "/it/development", canonical: "/it/development/", english: "/development/", italian: "/it/development/" },
] as const;

for (const route of routeCases) {
  test(`uses aligned production metadata on ${route.path}`, async ({ page }) => {
    await page.goto(route.path);

    const canonical = `${primaryOrigin}${route.canonical}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    await expect(page.locator('meta[property="twitter:url"]')).toHaveAttribute("content", canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${primaryOrigin}/og-image.png`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      `${primaryOrigin}${route.english}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="it"]')).toHaveAttribute(
      "href",
      `${primaryOrigin}${route.italian}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      `${primaryOrigin}${route.english}`,
    );
  });
}

test("robots advertises the generated sitemap index", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toBe(
    `User-agent: *\nAllow: /\n\nSitemap: ${primaryOrigin}/sitemap-index.xml\n`,
  );
});

const errorCases = [
  {
    path: "/404.html",
    language: "en",
    title: "404 - Page Not Found",
    switchLabel: "Toggle language",
    switchTarget: "/it/",
  },
  {
    path: "/it/404/",
    language: "it",
    title: "404 - Pagina non trovata",
    switchLabel: "Cambia lingua",
    switchTarget: "/",
  },
] as const;

for (const errorPage of errorCases) {
  test(`keeps ${errorPage.language} 404 metadata non-indexable`, async ({ page }) => {
    await page.goto(errorPage.path);

    await expect(page.locator("html")).toHaveAttribute("lang", errorPage.language);
    await expect(page).toHaveTitle(errorPage.title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,follow",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    await expect(page.locator('meta[property="twitter:url"]')).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: errorPage.switchLabel }),
    ).toHaveAttribute("href", errorPage.switchTarget);
  });
}

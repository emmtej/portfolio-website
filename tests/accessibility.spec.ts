import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/development", "/audio", "/contact", "/it/development"];

test("each layout page exposes one main-content landmark", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator("#main-content")).toHaveCount(1);
    await expect(page.locator("main#main-content")).toHaveCount(1);
  }
});

test("skip link focuses the semantic main landmark", async ({ page }) => {
  await page.goto("/");

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await skipLink.focus();
  await expect(skipLink).toBeFocused();

  await skipLink.press("Enter");

  const main = page.locator("main#main-content");
  await expect(main).toBeFocused();
  await expect(page).toHaveURL(/\/#main-content$/);
});

test("stored dark theme applies", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark");
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
});

test("system dark theme applies without a stored preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    localStorage.removeItem("theme");
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
});

test("stored light theme keeps the root element light", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
});

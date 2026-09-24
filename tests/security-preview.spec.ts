import { expect, test, type ConsoleMessage } from "@playwright/test";

function collectCspErrors(messages: string[]) {
  return (message: ConsoleMessage) => {
    if (
      message.type() === "error" &&
      /content security policy|content-security-policy|refused to (?:load|execute|apply|connect|frame)/i.test(
        message.text(),
      )
    ) {
      messages.push(message.text());
    }
  };
}

test("production output stays interactive under hash-based CSP", async ({ page }) => {
  const cspErrors: string[] = [];
  page.on("console", collectCspErrors(cspErrors));

  for (const path of ["/", "/it/", "/development/", "/audio/", "/contact/"]) {
    await page.goto(path);
    const csp = page.locator('meta[http-equiv="content-security-policy"]');
    await expect(csp).toHaveCount(1);
    const policy = await csp.getAttribute("content");
    expect(policy).toContain("script-src 'self' 'sha256-");
    expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).toContain("connect-src 'self'");
    expect(policy).toContain("img-src 'self' data:");
  }

  await page.goto("/");
  await page.getByRole("link", { name: "Development" }).click();
  await expect(page).toHaveURL(/\/development\/?$/);
  const switchedGallery = page.locator('[data-island="project-gallery"]');
  await switchedGallery.scrollIntoViewIfNeeded();
  await expect(switchedGallery).toHaveAttribute("data-hydrated", "true");

  const html = page.locator("html");
  const themeToggle = page.getByRole("button", { name: "Toggle theme" });
  const startedDark = await html.evaluate((element) =>
    element.classList.contains("dark"),
  );
  await themeToggle.click();
  await expect(html).toHaveClass(startedDark ? /^(?!.*\bdark\b)/ : /\bdark\b/);

  await page.goto("/development/");
  const gallery = page.locator('[data-island="project-gallery"]');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-hydrated", "true");

  await page.goto("/contact/");
  const form = page.locator('form[data-contact-form="interactive"]');
  await form.scrollIntoViewIfNeeded();
  await expect(form).toHaveAttribute("data-hydrated", "true");

  expect(cspErrors).toEqual([]);
});

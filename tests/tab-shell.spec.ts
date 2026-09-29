import { expect, test, type Page } from "@playwright/test";

const primaryOrigin = "https://www.emmanueltejeda.com";

const routes = [
  { path: "/", tab: "about" },
  { path: "/development", tab: "development" },
  { path: "/audio", tab: "audio" },
  { path: "/contact", tab: "contact" },
] as const;

async function metadataSnapshot(page: Page) {
  return page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute("content"),
    ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
    twitterTitle: document.querySelector('meta[property="twitter:title"]')?.getAttribute("content"),
    twitterDescription: document.querySelector('meta[property="twitter:description"]')?.getAttribute("content"),
    twitterUrl: document.querySelector('meta[property="twitter:url"]')?.getAttribute("content"),
    twitterImage: document.querySelector('meta[property="twitter:image"]')?.getAttribute("content"),
    english: document.querySelector('link[hreflang="en"]')?.getAttribute("href"),
    italian: document.querySelector('link[hreflang="it"]')?.getAttribute("href"),
    xDefault: document.querySelector('link[hreflang="x-default"]')?.getAttribute("href"),
    switcher: document.querySelector("a[data-language-switcher]")?.getAttribute("href"),
    active: document.querySelector('a[aria-current="page"]')?.id,
  }));
}

test("client tab switches keep one document and match direct-entry metadata", async ({ page }) => {
  const expected = new Map<string, Awaited<ReturnType<typeof metadataSnapshot>>>();
  for (const route of routes) {
    await page.goto(route.path);
    expected.set(route.tab, await metadataSnapshot(page));
  }

  await page.goto("/");
  await page.evaluate(() => {
    (window as Window & { __shell?: number }).__shell = 1;
  });

  for (const route of routes.slice(1)) {
    await page.locator(`#tab-link-${route.tab}`).click();
    await expect(page).toHaveURL(new RegExp(`${route.path}/?$`));
    expect(await page.evaluate(() => (window as Window & { __shell?: number }).__shell)).toBe(1);
    await expect(page.locator("[data-tab-panel]:not([hidden])")).toHaveCount(1);
    await expect(page.locator(`#tab-panel-${route.tab}`)).toBeVisible();
    await expect(page.locator("#tab-route-status")).toHaveText(expected.get(route.tab)?.title ?? "");
    await expect(page.locator(`#tab-panel-${route.tab}`)).toBeFocused();
    expect(await metadataSnapshot(page)).toEqual(expected.get(route.tab));
  }

  for (const route of [...routes].reverse().slice(1)) {
    await page.goBack();
    expect(await metadataSnapshot(page)).toEqual(expected.get(route.tab));
    await expect(page.locator(`#tab-panel-${route.tab}`)).toBeFocused();
  }

  await page.goForward();
  expect(await metadataSnapshot(page)).toEqual(expected.get("development"));
  await expect(page.locator("#tab-panel-development")).toBeVisible();
});

test("italian history matches direct entry in both directions", async ({ page }) => {
  const italian = [
    { path: "/it/", tab: "about" },
    { path: "/it/development", tab: "development" },
    { path: "/it/audio", tab: "audio" },
    { path: "/it/contact", tab: "contact" },
  ] as const;
  const expected = new Map<string, Awaited<ReturnType<typeof metadataSnapshot>>>();
  for (const route of italian) {
    await page.goto(route.path);
    expected.set(route.tab, await metadataSnapshot(page));
  }

  await page.goto("/it/");
  for (const route of italian.slice(1)) {
    await page.locator(`#tab-link-${route.tab}`).click();
    await expect(page.locator(`#tab-panel-${route.tab}`)).toBeVisible();
    expect(await metadataSnapshot(page)).toEqual(expected.get(route.tab));
  }

  for (const route of [...italian].reverse().slice(1)) {
    await page.goBack();
    await expect(page.locator(`#tab-panel-${route.tab}`)).toBeVisible();
    expect(await metadataSnapshot(page)).toEqual(expected.get(route.tab));
  }

  await page.goForward();
  expect(await metadataSnapshot(page)).toEqual(expected.get("development"));
  expect(expected.get("audio")?.canonical).toBe(`${primaryOrigin}/it/audio/`);
});

test("keyboard activation focuses and announces the destination", async ({ page }) => {
  await page.goto("/");
  await page.locator("#tab-link-contact").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#tab-panel-contact")).toBeFocused();
  await expect(page.locator("#tab-route-status")).toHaveText(/Contact/);
  await expect(page.locator("#tab-panel-development")).toBeHidden();
});

test("same-tab click does not add history or reload", async ({ page }) => {
  await page.goto("/audio");
  await page.evaluate(() => {
    (window as Window & { __shell?: number }).__shell = 1;
  });
  const length = await page.evaluate(() => history.length);
  await page.locator("#tab-link-audio").click();
  await expect(page).toHaveURL(/\/audio\/?$/);
  expect(await page.evaluate(() => history.length)).toBe(length);
  expect(await page.evaluate(() => (window as Window & { __shell?: number }).__shell)).toBe(1);
});

test("modified clicks leave the current document", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    (window as Window & { __shell?: number }).__shell = 1;
  });
  await page.locator("#tab-link-contact").click({ modifiers: ["Control"] });
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => (window as Window & { __shell?: number }).__shell)).toBe(1);
});

test("a missing shell falls back to document navigation", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.getElementById("tab-panels-container")?.remove());
  await page.locator("#tab-link-audio").click();
  await expect(page).toHaveURL(/\/audio\/?$/);
  await expect(page.locator("#tab-panels-container")).toHaveCount(1);
});

test("contact fields survive a tab switch", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator('form[data-contact-form="interactive"]');
  await form.scrollIntoViewIfNeeded();
  await expect(form).toHaveAttribute("data-hydrated", "true");
  await form.getByRole("textbox", { name: /Name/i }).fill("Ada Lovelace");
  await page.locator("#tab-link-about").click();
  await page.locator("#tab-link-contact").click();
  await expect(form.getByRole("textbox", { name: /Name/i })).toHaveValue("Ada Lovelace");
});

test("new clicks scroll to the top and back restores the saved position", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.locator("#tab-link-development").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(600);
});

test("skip link still moves to main content", async ({ page }) => {
  await page.goto("/development");
  await page.locator('a[href="#main-content"]').focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator("#tab-panel-development")).toBeVisible();
});

test("leaving development removes an open project modal", async ({ page }) => {
  await page.goto("/");
  await page.locator("#tab-link-development").click();
  const gallery = page.locator('[data-island="project-gallery"]');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-hydrated", "true");
  await page.getByRole("button", { name: /^InVoice\./ }).click();
  await expect(page.getByRole("dialog", { name: "InVoice" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#tab-panel-about")).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");

  await page.goForward();
  await gallery.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /^InVoice\./ }).click();
  const dialog = page.getByRole("dialog", { name: "InVoice" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: /^InVoice\./ })).toBeFocused();
});

test("leaving audio pauses playback and returning does not autoplay", async ({ page }) => {
  await page.goto("/audio");
  const player = page.locator('[data-island="audio-player"]');
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-hydrated", "true");
  await page.getByRole("button", { name: /Play/i }).click();
  const iframe = page.locator("iframe");
  await expect(iframe).toBeVisible();
  await iframe.evaluate((frame: HTMLIFrameElement) => {
    frame.dataset.player = "kept";
    const commands: string[] = [];
    (window as Window & { __playerCommands?: string[] }).__playerCommands = commands;
    Object.defineProperty(frame, "contentWindow", {
      configurable: true,
      value: {
        postMessage: (data: string) => {
          commands.push(data);
        },
      },
    });
  });
  await page.locator("#tab-link-about").click();
  await expect(page.locator("#tab-panel-audio")).toBeHidden();
  expect(await page.evaluate(() => (window as Window & { __playerCommands?: string[] }).__playerCommands)).toContain(
    JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
  );
  await page.locator("#tab-link-audio").click();
  await expect(iframe).toHaveAttribute("data-player", "kept");
  await expect(page.getByRole("button", { name: /Play/i })).toBeVisible();
  await page.getByRole("button", { name: /Play/i }).click();
  await expect.poll(() =>
    page.evaluate(() => (window as Window & { __playerCommands?: string[] }).__playerCommands ?? []),
  ).toContain(JSON.stringify({ event: "command", func: "playVideo", args: "" }));
});

test("fragment history keeps the tab and restores scroll", async ({ page }) => {
  await page.goto("/development");
  await page.evaluate(() => window.scrollTo(0, 480));
  await page.locator('a[href="#main-content"]').focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await page.goBack();
  await expect(page.locator("#tab-panel-development")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(480);
  await page.goForward();
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator("#tab-panel-development")).toBeVisible();
});

test("forward restores scroll after rapid tab changes", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 450));
  await page.locator("#tab-link-development").click();
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.locator("#tab-link-audio").click();
  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(300);
  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(450);
  await page.goForward();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(300);
});

test("hidden panels stay out of tab order", async ({ page }) => {
  await page.goto("/");
  await page.locator("#tab-link-contact").focus();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest("[hidden]")))).toBe(false);
});

test("navigation works with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: "http://localhost:3000",
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("#tab-panel-about")).toBeVisible();
  await expect(page.locator("#tab-panel-development")).toBeHidden();
  await page.locator("#tab-link-contact").click();
  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(page.locator("#tab-panel-contact")).toBeVisible();
  await expect(page.locator("#tab-panel-about")).toBeHidden();

  await page.goto("/it/");
  await page.locator("#tab-link-audio").click();
  await expect(page).toHaveURL(/\/it\/audio\/?$/);
  await expect(page.locator("#tab-panel-audio")).toBeVisible();
  await context.close();
});

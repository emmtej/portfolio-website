import { expect, test, type Page } from "@playwright/test";

type IntroSample = {
  t: number;
  heading: number;
  nav: number;
  chrome: number;
  body: number;
  top: number;
  line: number;
};

async function installSampler(page: Page) {
  await page.addInitScript(() => {
    const samples: {
      t: number;
      heading: number;
      nav: number;
      chrome: number;
      body: number;
      top: number;
      line: number;
    }[] = [];
    let origin = 0;
    const tick = () => {
      const heading = document.querySelector("h1.intro-in");
      const nav = document.querySelector("[data-intro-end]");
      const chrome = document.querySelector("body > div > header");
      const line = document.querySelector(".intro-line");
      if (heading && nav && chrome && line) {
        if (origin === 0) origin = performance.now();
        const border = getComputedStyle(line).borderBottomColor;
        const slash = border.match(/\/\s*([\d.]+)/);
        const alpha = slash ? Number(slash[1]) : border === "transparent" ? 0 : 1;
        samples.push({
          t: performance.now() - origin,
          heading: Number(getComputedStyle(heading).opacity),
          nav: Number(getComputedStyle(nav).opacity),
          chrome: Number(getComputedStyle(chrome).opacity),
          body: Number(getComputedStyle(document.body).opacity),
          top: heading.getBoundingClientRect().top,
          line: alpha,
        });
      }
      if (origin === 0 || performance.now() - origin < 1800) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    (window as Window & { __introSamples?: typeof samples }).__introSamples = samples;
  });
}

async function readSamples(page: Page) {
  await page.waitForTimeout(1700);
  return page.evaluate(() => (window as Window & { __introSamples?: IntroSample[] }).__introSamples ?? []);
}

test("first visit fades the heading, then the rest, then stays visible", async ({ page }) => {
  await installSampler(page);
  await page.goto("/", { waitUntil: "commit" });

  const samples = await readSamples(page);
  const early = samples.find((sample) => sample.t < 120);
  const delayed = samples.find((sample) => sample.t > 720 && sample.t < 790 && sample.heading > 0.5 && sample.nav < 0.05 && sample.line < 0.05);
  const done = samples.find((sample) => sample.heading >= 0.99 && sample.nav >= 0.99 && sample.chrome >= 0.99);

  expect(early).toBeTruthy();
  expect(early!.heading).toBeLessThan(0.2);
  expect(early!.nav).toBeLessThan(0.05);
  expect(early!.chrome).toBeLessThan(0.05);
  expect(early!.body).toBe(1);
  expect(delayed).toBeTruthy();
  expect(done).toBeTruthy();
  expect(done!.t).toBeGreaterThan(1150);
  expect(done!.t).toBeLessThan(1600);
  expect(Math.max(...samples.map((sample) => sample.top)) - Math.min(...samples.map((sample) => sample.top))).toBeLessThan(1);

  await expect(page.locator("html")).not.toHaveAttribute("data-intro-play");
  await expect(page.locator("h1.intro-in")).toHaveCSS("opacity", "1");
  await expect(page.locator("[data-intro-end]")).toHaveCSS("opacity", "1");
  expect(await page.evaluate(() => localStorage.getItem("intro-seen"))).toBe("0");
  await expect(page.locator("h1.intro-in")).toContainText("Hello, I'm");
  await expect(page.locator("h1.intro-in")).toContainText("Emmanuel");
});

test("dev reloads, routes, and languages keep intro-seen at 0 and replay", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("intro-seen", "1");
  });

  for (const path of ["/", "/contact", "/it"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(await page.evaluate(() => localStorage.getItem("intro-seen"))).toBe("0");
    await expect(page.locator("h1.intro-in")).toHaveCSS("opacity", "1");
    await expect(page.locator("[data-intro-end]")).toHaveCSS("opacity", "1");
  }

  await page.reload({ waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => localStorage.getItem("intro-seen"))).toBe("0");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro-play");
});

test("same-document tab changes and history do not replay", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("intro-seen", "1"));
  await page.goto("/");
  await page.getByRole("link", { name: "Development" }).click();
  await expect(page).toHaveURL(/\/development$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-intro-play");
  await expect(page.locator("h1.intro-in")).toHaveCSS("opacity", "1");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-intro-play");
  await expect(page.locator("h1.intro-in")).toHaveCSS("opacity", "1");
  await expect(page.locator("#tab-panel-about")).toBeVisible();
});

test("reduced motion shows content and records the introduction", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("html")).not.toHaveAttribute("data-intro-play");
  await expect(page.locator("h1.intro-in")).toHaveCSS("opacity", "1");
  await expect(page.locator("[data-intro-end]")).toHaveCSS("opacity", "1");
  expect(await page.evaluate(() => localStorage.getItem("intro-seen"))).toBe("0");
});

test("reduced motion during playback reveals the interface immediately", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("html")).toHaveAttribute("data-intro-play", "");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("h1.intro-in")).toHaveCSS("opacity", "1");
  await expect(page.locator("[data-intro-end]")).toHaveCSS("opacity", "1");
  expect(await page.evaluate(() => localStorage.getItem("intro-seen"))).toBe("0");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro-play");
});

test("blocked storage and a page without the heading stay visible", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro");
  expect(await page.evaluate(() => localStorage.getItem("intro-seen"))).toBeNull();

  await page.addInitScript(() => {
    const fail = () => {
      throw new DOMException("blocked");
    };
    Storage.prototype.getItem = fail;
    Storage.prototype.setItem = fail;
  });
  await page.goto("/");
  await expect(page.locator("h1.intro-in")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-intro", "");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro-play");
});

test("disabled JavaScript leaves the heading visible", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: "http://localhost:3000",
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1.intro-in")).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-intro-play");
  await context.close();
});

test("keyboard focus reveals the interface immediately", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  await expect.poll(() => page.locator("h1.intro-in").evaluate((element) => getComputedStyle(element).opacity)).not.toBe("1");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await expect(page.locator("h1.intro-in")).toHaveCSS("opacity", "1");
  await expect(page.locator("[data-intro-end]")).toHaveCSS("opacity", "1");
  expect(await page.evaluate(() => localStorage.getItem("intro-seen"))).toBe("0");
});

test("mobile intro keeps the heading still and the nav sticky", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await installSampler(page);
  await page.goto("/", { waitUntil: "commit" });
  const samples = await readSamples(page);
  const tops = samples.map((sample) => sample.top);
  expect(tops.length).toBeGreaterThan(0);
  expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1);

  const layout = await page.evaluate(() => {
    const chrome = document.querySelector("body > div > header");
    const nav = document.querySelector("nav");
    const heading = document.querySelector("h1.intro-in");
    return {
      chrome: chrome ? getComputedStyle(chrome).position : "",
      sticky: nav?.parentElement ? getComputedStyle(nav.parentElement).position : "",
      transform: heading ? getComputedStyle(heading).transform : "",
    };
  });
  expect(layout.chrome).toBe("fixed");
  expect(layout.sticky).toBe("sticky");
  expect(layout.transform).toBe("none");
});

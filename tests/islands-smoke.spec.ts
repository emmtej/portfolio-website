import { expect, test, type Page } from "@playwright/test";

const ROME_NAV_DOT_HOST_ID = "rome-nav-availability-dot";

async function waitForRomeChrome(page: Page) {
  const chrome = page.locator('header [aria-live="polite"]');
  await expect(chrome).toBeVisible();
  await expect(chrome).toHaveAttribute("aria-label", /Italy/);
  return chrome;
}

async function waitForHydratedIsland(page: Page, island: string) {
  const root = page.locator(`[data-island="${island}"]`);
  await root.scrollIntoViewIfNeeded();
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute("data-hydrated", "true");
  return root;
}

async function waitForInteractiveContactForm(page: Page) {
  const form = page.locator('form[data-contact-form="interactive"]');
  await form.scrollIntoViewIfNeeded();
  await expect(form).toBeVisible();
  await expect(form).toHaveAttribute("data-hydrated", "true");
  return form;
}

test.describe("Islands smoke (Rome + client:visible)", () => {
  test("Rome chrome and nav Dot stay availability-synced", async ({ page }) => {
    await page.goto("/");
    await waitForRomeChrome(page);

    const navHost = page.locator(`#${ROME_NAV_DOT_HOST_ID}`);
    await expect(navHost).toBeVisible();

    await expect
      .poll(async () => {
        return page.evaluate((hostId) => {
          const chromeDot = document.querySelector(
            'header [aria-live="polite"] [aria-hidden="true"].rounded-full',
          );
          const navDot = document.querySelector(
            `#${hostId} [aria-hidden="true"].rounded-full`,
          );
          if (!chromeDot || !navDot) return "missing-dot";

          const chromeAvailable = chromeDot.classList.contains("bg-it-green");
          const navAvailable = navDot.classList.contains("bg-it-green");
          if (chromeAvailable !== navAvailable) return "desynced";

          // Portal owns the host: exactly one live indicator child.
          const host = document.getElementById(hostId);
          if (!host || host.childElementCount !== 1) return "host-not-portal-owned";

          return "synced";
        }, ROME_NAV_DOT_HOST_ID);
      })
      .toBe("synced");
  });

  test("contact form hydrates under client:visible before submit", async ({
    page,
  }) => {
    await page.goto("/contact");
    const form = await waitForInteractiveContactForm(page);

    await form.getByRole("button", { name: /Send Message/i }).click();
    await expect(
      form.getByText(/Name must be at least 2 characters/i),
    ).toBeVisible();
  });

  test("hidden islands stay unhydrated until their panels enter the viewport", async ({
    page,
  }) => {
    await page.goto("/");
    const gallery = page.locator('[data-island="project-gallery"]');
    const player = page.locator('[data-island="audio-player"]');
    const form = page.locator('form[data-contact-form="interactive"]');
    await expect(gallery).toHaveAttribute("data-hydrated", "false");
    await expect(player).toHaveAttribute("data-hydrated", "false");
    await expect(form).toHaveAttribute("data-hydrated", "false");

    await page.locator("#tab-link-development").click();
    await gallery.scrollIntoViewIfNeeded();
    await expect(gallery).toHaveAttribute("data-hydrated", "true");
    await expect(player).toHaveAttribute("data-hydrated", "false");

    await page.locator("#tab-link-audio").click();
    await player.scrollIntoViewIfNeeded();
    await expect(player).toHaveAttribute("data-hydrated", "true");

    await page.locator("#tab-link-contact").click();
    await form.scrollIntoViewIfNeeded();
    await expect(form).toHaveAttribute("data-hydrated", "true");
  });

  test("project gallery hydrates and opens modal", async ({ page }) => {
    await page.goto("/development");
    await waitForHydratedIsland(page, "project-gallery");

    const trigger = page.getByRole("button", { name: /^InVoice\./ });
    await trigger.click();

    await expect(page.getByRole("dialog", { name: "InVoice" })).toBeVisible();
  });

  test("audio player hydrates and starts playback shell", async ({ page }) => {
    await page.goto("/audio");
    await waitForHydratedIsland(page, "audio-player");

    await page.getByRole("button", { name: /Play/i }).click();

    await expect(page.locator("iframe")).toBeVisible();
    await expect(page.getByRole("button", { name: /Pause/i })).toBeVisible();
  });
});

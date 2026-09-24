import { expect, test, type Locator, type Page } from "@playwright/test";

interface ModalOpeningSample {
  elapsed: number;
  backdropOpacity: number | null;
  panelEffectiveOpacity: number | null;
  clientWidth: number;
  scrollY: number;
  cardLeft: number;
}

async function waitForHydratedGallery(page: Page) {
  const gallery = page.locator('[data-island="project-gallery"]');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-hydrated", "true");
}

async function openProjectModal(page: Page) {
  await page.goto("/development", { waitUntil: "networkidle" });
  await waitForHydratedGallery(page);

  const trigger = page.getByRole("button", { name: /^InVoice\./ });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "InVoice" });
  await expect(dialog).toBeVisible();

  return { dialog, trigger };
}

async function expectExitThenFocusReturn(
  dialog: Locator,
  trigger: Locator,
) {
  await expect(dialog).toBeAttached();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
}

test("project modal exits before focus returns to its trigger", async ({ page }) => {
  const { dialog, trigger } = await openProjectModal(page);
  await expect(
    page.getByRole("heading", { level: 2, name: "InVoice" }),
  ).toBeVisible();

  const closeButton = page.getByRole("button", {
    name: "Close project details",
  });
  await expect(closeButton).toBeFocused();

  const closeButtonBox = await closeButton.boundingBox();
  expect(closeButtonBox?.width).toBeGreaterThanOrEqual(44);
  expect(closeButtonBox?.height).toBeGreaterThanOrEqual(44);

  await closeButton.click();

  await expectExitThenFocusReturn(dialog, trigger);
});

test("Escape uses the modal exit and focus-return lifecycle", async ({ page }) => {
  const { dialog, trigger } = await openProjectModal(page);

  await page.keyboard.press("Escape");

  await expectExitThenFocusReturn(dialog, trigger);
});

test("backdrop uses the modal exit and focus-return lifecycle", async ({
  page,
}) => {
  const { dialog, trigger } = await openProjectModal(page);

  await page.locator("[data-modal-backdrop]").click({
    position: { x: 8, y: 8 },
  });

  await expectExitThenFocusReturn(dialog, trigger);
});

test("project modal backdrop avoids full-screen filters", async ({ page }) => {
  await openProjectModal(page);

  await expect(page.locator("[data-modal-backdrop]")).toHaveCSS(
    "backdrop-filter",
    "none",
  );
});

test("opening project modal keeps document width stable", async ({ page }) => {
  await page.goto("/development", { waitUntil: "networkidle" });
  await waitForHydratedGallery(page);

  const widthBefore = await page.evaluate(
    () => document.documentElement.clientWidth,
  );
  await page.getByRole("button", { name: /^InVoice\./ }).click();

  await expect(page.locator("html")).toHaveCSS("scrollbar-gutter", "stable");
  expect(
    await page.evaluate(() => document.documentElement.clientWidth),
  ).toBe(widthBefore);
});

test("project modal opening stays visually stable at 5ms intervals", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/development", { waitUntil: "networkidle" });
  await waitForHydratedGallery(page);

  const samples = await page.evaluate(
    () =>
      new Promise<ModalOpeningSample[]>((resolve) => {
        const trigger = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            '[data-island="project-gallery"] button',
          ),
        ).find((button) =>
          button.getAttribute("aria-label")?.startsWith("InVoice."),
        );

        if (!trigger) {
          resolve([]);
          return;
        }

        const startedAt = performance.now();
        const openingSamples: ModalOpeningSample[] = [];

        const captureSample = () => {
          const backdrop = document.querySelector<HTMLElement>(
            "[data-modal-backdrop]",
          );
          const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
          let panelEffectiveOpacity: number | null = null;

          if (dialog) {
            panelEffectiveOpacity = 1;
            let element: HTMLElement | null = dialog;
            while (element) {
              panelEffectiveOpacity *= Number.parseFloat(
                getComputedStyle(element).opacity,
              );
              element = element.parentElement;
            }
          }

          openingSamples.push({
            elapsed: performance.now() - startedAt,
            backdropOpacity: backdrop
              ? Number.parseFloat(getComputedStyle(backdrop).opacity)
              : null,
            panelEffectiveOpacity,
            clientWidth: document.documentElement.clientWidth,
            scrollY: window.scrollY,
            cardLeft: trigger.getBoundingClientRect().left,
          });
        };

        captureSample();
        const interval = window.setInterval(captureSample, 5);
        trigger.click();

        window.setTimeout(() => {
          window.clearInterval(interval);
          captureSample();
          resolve(openingSamples);
        }, 350);
      }),
  );

  await testInfo.attach("modal-opening-5ms-samples", {
    body: JSON.stringify(samples, null, 2),
    contentType: "application/json",
  });

  expect(samples.length).toBeGreaterThanOrEqual(40);
  expect(samples.some(({ backdropOpacity }) => backdropOpacity !== null)).toBe(
    true,
  );
  expect(new Set(samples.map(({ clientWidth }) => clientWidth)).size).toBe(1);
  expect(new Set(samples.map(({ scrollY }) => scrollY)).size).toBe(1);

  const cardPositions = samples.map(({ cardLeft }) => cardLeft);
  expect(Math.max(...cardPositions) - Math.min(...cardPositions)).toBeLessThan(
    0.1,
  );

  const panelOpacities = samples.flatMap(({ panelEffectiveOpacity }) =>
    panelEffectiveOpacity === null ? [] : [panelEffectiveOpacity],
  );
  expect(panelOpacities.every((opacity) => opacity === 1)).toBe(true);

  const backdropOpacities = samples.flatMap(({ backdropOpacity }) =>
    backdropOpacity === null ? [] : [backdropOpacity],
  );
  expect(backdropOpacities.every((opacity) => opacity === 1)).toBe(true);
});

test("project modal removes panel transforms for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/development", { waitUntil: "networkidle" });
  await waitForHydratedGallery(page);

  await page.getByRole("button", { name: /^InVoice\./ }).click();

  const dialog = page.getByRole("dialog", { name: "InVoice" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("transform", "none");
});

test("project modal localizes its close control in Italian", async ({ page }) => {
  await page.goto("/it/development", { waitUntil: "networkidle" });
  await waitForHydratedGallery(page);

  await page.getByRole("button", { name: /^InVoice\./ }).click();

  await expect(page.getByRole("dialog", { name: "InVoice" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Chiudi dettagli progetto" }),
  ).toBeVisible();
});

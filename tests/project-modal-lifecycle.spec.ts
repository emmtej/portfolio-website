import { expect, test, type Locator, type Page } from "@playwright/test";

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

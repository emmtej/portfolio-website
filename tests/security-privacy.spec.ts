import { expect, test } from "@playwright/test";

const thirdPartyMediaPattern =
  /(?:youtube(?:-nocookie)?\.com|youtu\.be|ytimg\.com|googlevideo\.com|google\.com)/i;

for (const path of ["/", "/development", "/contact"]) {
  test(`${path} contacts no Google or YouTube host until audio is visible`, async ({ page }) => {
    const thirdPartyRequests: string[] = [];
    page.on("request", (request) => {
      if (thirdPartyMediaPattern.test(new URL(request.url()).hostname)) {
        thirdPartyRequests.push(request.url());
      }
    });

    await page.goto(path);
    const player = page.locator('[data-island="audio-player"]');
    await expect(page.locator("#tab-panel-audio")).toBeHidden();
    await page.waitForTimeout(500);
    await expect(player.locator("iframe")).toHaveCount(0);
    expect(thirdPartyRequests).toEqual([]);

    await page.locator("#tab-link-audio").click();
    await expect(page.locator("#tab-panel-audio")).toBeVisible();
    await player.scrollIntoViewIfNeeded();
    await expect(player).toHaveAttribute("data-hydrated", "true");
    await expect(player.locator("iframe")).toHaveAttribute(
      "src",
      /^https:\/\/www\.youtube-nocookie\.com\/embed\/9AVBGNRMMZM/,
    );
    await expect.poll(() => thirdPartyRequests.some((url) =>
      new URL(url).origin === "https://www.youtube-nocookie.com",
    )).toBe(true);
    await expect(player.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  });
}

test("audio mounts the paused player before Play", async ({ page }) => {
  await page.goto("/audio");
  const player = page.locator('[data-island="audio-player"]');
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-hydrated", "true");
  const iframe = player.locator("iframe");
  await expect(iframe).toBeVisible();
  const url = new URL((await iframe.getAttribute("src"))!);
  expect(url.origin).toBe("https://www.youtube-nocookie.com");
  expect(url.searchParams.has("autoplay")).toBe(false);
  expect(url.searchParams.has("controls")).toBe(false);
  await expect(player.getByRole("button", { name: "Play", exact: true })).toBeVisible();
});

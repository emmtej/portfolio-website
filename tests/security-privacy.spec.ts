import { expect, test } from "@playwright/test";

const thirdPartyMediaPattern =
  /(?:youtube(?:-nocookie)?\.com|youtu\.be|ytimg\.com|googlevideo\.com|google\.com)/i;

test("audio contacts no Google or YouTube host before activation", async ({ page }) => {
  const thirdPartyRequests: string[] = [];
  page.on("request", (request) => {
    if (thirdPartyMediaPattern.test(new URL(request.url()).hostname)) {
      thirdPartyRequests.push(request.url());
    }
  });

  await page.goto("/audio");
  const player = page.locator('[data-island="audio-player"]');
  await player.scrollIntoViewIfNeeded();
  await expect(player).toHaveAttribute("data-hydrated", "true");
  await expect(player.locator("iframe")).toHaveCount(0);
  await page.waitForTimeout(500);

  expect(thirdPartyRequests).toEqual([]);

  await page.getByRole("button", { name: "Play" }).click();
  await expect(player.locator("iframe")).toHaveAttribute(
    "src",
    /^https:\/\/www\.youtube-nocookie\.com\/embed\/9AVBGNRMMZM/,
  );
});

import { test, expect } from '@playwright/test';
import {
  isLanguageSwitcherClickable,
  measureResponsiveHeaderLayout,
  measureStickyNavLayout,
} from './helpers/layout-audit';

test.use({ viewport: { width: 390, height: 844 } });

test.describe('Chrome and sticky nav layout', () => {
  test('header stays inside 320px and 375px viewports in both locales', async ({ page }) => {
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 844 });

      for (const path of ['/', '/it']) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);

        const layout = await page.evaluate(measureResponsiveHeaderLayout);

        expect(
          layout.documentWidth,
          `${path} at ${width}px should not overflow: ${JSON.stringify(layout.overflowingElements)}`,
        ).toBeLessThanOrEqual(layout.viewportWidth);
        expect(layout.headerLeft).not.toBeNull();
        expect(layout.headerLeft!).toBeGreaterThanOrEqual(0);
        expect(layout.headerRight).not.toBeNull();
        expect(layout.headerRight!).toBeLessThanOrEqual(layout.viewportWidth);
        expect(layout.metadataWidth).not.toBeNull();
        expect(layout.metadataWidth!).toBeLessThanOrEqual(layout.viewportWidth - 48);
      }
    }
  });

  test('sticky nav sits flush below fixed chrome when scrolled', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.waitForTimeout(400);

    const layout = await page.evaluate(measureStickyNavLayout);

    expect(layout.gap).not.toBeNull();
    expect(Math.abs(layout.gap!)).toBeLessThanOrEqual(2);
    // chrome-height = chrome-inset (1.5rem) + chrome-control (2.75rem / 44px)
    expect(layout.headerHeight).toBeCloseTo(68, 0);
    expect(layout.chromeBg).not.toMatch(/rgba?\(0,\s*0,\s*0,\s*0\)/);
    expect(layout.overlap).toBe(false);
  });

  test('utility chrome controls stay clickable when nav is stuck', async ({ page }) => {
    await page.goto('/it');
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.waitForTimeout(400);

    const langHit = await page.evaluate(isLanguageSwitcherClickable);

    expect(langHit).toBe(true);
  });
});

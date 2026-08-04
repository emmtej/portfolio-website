import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test.describe('Chrome and sticky nav layout', () => {
  test('header stays inside 320px and 375px viewports in both locales', async ({ page }) => {
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 844 });

      for (const path of ['/', '/it']) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);

        const layout = await page.evaluate(() => {
          const header = document.querySelector('main header');
          const metadata = header?.firstElementChild;
          const headerRect = header?.getBoundingClientRect();
          const metadataRect = metadata?.getBoundingClientRect();
          const overflowingElements = [...document.querySelectorAll('body *')]
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              return rect.width > 0 && (rect.left < 0 || rect.right > window.innerWidth);
            })
            .slice(0, 8)
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                tag: element.tagName.toLowerCase(),
                className: element.className.toString().slice(0, 120),
                text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
              };
            });

          return {
            viewportWidth: window.innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            headerLeft: headerRect?.left ?? null,
            headerRight: headerRect?.right ?? null,
            metadataWidth: metadataRect?.width ?? null,
            overflowingElements,
          };
        });

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

    const layout = await page.evaluate(() => {
      const chrome = document.querySelector('body > div > header');
      const navWrap = document.querySelector('nav[aria-label="Primary"]')?.parentElement;
      const availability = document.querySelector('[aria-live="polite"]');
      const c = chrome?.getBoundingClientRect();
      const n = navWrap?.getBoundingClientRect();

      const overlap = [...document.querySelectorAll('nav[aria-label="Primary"] a')].some((link) => {
        const r = link.getBoundingClientRect();
        const a = availability?.getBoundingClientRect();
        if (!a) return false;
        return !(r.right <= a.left || r.left >= a.right || r.bottom <= a.top || r.top >= a.bottom);
      });

      return {
        gap: c && n ? n.top - c.bottom : null,
        headerHeight: c?.height ?? null,
        chromeBg: chrome ? getComputedStyle(chrome).backgroundColor : null,
        overlap,
      };
    });

    expect(layout.gap).not.toBeNull();
    expect(Math.abs(layout.gap!)).toBeLessThanOrEqual(2);
    expect(layout.headerHeight).toBeCloseTo(60, 0);
    expect(layout.chromeBg).not.toMatch(/rgba?\(0,\s*0,\s*0,\s*0\)/);
    expect(layout.overlap).toBe(false);
  });

  test('utility chrome controls stay clickable when nav is stuck', async ({ page }) => {
    await page.goto('/it');
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.waitForTimeout(400);

    const langHit = await page.evaluate(() => {
      const lang = document.querySelector('header a[aria-label]');
      if (!lang) return false;
      const rect = lang.getBoundingClientRect();
      const el = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return lang.contains(el) || lang === el;
    });

    expect(langHit).toBe(true);
  });
});

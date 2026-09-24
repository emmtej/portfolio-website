import { test, expect } from '@playwright/test';

test.describe('Active Tab Styling', () => {
  const cases = [
    { path: '/', expectedTab: 'ABOUT' },
    { path: '/development', expectedTab: 'DEVELOPMENT' },
    { path: '/development/', expectedTab: 'DEVELOPMENT' },
    { path: '/audio', expectedTab: 'AUDIO' },
    { path: '/audio/', expectedTab: 'AUDIO' },
    { path: '/contact', expectedTab: 'CONTACT' },
    { path: '/contact/', expectedTab: 'CONTACT' },
    { path: '/it', expectedTab: 'CHI SONO' },
    { path: '/it/', expectedTab: 'CHI SONO' },
    { path: '/it/development', expectedTab: 'SVILUPPO' },
    { path: '/it/development/', expectedTab: 'SVILUPPO' },
  ];

  for (const { path, expectedTab } of cases) {
    test(`tab "${expectedTab}" should be active on ${path}`, async ({ page }) => {
      await page.goto(path);
      
      // The active tab has 'border-text-main' and 'text-text-main' classes
      const activeLink = page.locator('nav[aria-label="Primary"] a[aria-current="page"]');
      await expect(activeLink).toBeVisible();
      await expect(activeLink).toHaveText(new RegExp(expectedTab, 'i'));
      const inactiveLink = page.locator('nav[aria-label="Primary"] a:not([aria-current="page"])').first();
      const activeStyle = await activeLink.evaluate((element) => {
        const style = getComputedStyle(element);
        return { border: style.borderBottomColor, color: style.color };
      });
      const inactiveStyle = await inactiveLink.evaluate((element) => {
        const style = getComputedStyle(element);
        return { border: style.borderBottomColor, color: style.color };
      });
      expect(activeStyle.border).not.toBe(inactiveStyle.border);
      expect(activeStyle.color).not.toBe(inactiveStyle.color);
    });
  }
});

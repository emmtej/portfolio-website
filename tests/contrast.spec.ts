import { expect, test } from '@playwright/test';
import { auditSemanticTextContrast } from './helpers/contrast-audit';

const ROUTES = ['/', '/development', '/audio', '/contact'];
const SEMANTIC_TEXT_SELECTOR = [
  '.text-secondary',
  '.text-tertiary',
  '.text-inactive',
  '.placeholder-secondary',
  '.text-text-secondary',
  '.text-text-tertiary',
  '.text-text-inactive',
  '.text-it-green',
  '.text-it-red',
].join(', ');

test('semantic text colors meet WCAG AA in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await page.goto('/');
    await page.evaluate((value) => localStorage.setItem('theme', value), theme);

    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveClass(
        theme === 'dark' ? /\bdark\b/ : /^(?!.*\bdark\b)/,
      );

      const audit = await page
        .locator(SEMANTIC_TEXT_SELECTOR)
        .evaluateAll(auditSemanticTextContrast);

      expect(audit.count, `${theme} ${route} should expose semantic text`).toBeGreaterThan(0);
      expect(
        audit.violations.map(
          (violation) =>
            `${violation.selector} ratio=${violation.ratio.toFixed(2)} text="${violation.text}"`,
        ),
        `${theme} ${route} contrast failures`,
      ).toEqual([]);
    }
  }
});

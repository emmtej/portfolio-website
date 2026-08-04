import { expect, test } from '@playwright/test';

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

      const audit = await page.locator(SEMANTIC_TEXT_SELECTOR).evaluateAll((elements) => {
        type Rgba = [number, number, number, number];

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('Canvas context unavailable');

        const toRgba = (color: string): Rgba => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
          return [red, green, blue, alpha / 255];
        };

        const composite = (foreground: Rgba, background: Rgba): Rgba => {
          const alpha = foreground[3] + background[3] * (1 - foreground[3]);
          if (alpha === 0) return [0, 0, 0, 0];
          return [
            (foreground[0] * foreground[3] + background[0] * background[3] * (1 - foreground[3])) / alpha,
            (foreground[1] * foreground[3] + background[1] * background[3] * (1 - foreground[3])) / alpha,
            (foreground[2] * foreground[3] + background[2] * background[3] * (1 - foreground[3])) / alpha,
            alpha,
          ];
        };

        const effectiveBackground = (element: Element): Rgba => {
          const layers: Rgba[] = [];
          let current: Element | null = element;
          while (current) {
            layers.push(toRgba(getComputedStyle(current).backgroundColor));
            current = current.parentElement;
          }
          return layers
            .reverse()
            .reduce(
              (background, layer) => composite(layer, background),
              [255, 255, 255, 1],
            );
        };

        const luminance = ([red, green, blue]: Rgba) => {
          const linearize = (channel: number) => {
            const value = channel / 255;
            return value <= 0.04045
              ? value / 12.92
              : Math.pow((value + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
        };

        const ratio = (foreground: Rgba, background: Rgba) => {
          const foregroundLuminance = luminance(foreground);
          const backgroundLuminance = luminance(background);
          return (
            (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
            (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
          );
        };

        const samples = elements
          .filter((element) => element.getClientRects().length > 0)
          .map((element) => {
            const background = effectiveBackground(element);
            const isPlaceholder = element.classList.contains('placeholder-secondary');
            const color = getComputedStyle(
              element,
              isPlaceholder ? '::placeholder' : undefined,
            ).color;
            const foreground = composite(toRgba(color), background);
            return {
              text: (element.textContent || element.getAttribute('placeholder') || '').trim().slice(0, 80),
              ratio: ratio(foreground, background),
            };
          });

        return {
          count: samples.length,
          violations: samples.filter((sample) => sample.ratio < 4.5),
        };
      });

      expect(audit.count, `${theme} ${route} should expose semantic text`).toBeGreaterThan(0);
      expect(audit.violations, `${theme} ${route} contrast failures`).toEqual([]);
    }
  }
});

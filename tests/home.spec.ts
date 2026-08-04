import { test, expect } from '@playwright/test';

const HOME_TITLE = 'Emmanuel T. || Software Developer';
const GREETING_EN = "Hello, I'm";
const GREETING_IT = 'Ciao, sono';
const NAME = 'Emmanuel';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(HOME_TITLE);
  });

  test('should display greeting', async ({ page }) => {
    const greeting = page.getByRole('heading', { level: 1 });
    await expect(greeting).toContainText(GREETING_EN);
    await expect(greeting).toContainText(NAME);
  });

  test('should navigate to Development page', async ({ page }) => {
    await page.getByRole('link', { name: 'Development' }).click();
    await expect(page).toHaveURL(/\/development$/);
  });

  test('should switch language to Italian', async ({ page }) => {
    await page.getByRole('link', { name: 'Toggle language' }).click();

    await expect(page).toHaveURL(/\/it\/?$/);
    const greeting = page.getByRole('heading', { level: 1 });
    await expect(greeting).toContainText(GREETING_IT);
    await expect(greeting).toContainText(NAME);
  });
});

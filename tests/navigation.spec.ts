import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', title: /Emmanuel T\. || Software Developer/ },
  { path: '/development', title: /Emmanuel T\. || Development/ },
  { path: '/audio', title: /Emmanuel T\. || Audio Mixing & Mastering/ },
  { path: '/contact', title: /Emmanuel T\. || Contact/ },
];

test.describe('Navigation & Metadata', () => {
  for (const pageData of PAGES) {
    test(`should have correct metadata for ${pageData.path}`, async ({ page }) => {
      await page.goto(pageData.path);
      await expect(page).toHaveTitle(pageData.title);
    });
  }

  test('should navigate through all tabs', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav[aria-label="Primary"]');
    
    const tabs = [
      { name: /Development/i, url: /\/development/ },
      { name: /Audio/i, url: /\/audio/ },
      { name: /Contact/i, url: /\/contact/ },
      { name: /About/i, url: /($|\/$)/ },
    ];

    for (const tab of tabs) {
      await nav.getByRole('link', { name: tab.name }).click();
      await expect(page).toHaveURL(tab.url);
    }
  });
});

async function waitForInteractiveContactForm(page: import('@playwright/test').Page) {
  const form = page.locator('form[data-contact-form="interactive"]');
  await form.waitFor({ state: 'visible' });
  return form;
}

test.describe('Contact Form', () => {
  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/contact');
    const form = await waitForInteractiveContactForm(page);
    const submit = form.getByRole('button', { name: /Send Message/i });

    await expect(async () => {
      await submit.click();
      await expect(form.getByText(/Name must be at least 2 characters/i)).toBeVisible();
    }).toPass({ timeout: 20_000 });

    await expect(form.getByText(/Invalid email address/i)).toBeVisible();
    await expect(form.getByText(/Message must be at least 10 characters/i)).toBeVisible();
  });

  test('should allow filling the form', async ({ page }) => {
    await page.goto('/contact');
    const form = await waitForInteractiveContactForm(page);

    await expect(async () => {
      await form.getByRole('textbox', { name: /Name/i }).fill('John Doe');
      await form.getByRole('textbox', { name: /^Email$/i }).fill('john@example.com');
      await form.getByRole('textbox', { name: /Message/i }).fill('This is a test message that is long enough.');
      await expect(form.getByRole('button', { name: /Send Message/i })).toBeEnabled();
    }).toPass({ timeout: 20_000 });
  });
});

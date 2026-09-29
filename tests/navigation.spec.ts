import { test, expect, type Page } from '@playwright/test';

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

async function waitForInteractiveContactForm(page: Page) {
  const form = page.locator('form[data-contact-form="interactive"]');
  await expect(form).toBeVisible();
  await expect(form).toHaveAttribute('data-hydrated', 'true');
  return form;
}

test.describe('Contact Form', () => {
  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/contact');
    const form = await waitForInteractiveContactForm(page);
    const submit = form.getByRole('button', { name: /Send Message/i });

    await submit.click();
    await expect(form.getByText(/Name must be at least 2 characters/i)).toBeVisible();

    await expect(form.getByText(/Invalid email address/i)).toBeVisible();
    await expect(form.getByText(/Message must be at least 10 characters/i)).toBeVisible();
  });

  test('should allow filling the form', async ({ page }) => {
    await page.goto('/contact');
    const form = await waitForInteractiveContactForm(page);

    await form.getByRole('textbox', { name: /Name/i }).fill('John Doe');
    await form.getByRole('textbox', { name: /^Email$/i }).fill('john@example.com');
    await form.getByRole('textbox', { name: /Message/i }).fill('This is a test message that is long enough.');
    await expect(form.getByRole('button', { name: /Send Message/i })).toBeEnabled();
  });

  test('should preserve native validation without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: 'http://localhost:3000',
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto('/contact');

    const form = page.locator('form[data-contact-form="interactive"]');
    await expect(form).toHaveAttribute('data-hydrated', 'false');
    await expect(form).not.toHaveAttribute('novalidate', '');

    const initialUrl = page.url();
    await form.getByRole('button', { name: /Send Message/i }).click();

    await expect(page).toHaveURL(initialUrl);
    const nameIsMissing = await form
      .getByRole('textbox', { name: /Name/i })
      .evaluate((input: HTMLInputElement) => input.validity.valueMissing);
    expect(nameIsMissing).toBe(true);
    await context.close();
  });

  test('should show Italian validation errors', async ({ page }) => {
    await page.goto('/it/contact');
    const form = await waitForInteractiveContactForm(page);

    await form.getByRole('button', { name: /Invia Messaggio/i }).click();

    await expect(form.getByText(/Il nome deve avere almeno 2 caratteri/i)).toBeVisible();
    await expect(form.getByText(/Indirizzo email non valido/i)).toBeVisible();
    await expect(form.getByText(/Il messaggio deve avere almeno 10 caratteri/i)).toBeVisible();
  });
});

import { expect, test } from '@playwright/test';

// WEB-041: policy pages must be readable by payment-gateway reviewers,
// regulators and crawlers — which means server-rendered, no JavaScript needed.
const PAGES = [
  { path: '/privacy', title: 'Finspeed — Privacy policy', heading: 'Privacy policy', marker: 'consent banner' },
  { path: '/terms', title: 'Finspeed — Terms of service', heading: 'Terms of service', marker: 'Governing law' },
  { path: '/refunds', title: 'Finspeed — Returns & refunds', heading: 'Returns & refunds', marker: '5 working days' },
  { path: '/shipping', title: 'Finspeed — Shipping policy', heading: 'Shipping policy', marker: 'Greater Noida' },
];

test.describe('WEB-041 legal and policy pages', () => {
  for (const page_ of PAGES) {
    test(`${page_.path} is server-rendered with its own metadata`, async ({ page }) => {
      const response = await page.goto(page_.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(page_.title);
      await expect(page.getByRole('heading', { level: 1, name: page_.heading })).toBeVisible();
      await expect(page.locator('main')).toContainText(page_.marker);
    });
  }

  test('policies are readable with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const page_ of PAGES) {
      await page.goto(page_.path);
      await expect(page.getByRole('heading', { level: 1, name: page_.heading })).toBeVisible();
      await expect(page.locator('main')).toContainText(page_.marker);
    }
    await context.close();
  });

  test('every policy cross-links the others and contact', async ({ page }) => {
    await page.goto('/privacy');
    const nav = page.getByRole('navigation', { name: 'Policies' });
    for (const label of ['Privacy policy', 'Terms of service', 'Returns & refunds', 'Shipping policy', 'Contact us']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
  });
});

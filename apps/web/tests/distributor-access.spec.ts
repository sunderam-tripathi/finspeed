import { expect, test, type Page } from '@playwright/test';

const PORTAL_PATHS = [
  '/distributor',
  '/distributor/price-list',
  '/distributor/order-builder',
  '/distributor/orders',
  '/distributor/invoices',
  '/distributor/account',
  '/distributor/support',
];

// Chrome exposes the price table as a layout table, so `columnheader` does not
// resolve — assert on the cell itself.
const DEALER_PRICE_HEADER = (page: Page) => page.locator('th', { hasText: 'Distributor price' });

async function prepare(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('finspeed-consent', 'denied');
  });
}

async function signIn(page: Page) {
  await page.goto('/distributor/sign-in');
  await page.getByLabel('Dealer ID or email').fill('ravi@ravistores.in');
  await page.getByLabel('Password').fill('preview');
  await page.getByRole('button', { name: 'Enter portal' }).click();
  await expect(page).toHaveURL(/\/distributor$/);
}

test.describe('distributor portal access', () => {
  test('every portal path redirects to sign in without a session', async ({ page }) => {
    await prepare(page);
    for (const path of PORTAL_PATHS) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/distributor\/sign-in$/);
      await expect(page.getByRole('heading', { level: 1, name: 'Distributor sign in' })).toBeVisible();
    }
  });

  test('dealer cost prices and margins stay hidden until sign in', async ({ page }) => {
    await prepare(page);
    await page.goto('/distributor/price-list');

    await expect(DEALER_PRICE_HEADER(page)).toHaveCount(0);
    await expect(page.getByText('37.9%')).toHaveCount(0);
    await expect(page.getByText(/Avg distributor margin/)).toHaveCount(0);
  });

  test('the sign-in screen states that credentials are not verified', async ({ page }) => {
    await prepare(page);
    await page.goto('/distributor/sign-in');

    await expect(page.getByText(/Preview only\. Credentials are not verified/i)).toBeVisible();
    await expect(page.getByLabel('Dealer ID or email')).toHaveValue('');
    await expect(page.getByLabel('Password')).toHaveValue('');
  });

  test('signing in opens the portal and signing out closes it again', async ({ page }) => {
    await prepare(page);
    await signIn(page);

    // In-app navigation only — the session lives in memory, so a full page
    // load is expected to drop it (covered by the reload test below).
    await page.getByRole('button', { name: 'Price list' }).click();
    await expect(page).toHaveURL(/\/distributor\/price-list$/);
    await expect(DEALER_PRICE_HEADER(page)).toBeVisible();
    await expect(page.getByText('37.9%')).toBeVisible();

    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/distributor\/sign-in$/);
    await expect(DEALER_PRICE_HEADER(page)).toHaveCount(0);
  });

  test('a reload drops the session rather than leaving the portal open', async ({ page }) => {
    await prepare(page);
    await signIn(page);

    await page.reload();
    await expect(page).toHaveURL(/\/distributor\/sign-in$/);
  });
});

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
  await page.getByLabel('Access passphrase').fill('preview');
  await page.getByRole('button', { name: 'Enter portal' }).click();
  // First hit compiles the session API route in dev; allow for the cold start.
  await expect(page).toHaveURL(/\/distributor$/, { timeout: 20_000 });
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

  test('the sign-in screen states the invited-access truth with no prefilled values', async ({ page }) => {
    await prepare(page);
    await page.goto('/distributor/sign-in');

    // WEB-040 contract change: the passphrase IS verified now, so the old
    // "credentials are not verified" statement would be false. The notice
    // keeps the remaining honest limits: invitation access, unlinked dealer
    // IDs, sample data.
    await expect(page.getByText(/Access is limited to invited partners and the passphrase is verified/i)).toBeVisible();
    await expect(page.getByText(/Dealer IDs are not yet linked to individual accounts/i)).toBeVisible();
    await expect(page.getByLabel('Dealer ID or email')).toHaveValue('');
    await expect(page.getByLabel('Access passphrase')).toHaveValue('');
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

  test('the portal dataset endpoint refuses requests without a session', async ({ request }) => {
    const bare = await request.get('/api/distributor/portal');
    expect(bare.status()).toBe(401);
    expect((await bare.json()).error).toContain('session');

    const forged = await request.get('/api/distributor/portal', {
      headers: { Authorization: 'Bearer 9999999999999.deadbeef' },
    });
    expect(forged.status()).toBe(401);
  });

  test('a minted session token unlocks the portal dataset', async ({ request }) => {
    const session = await request.post('/api/distributor/session', { data: { passphrase: 'preview' } });
    expect(session.status()).toBe(200);
    expect(session.headers()['cache-control']).toContain('no-store');
    const { token } = await session.json();
    expect(typeof token).toBe('string');

    const response = await request.get('/api/distributor/portal', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toContain('no-store');
    const { portal } = await response.json();
    expect(portal.products.some((row: { dp: number }) => row.dp === 3300)).toBe(true);
    expect(portal.orderDetails['PO-2451']).toBeTruthy();
  });

  test('a wrong passphrase is rejected with an inline error and no session', async ({ page, request }) => {
    const denied = await request.post('/api/distributor/session', { data: { passphrase: 'wrong-passphrase' } });
    expect(denied.status()).toBe(401);
    const bodiless = await request.post('/api/distributor/session');
    expect(bodiless.status()).toBe(401);

    await prepare(page);
    await page.goto('/distributor/sign-in');
    await page.getByLabel('Dealer ID or email').fill('ravi@ravistores.in');
    await page.getByLabel('Access passphrase').fill('wrong-passphrase');
    await page.getByRole('button', { name: 'Enter portal' }).click();

    await expect(page.getByRole('alert').filter({ hasText: 'not recognised' })).toBeVisible({ timeout: 20_000 });
    await expect(page).toHaveURL(/\/distributor\/sign-in$/);
    await expect(DEALER_PRICE_HEADER(page)).toHaveCount(0);
  });

  test('the portal has no client-side pricing fallback when the dataset API fails', async ({ page }) => {
    await prepare(page);
    await page.route('**/api/distributor/portal', (route) => route.abort());
    await signIn(page);

    await expect(page.getByText('The portal data could not be loaded.')).toBeVisible();
    await expect(DEALER_PRICE_HEADER(page)).toHaveCount(0);
    await expect(page.getByText('37.9%')).toHaveCount(0);

    await page.unroute('**/api/distributor/portal');
    await page.getByRole('button', { name: 'Try again' }).click();
    await page.getByRole('button', { name: 'Price list' }).click();
    await expect(DEALER_PRICE_HEADER(page)).toBeVisible();
    await expect(page.getByText('37.9%')).toBeVisible();
  });
});

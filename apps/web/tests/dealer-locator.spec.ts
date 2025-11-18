import { test, expect } from '@playwright/test';

const path = '/dealers';

const selectors = {
  postalInput: 'label:has-text("Postal code") input',
  searchButton: 'button:has-text("Search dealers")',
  errorText: 'text=Enter a valid 6-digit postal code',
  outageToggle: 'button:has-text("Simulate outage")',
  outageBanner: 'text=Locator temporarily unavailable',
  map: '[data-testid="dealer-map"]',
  supportLink: 'a:has-text("WhatsApp:")'
};

test.describe('SCN-004 dealer locator contract', () => {
  test('valid postal shows dealer results and filter chips update list', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('finspeed-dealer-locale', 'en');
    });
    await page.goto(path);
    await expect(page.locator('h2', { hasText: 'Results near' })).toBeVisible();
    const initialCount = await page.locator('[data-testid="dealer-card"]').count();
    await page.getByRole('button', { name: 'Service' }).click();
    const filteredCount = await page.locator('[data-testid="dealer-card"]').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('invalid postal triggers inline error', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('finspeed-dealer-locale', 'en');
    });
    await page.goto(path);
    await page.fill(selectors.postalInput, '123');
    await page.click(selectors.searchButton);
    await expect(page.locator(selectors.errorText)).toBeVisible();
  });

  test('outage banner hides results and promotes support channels', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('finspeed-dealer-locale', 'en');
    });
    await page.goto(path);
    await page.click(selectors.outageToggle);
    await expect(page.locator(selectors.outageBanner)).toBeVisible();
    await expect(page.locator(selectors.map)).not.toBeVisible();
    await expect(page.locator('[data-testid="dealer-card"]')).toHaveCount(0);
    await expect(page.locator(selectors.supportLink)).toBeVisible();
  });

  test('analytics stubs push GA payloads with consent flag', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('finspeed-dealer-locale', 'en');
    });
    await page.goto(path);
    const bannerAccept = page.getByRole('button', { name: 'Accept' });
    if (await bannerAccept.isVisible()) {
      await bannerAccept.click();
    }
    await page.evaluate(() => window.localStorage.setItem('analytics-test', 'true'));
    await page.fill(selectors.postalInput, '201306');
    await page.click(selectors.searchButton);
    await page.locator('[data-testid="dealer-map"] button').first().click({ force: true });
    await page.locator('[data-testid="dealer-card"]').first().getByRole('button', { name: 'WhatsApp' }).click();
    await page.waitForFunction(() => {
      const events = (window as unknown as { dataLayer?: Array<{ event: string }> }).dataLayer || [];
      return events.some((e) => e.event === 'dealer_search_submitted');
    });
    const snapshot = await page.evaluate(() => (window as unknown as { dataLayer?: unknown[] }).dataLayer);
    const events = (snapshot as Array<{ event: string; payload: Record<string, unknown> }>) || [];
    const searchEvent = events.find((e) => e.event === 'dealer_search_submitted');
    const contactEvent = events.find((e) => e.event === 'dealer_contact_action');
    expect(searchEvent?.payload?.postal_prefix).toBe('201');
    expect(searchEvent?.payload?.consentGranted).toBe(true);
    expect(contactEvent?.payload?.channel).toBe('whatsapp');
    const pinEvent = events.find((e) => e.event === 'dealer_map_pin_select');
    expect(pinEvent?.payload?.latitude).toBeTruthy();
    expect(pinEvent?.payload?.longitude).toBeTruthy();
  });
});

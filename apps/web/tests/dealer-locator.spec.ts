import { test, expect } from '@playwright/test';

const path = '/dealers';

test.describe('published-location finder', () => {
  test('shows only published locations and filters by an available service', async ({ page }) => {
    await page.goto(path);
    await expect(page.getByTestId('dealer-card')).toHaveCount(2);
    await page.getByRole('button', { name: 'Test rides' }).click();
    await expect(page.getByTestId('dealer-card')).toHaveCount(1);
    await expect(page.getByTestId('dealer-card')).toContainText('Sarin Farm');
    await expect(page.getByText(/Within \d+ km/)).toHaveCount(0);
  });

  test('search matches location details without claiming a radius lookup', async ({ page }) => {
    await page.goto(path);
    const input = page.getByLabel('Location, area or PIN code');
    await input.fill('Krystal Height');
    await page.getByRole('button', { name: 'Search locations' }).click();
    await expect(page.getByTestId('dealer-card')).toHaveCount(1);
    await expect(page.getByTestId('dealer-card')).toContainText('Krystal Height');

    await input.fill('110001');
    await page.getByRole('button', { name: 'Search locations' }).click();
    await expect(page.getByText('No location matches that search.')).toBeVisible();
  });

  test('map selection identifies one location even when both share a PIN code', async ({ page }) => {
    await page.goto(path);
    const pins = page.locator('[data-testid="dealer-map"] button');
    await expect(pins).toHaveCount(2);
    await pins.nth(1).click();
    await expect(page.getByTestId('dealer-card').nth(1)).toHaveClass(/is-active/);
    await expect(pins.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(pins.nth(0)).toHaveAttribute('aria-pressed', 'false');
  });

  test('search analytics keeps consent and coarse PIN data', async ({ page }) => {
    await page.goto(path);
    const bannerAccept = page.getByRole('button', { name: 'Accept' });
    if (await bannerAccept.isVisible()) await bannerAccept.click();
    await page.getByLabel('Location, area or PIN code').fill('201306');
    await page.getByRole('button', { name: 'Search locations' }).click();
    await page.waitForFunction(() => {
      const events = (window as unknown as { dataLayer?: Array<{ event: string }> }).dataLayer || [];
      return events.some((event) => event.event === 'dealer_search_submitted');
    });
    const snapshot = await page.evaluate(() => (window as unknown as { dataLayer?: unknown[] }).dataLayer);
    const events = (snapshot as Array<{ event: string; payload: Record<string, unknown> }>) || [];
    const event = events.find((item) => item.event === 'dealer_search_submitted');
    expect(event?.payload?.postal_prefix).toBe('201');
    expect(event?.payload?.consentGranted).toBe(true);
  });
});

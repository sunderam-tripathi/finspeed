import { test, expect } from '@playwright/test';

const EN_HEADLINE = 'Ride Beyond Boundaries';

test.describe('SCN-001 site shell contract', () => {
  test('hero conveys brand promise and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: EN_HEADLINE })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Shop the fleet' })).toBeVisible();
  });

  test('primary CTA opens the redesigned catalog', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Shop the fleet' }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Shop all cycles' })).toBeVisible();
  });

  test('store locator remains available from the support footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('contentinfo').getByText('Find a store')).toBeVisible();
  });

  test('support footer exposes warranty and contact routes', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByText('Warranty')).toBeVisible();
    await expect(footer.getByText('Contact')).toBeVisible();
  });
});

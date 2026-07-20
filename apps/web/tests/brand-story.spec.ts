import { test, expect } from '@playwright/test';

test.describe('brand story', () => {
  test('uses the same truthful editorial story as the primary about route', async ({ page }) => {
    await page.goto('/brand-story');
    await expect(page.getByRole('heading', { name: 'Built for the long way round.' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Explore the bikes/i })).toBeVisible();
    await expect(page.getByText('Based in Greater Noida')).toBeVisible();
  });
});

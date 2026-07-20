import { test, expect } from '@playwright/test';

test('legacy testimonials route presents ride profiles without unsupported customer quotes', async ({ page }) => {
  await page.goto('/testimonials');
  await expect(page.getByRole('heading', { name: 'Start with the roads you know.', level: 1 })).toBeVisible();
  await expect(page.locator('blockquote')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'See mountain bikes' })).toBeVisible();
});

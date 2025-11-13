import { test, expect } from '@playwright/test';

test.describe('SCN-005 brand story', () => {
  test('renders hero copy and CTA links', async ({ page }) => {
    await page.goto('/brand-story');
    await expect(page.getByRole('heading', { name: 'Turning Pedals into Power' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Explore catalog|कैटलॉग देखें/i })).toBeVisible();
  });
});

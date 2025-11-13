import { test, expect } from '@playwright/test';

test('SCN-006 testimonials hero renders bilingual copy', async ({ page }) => {
  await page.goto('/testimonials');
  await expect(page.getByRole('heading', { name: 'Stories from the saddle' })).toBeVisible();
  await page.getByRole('button', { name: 'हिन्दी' }).click();
  await expect(page.getByRole('heading', { name: 'सवारों की कहानियां' })).toBeVisible();
});

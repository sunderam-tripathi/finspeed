import { test, expect } from '@playwright/test';

test('SCN-006 testimonials hero renders source-backed copy in both locale states', async ({ page }) => {
  await page.goto('/testimonials');
  await expect(page.getByRole('heading', { name: 'Testimonials', level: 1 })).toBeVisible();
  await page.getByRole('button', { name: /Hindi/ }).click();
  await expect(page.getByRole('heading', { name: 'Testimonials', level: 1 })).toBeVisible();
});

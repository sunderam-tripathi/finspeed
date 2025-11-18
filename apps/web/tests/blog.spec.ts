import { test, expect } from '@playwright/test';

test('SCN-007 blog landing renders bilingual hero', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.getByRole('heading', { level: 1, name: 'Finspeed Journal' })).toBeVisible();
  await page.getByRole('button', { name: /Hindi/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Finspeed जर्नल' })).toBeVisible();
});

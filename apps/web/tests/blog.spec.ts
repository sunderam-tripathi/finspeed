import { test, expect } from '@playwright/test';

test('SCN-007 blog landing renders the approved article hero in both locale states', async ({ page }) => {
  await page.goto('/blog');
  const title = 'Daily Commute Cycling Safety: Turn Every Ride Into Power';
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  await page.getByRole('button', { name: /Hindi/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
});

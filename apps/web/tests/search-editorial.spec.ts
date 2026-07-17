import { expect, test } from '@playwright/test';

test('mobile header keeps search reachable and wheel-size suggestions return real products', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const search = page.getByRole('button', { name: 'Search' });
  await expect(search).toBeVisible();
  await search.click();
  await expect(page).toHaveURL(/\/search$/);

  await page.getByRole('button', { name: '29 inch' }).click();
  await expect(page.getByText(/result/).first()).toBeVisible();
  await expect(page.locator('.editorial-search-list > button')).not.toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

import { test, expect } from '@playwright/test';

test('journal route renders the shared editorial article without a legacy locale shell', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.getByRole('heading', { level: 1, name: 'Daily commute cycling safety.' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Hindi/ })).toHaveCount(0);
  await expect(page.getByText('Confidence begins before the first pedal stroke.')).toBeVisible();
});

for (const [theme, expectedAsset] of [
  ['light', '/assets/campaign/light-terrain-city.webp'],
  ['dark', '/assets/campaign/terrain-city.webp'],
]) {
  test(`journal hero uses the ${theme} campaign treatment`, async ({ page }) => {
    await page.addInitScript((nextTheme) => {
      window.localStorage.setItem('finspeed-theme', nextTheme);
    }, theme);

    await page.goto('/blog');
    await expect(page.locator('.editorial-page-hero__media img')).toHaveAttribute('src', expectedAsset);
  });
}

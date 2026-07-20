import { test, expect } from '@playwright/test';

test('customer dealer locator does not expose an outage simulator', async ({ page }) => {
  await page.goto('/dealers');
  await expect(page.getByRole('button', { name: 'Simulate outage' })).toHaveCount(0);
  await expect(page.getByTestId('dealer-map')).toBeVisible();
});

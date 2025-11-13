import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Dealer locator passes axe audit', async ({ page }) => {
  await page.goto('/dealers');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

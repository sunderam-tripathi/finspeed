import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Dealer locator passes axe audit', async ({ page }) => {
  await page.goto('/dealers');
  await page.waitForFunction(() => {
    const theme = document.documentElement.dataset.theme;
    const header = document.querySelector('header');
    if (!theme || !header) return false;
    const muted = getComputedStyle(header).getPropertyValue('--fs-text-muted').trim();
    if (theme === 'light') {
      return header.classList.contains('glass-panel-light') && muted.toLowerCase() === '#475569';
    }
    return header.classList.contains('glass-panel') && muted.includes('230, 235, 248');
  });
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

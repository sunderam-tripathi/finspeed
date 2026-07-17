import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Dealer locator passes axe audit', async ({ page }) => {
  await page.goto('/dealers');
  await expect(page.getByRole('banner')).toHaveClass(/editorial-header/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test('Bespoke build studio passes axe audit', async ({ page }) => {
  await page.goto('/build');
  await expect(page.getByRole('heading', { level: 1, name: 'Mako Shark' })).toBeVisible();
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test('Editorial navigation menu passes axe audit', async ({ page }) => {
  await page.goto('/build');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Finspeed menu' })).toBeVisible();
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

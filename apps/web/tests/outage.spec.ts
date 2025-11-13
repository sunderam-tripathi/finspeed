import { test, expect } from '@playwright/test';

const path = '/dealers';

test('outage toggle logs analytics event', async ({ page }) => {
  await page.goto(path);
  const logs: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'info' && msg.text().includes('dealer_locator_outage')) logs.push(msg.text());
  });
  await page.getByRole('button', { name: 'Simulate outage' }).click();
  await expect(page.getByText('Map unavailable during outage.')).toBeVisible();
  expect(logs.some((text) => text.includes('dealer_locator_outage'))).toBeTruthy();
});

import { test, expect } from '@playwright/test';

test('SCN-008 support hub renders bilingual hero and contacts', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('finspeed-support-locale', 'en');
  });
  await page.goto('/support');
  await expect(page.getByRole('heading', { level: 1, name: 'Support hub' })).toBeVisible();
  await expect(page.getByRole('link', { name: /WhatsApp \+/ })).toBeVisible();
  await page.getByRole('button', { name: /Hindi/ }).click();
  await expect(page.getByRole('heading', { name: 'सपोर्ट हब' })).toBeVisible();
});

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

test('support request does not accept missing required details', async ({ page }) => {
  await page.goto('/support');
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.locator('.legacy-form-feedback[role="alert"]')).toHaveText(/Enter your name and a short description/i);
});

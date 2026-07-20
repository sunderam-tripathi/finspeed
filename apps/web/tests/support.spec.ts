import { test, expect } from '@playwright/test';

test('support hub uses the shared editorial support flow and published contacts', async ({ page }) => {
  await page.goto('/support');
  await expect(page.getByRole('heading', { level: 1, name: 'Support for the whole ride.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'WhatsApp', exact: true })).toHaveAttribute(
    'href',
    'https://wa.me/919650608982',
  );
  await expect(page.getByText(/within 6 hours/i)).toHaveCount(0);
});

test('support request identifies each invalid field', async ({ page }) => {
  await page.goto('/support');
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.locator('.editorial-form-feedback[role="alert"]')).toHaveText(/Check the highlighted fields/i);
  await expect(page.getByText('Enter your name.')).toBeVisible();
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
});

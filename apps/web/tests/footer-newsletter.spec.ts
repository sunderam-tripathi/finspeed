import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('finspeed-consent', 'denied'));
});

test('premium footer exposes real destinations and contact actions', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');

  await expect(footer.getByRole('link', { name: 'Finspeed home' })).toHaveAttribute('href', '/');
  await expect(footer.getByRole('link', { name: 'Mountain' })).toHaveAttribute('href', '/shop?category=mountain');
  await expect(footer.getByRole('link', { name: 'Find a store' })).toHaveAttribute('href', '/stores');
  await expect(footer.getByRole('link', { name: 'Dealer locator' })).toHaveAttribute('href', '/dealers');
  await expect(footer.getByRole('link', { name: 'Rider support' })).toHaveAttribute('href', '/support');
  await expect(footer.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/919650608982');
  await expect(footer.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:support@finspeed.online');
  await expect(footer.getByRole('link', { name: 'Privacy enquiries' })).toHaveAttribute(
    'href',
    /^mailto:support@finspeed\.online\?/,
  );
  await expect(footer.getByRole('heading', { name: 'Confirm the details that matter.' })).toBeVisible();

  const hrefs = await footer.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs.every((href) => Boolean(href) && href !== '#')).toBe(true);

  await footer.getByRole('link', { name: 'Mountain' }).click();
  await expect(page).toHaveURL(/\/shop\?category=mountain$/);
});

test('newsletter presents either a real endpoint form or an honest email fallback', async ({ page }) => {
  await page.goto('/');
  const newsletter = page.locator('.store-newsletter');
  await expect(newsletter).toBeVisible();

  const form = newsletter.locator('form');
  if (await form.count()) {
    await expect(form.getByLabel('Email address')).toHaveAttribute('type', 'email');
    await expect(form.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    await expect(newsletter.getByText('Your subscription was confirmed.')).toHaveCount(0);
  } else {
    await expect(newsletter).toContainText('Nothing is submitted from this page.');
    await expect(newsletter.getByRole('link', { name: 'Request updates by email' })).toHaveAttribute(
      'href',
      /^mailto:support@finspeed\.online\?/,
    );
    await expect(newsletter.getByText('Your subscription was confirmed.')).toHaveCount(0);
  }
});

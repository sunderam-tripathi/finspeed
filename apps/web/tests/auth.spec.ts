import { expect, test, type Page } from '@playwright/test';

async function prepare(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('finspeed-consent', 'denied');
    window.localStorage.removeItem('finspeed.user');
  });
}

test.describe('storefront account access', () => {
  test('uses governed owner-care claims and connects every secondary action', async ({ page }) => {
    await prepare(page);
    await page.goto('/sign-in');

    await expect(page.getByRole('heading', { level: 2, name: 'Your ride, remembered.' })).toBeVisible();
    await expect(page.getByText('2-year', { exact: true })).toBeVisible();
    await expect(page.getByText('Frame warranty', { exact: true })).toBeVisible();
    await expect(page.getByText('Two complimentary', { exact: true })).toBeVisible();
    await expect(page.getByText('Services in the first six months', { exact: true })).toBeVisible();
    await expect(page.getByText(/1-yr warranty/i)).toHaveCount(0);

    const tabs = page.getByRole('tablist', { name: 'Owner account preview' });
    const sample = tabs.getByRole('tab', { name: /Sample rider/ });
    const create = tabs.getByRole('tab', { name: /New profile preview/ });
    await expect(sample).toHaveAttribute('aria-selected', 'true');
    await sample.focus();
    await page.keyboard.press('ArrowRight');
    await expect(create).toBeFocused();
    await expect(create).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('button', { name: 'Open personalised preview' })).toBeVisible();
    await expect(page.getByText(/does not create or register a Finspeed account/i)).toBeVisible();

    await page.goto('/sign-in');
    await expect(page.getByLabel('Password')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Forgot password?' })).toHaveCount(0);
    await expect(page.getByText(/No authentication is performed, no password is requested/i)).toBeVisible();

    await page.goto('/sign-in');
    await expect(page.getByRole('link', { name: /Distributor sign in/ })).toHaveAttribute('href', '/distributor/sign-in');
    await page.getByRole('button', { name: 'Continue as guest' }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test('opens the sample profile without presenting the action as authentication', async ({ page }) => {
    await prepare(page);
    await page.goto('/sign-in');

    await expect(page.getByText(/No authentication is performed.*no live account is created/i)).toBeVisible();
    await page.getByRole('button', { name: 'Open sample profile' }).click();

    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByRole('note', { name: 'Sample owner account' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => {
      return JSON.parse(window.localStorage.getItem('finspeed.user') || 'null');
    })).toMatchObject({
      name: 'Arjun Mehta',
      email: 'arjun.mehta@email.com',
      phone: '+91 98765 43210',
    });
  });

  test('personalises a local preview without requesting a password', async ({ page }) => {
    await prepare(page);
    await page.goto('/sign-in');

    await page.getByRole('tab', { name: /New profile preview/ }).click();
    await page.getByLabel('Full name').fill('Mira Shah');
    await page.getByLabel('Email').fill('mira@example.com');
    await page.getByLabel('Phone').fill('+91 99999 11111');
    await expect(page.getByLabel('Password')).toHaveCount(0);
    await page.getByRole('button', { name: 'Open personalised preview' }).click();

    await expect(page).toHaveURL(/\/account$/);
    await expect.poll(() => page.evaluate(() => {
      return JSON.parse(window.localStorage.getItem('finspeed.user') || 'null');
    })).toMatchObject({
      name: 'Mira Shah',
      email: 'mira@example.com',
      phone: '+91 99999 11111',
    });
  });
});

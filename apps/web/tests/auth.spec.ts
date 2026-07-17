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

    const tabs = page.getByRole('tablist', { name: 'Account access' });
    const signIn = tabs.getByRole('tab', { name: /Sign in/ });
    const create = tabs.getByRole('tab', { name: /Create account/ });
    await expect(signIn).toHaveAttribute('aria-selected', 'true');
    await signIn.focus();
    await page.keyboard.press('ArrowRight');
    await expect(create).toBeFocused();
    await expect(create).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('button', { name: 'Create sample account' })).toBeVisible();
    await expect(page.getByText(/does not register a live account|sample rider account stored only in this browser|local sample rider profile.*No live account is created/i)).toBeVisible();

    await page.goto('/sign-in');
    const recovery = page.getByRole('button', { name: 'Forgot password?' });
    await recovery.click();
    await expect(recovery).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText(/Online password reset is not connected in this preview/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'support@finspeed.online' })).toHaveAttribute(
      'href',
      'mailto:support@finspeed.online?subject=Finspeed%20account%20access',
    );
    await expect(page.getByRole('link', { name: 'WhatsApp +91 96506 08982' })).toHaveAttribute(
      'href',
      'https://wa.me/919650608982',
    );
    await page.getByRole('button', { name: 'Open rider support' }).click();
    await expect(page).toHaveURL(/\/support$/);

    await page.goto('/sign-in');
    await expect(page.getByRole('link', { name: /Distributor sign in/ })).toHaveAttribute('href', '/distributor/sign-in');
    await page.getByRole('button', { name: 'Continue as guest' }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test('retains the mock sign-in contract without pretending to authenticate remotely', async ({ page }) => {
    await prepare(page);
    await page.goto('/sign-in');

    await expect(page.getByText(/local sample rider profile.*No live account is created.*no credentials are sent/i)).toBeVisible();
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(page).toHaveURL(/\/account$/);
    await expect.poll(() => page.evaluate(() => {
      return JSON.parse(window.localStorage.getItem('finspeed.user') || 'null');
    })).toMatchObject({
      name: 'Arjun Mehta',
      email: 'arjun.mehta@email.com',
      phone: '+91 98765 43210',
    });
  });

  test('creates a local preview profile from the entered registration details', async ({ page }) => {
    await prepare(page);
    await page.goto('/sign-in');

    await page.getByRole('tab', { name: /Create account/ }).click();
    await page.getByLabel('Full name').fill('Mira Shah');
    await page.getByLabel('Email').fill('mira@example.com');
    await page.getByLabel('Phone').fill('+91 99999 11111');
    await page.getByLabel('Password').fill('preview-only');
    await page.getByRole('button', { name: 'Create sample account' }).click();

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

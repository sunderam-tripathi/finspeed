import { test, expect } from '@playwright/test';

const EN_HEADLINE = 'Turning Pedals into Power';
const HI_HEADLINE = 'पैडल को शक्ति में बदलें';
const HI_CTA = 'अपने निकटतम Finspeed डीलर को खोजें';

const selectors = {
  heroHeading: 'data-testid=hero-heading',
  dealerCta: 'data-testid=dealer-cta',
  supportFooter: 'data-testid=support-footer'
};

test.describe('SCN-001 site shell contract', () => {
  test('hero conveys brand promise and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator(selectors.heroHeading)).toHaveText(EN_HEADLINE);
    await expect(page.locator(selectors.dealerCta)).toHaveAttribute('href', '/dealers');
  });

  test('language toggle switches to Hindi copy (IC-6)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'हिन्दी' }).click();
    await expect(page.locator(selectors.heroHeading)).toHaveText(HI_HEADLINE);
    await expect(page.locator(selectors.dealerCta)).toHaveText(HI_CTA);
  });

  test('dealer CTA available from navigation (IC-8)', async ({ page }) => {
    await page.goto('/');
    const navDealer = page.getByRole('link', { name: 'Find a Dealer' }).first();
    await expect(navDealer).toBeVisible();
    await expect(navDealer).toHaveAttribute('href', '/dealers');
  });

  test('support footer exposes contact channels', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator(selectors.supportFooter);
    await expect(footer.getByText('WhatsApp')).toBeVisible();
    await expect(footer.getByText('Email')).toBeVisible();
  });
});

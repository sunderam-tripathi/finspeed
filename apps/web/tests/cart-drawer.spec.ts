import { expect, test } from '@playwright/test';

const configuredLineId = 'configured:mako-shark:mako-power-front-21-graphite';
const configuredCart = {
  [configuredLineId]: {
    productId: 'mako-shark',
    quantity: 2,
    unitPrice: 10450,
    configuration: {
      base: { id: 'mako', title: 'Mako Shark', wheels: '27.5″ wheels' },
      brakes: { id: 'power', title: 'Power Brakes' },
      suspension: { id: 'front', title: 'Front Suspension' },
      gears: { id: '21', title: '21-Speed' },
      finish: { id: 'graphite', title: 'Deep Graphite' },
      preview: {
        light: { src: '/assets/products/upscaled/mako-shark-1600.webp' },
        dark: { src: '/assets/products/dark-studio-v2/mako-shark-studio.webp' },
      },
    },
  },
};

test.describe('premium cart drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((cart) => {
      window.localStorage.setItem('finspeed-consent', 'denied');
      window.localStorage.setItem('finspeed-theme', 'light');
      window.localStorage.setItem('finspeed.cart', JSON.stringify(cart));
    }, configuredCart);
  });

  test('keeps configuration and quantity through the drawer and checkout handoff', async ({ page }) => {
    await page.goto('/shop');
    const cartTrigger = page.getByRole('button', { name: 'Cart' });
    await cartTrigger.click();

    const drawer = page.getByRole('dialog', { name: /Cart/ });
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Mako Shark');
    await expect(drawer.locator('.store-cart-item-image img')).toHaveAttribute(
      'src',
      '/assets/products/upscaled/mako-shark-1600.webp',
    );
    await expect(drawer).toContainText('27.5″ wheels · Power Brakes · Front Suspension · 21-Speed · Deep Graphite');
    const configuredLine = drawer.getByRole('article');
    await expect(configuredLine.getByText('₹20,900', { exact: true })).toBeVisible();

    await drawer.getByRole('button', { name: 'Increase Mako Shark quantity' }).click();
    await expect(configuredLine.getByText('₹31,350', { exact: true })).toBeVisible();
    await expect(drawer.locator('.commerce-live-region')).toHaveText('Mako Shark quantity changed to 3.');
    await expect.poll(() => page.evaluate((lineId) => {
      const cart = JSON.parse(window.localStorage.getItem('finspeed.cart') || '{}');
      return cart[lineId];
    }, configuredLineId)).toMatchObject({
      quantity: 3,
      unitPrice: 10450,
      configuration: {
        brakes: { id: 'power', title: 'Power Brakes' },
        finish: { id: 'graphite', title: 'Deep Graphite' },
      },
    });

    await expect(drawer).toContainText('Preview only — checkout will not reserve a bicycle or collect payment.');
    await drawer.getByRole('button', { name: 'Preview checkout' }).click();
    await expect(page).toHaveURL(/\/checkout$/);
    const summary = page.locator('.store-checkout-summary');
    await expect(summary.locator('.store-checkout-item__configuration')).toHaveText(
      '27.5″ wheels · Power Brakes · Front Suspension · 21-Speed · Deep Graphite',
    );
    await expect(summary.locator('.store-checkout-item').getByText('₹31,350', { exact: true })).toBeVisible();
  });

  test('traps focus, closes on Escape, and returns focus to the cart trigger', async ({ page }) => {
    await page.goto('/shop');
    const cartTrigger = page.getByRole('button', { name: 'Cart' });
    await cartTrigger.click();

    const drawer = page.getByRole('dialog', { name: /Cart/ });
    await expect(drawer.getByRole('button', { name: 'Close cart' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(cartTrigger).toBeFocused();
  });
});

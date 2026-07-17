import { expect, test, type Page } from '@playwright/test';

const configuredCart = {
  'configured:mako-shark:mako-power-front-21-graphite': {
    productId: 'mako-shark',
    quantity: 2,
    unitPrice: 10450,
    configuration: {
      base: { id: 'mako', title: 'Mako Shark', wheels: '27.5″ wheels' },
      brakes: { id: 'power', title: 'Power Brakes' },
      suspension: { id: 'front', title: 'Front Suspension' },
      gears: { id: '21', title: '21-Speed' },
      finish: { id: 'graphite', title: 'Deep Graphite' },
    },
  },
};

async function seedCart(page: Page, cart: object) {
  await page.addInitScript((value) => {
    window.localStorage.setItem('finspeed-consent', 'denied');
    window.localStorage.setItem('finspeed.cart', JSON.stringify(value));
  }, cart);
}

test.describe('configured checkout', () => {
  test('uses configured pricing, exposes the configuration, and preserves it in the order', async ({ page }) => {
    await seedCart(page, configuredCart);
    await page.goto('/checkout');

    const summary = page.locator('.store-checkout-summary');
    const line = summary.locator('.store-checkout-item');
    await expect(line).toContainText('Mako Shark');
    await expect(line.locator('.store-checkout-item__configuration')).toHaveText(
      '27.5″ wheels · Power Brakes · Front Suspension · 21-Speed · Deep Graphite',
    );
    await expect(line.getByText('₹20,900', { exact: true })).toBeVisible();
    await expect(summary.getByText('Free delivery across India · 2-year frame warranty')).toBeVisible();

    const paymentGroup = page.getByRole('radiogroup', { name: 'Payment method' });
    const cash = paymentGroup.getByRole('radio', { name: /Cash on delivery/ });
    const upi = paymentGroup.getByRole('radio', { name: /UPI on delivery/ });
    await expect(cash).toHaveAttribute('aria-checked', 'true');
    await expect(cash).toHaveAttribute('tabindex', '0');
    await expect(upi).toHaveAttribute('aria-checked', 'false');
    await expect(upi).toHaveAttribute('tabindex', '-1');
    await cash.focus();
    await page.keyboard.press('ArrowRight');
    await expect(upi).toBeFocused();
    await expect(upi).toHaveAttribute('aria-checked', 'true');

    await page.getByLabel('Full name').fill('Arjun Mehta');
    await page.getByLabel('Phone').fill('+91 98765 43210');
    await page.getByLabel('Email').fill('arjun@example.com');
    await page.getByLabel('Address', { exact: true }).fill('Flat 402, Lotus Residency');
    await page.getByLabel('City').fill('Noida');
    await page.getByLabel('State').fill('Uttar Pradesh');
    await page.getByLabel('PIN code').fill('201301');
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Order confirmed' })).toBeVisible();

    await expect.poll(() => page.evaluate(() => {
      const orders = JSON.parse(window.localStorage.getItem('finspeed.orders') || '[]');
      return orders[0];
    })).toMatchObject({
      items: [{
        lineId: 'configured:mako-shark:mako-power-front-21-graphite',
        id: 'mako-shark',
        qty: 2,
        unitPrice: 10450,
        configuration: {
          brakes: { id: 'power', title: 'Power Brakes' },
          finish: { id: 'graphite', title: 'Deep Graphite' },
        },
      }],
      paymentMethod: 'upi',
      customer: {
        name: 'Arjun Mehta',
        phone: '+91 98765 43210',
        email: 'arjun@example.com',
      },
      shippingAddress: {
        line: 'Flat 402, Lotus Residency',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pin: '201301',
      },
      total: 20900,
    });
  });

  test('continues to render legacy product-id carts at catalogue pricing', async ({ page }) => {
    await seedCart(page, { 'bull-shark': 2 });
    await page.goto('/checkout');

    const line = page.locator('.store-checkout-item');
    await expect(line).toContainText('Bull Shark');
    await expect(line.locator('.store-checkout-item__configuration')).toHaveText('29" · 21-Speed');
    await expect(line.getByText('₹19,000', { exact: true })).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: 'Payment method' })).toBeVisible();
  });
});

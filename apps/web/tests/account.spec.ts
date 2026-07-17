import { expect, test, type Page } from '@playwright/test';

const configuredOrder = {
  no: 'FS900001',
  date: '17 Jul 2026',
  step: 2,
  eta: 'Arriving 22 Jul',
  items: [{
    lineId: 'configured:mako-shark:one',
    id: 'mako-shark',
    qty: 2,
    unitPrice: 12450,
    configuration: {
      base: { id: 'mako', title: 'Mako frame', wheels: '27.5"' },
      brakes: { id: 'hydraulic', title: 'Hydraulic disc' },
      suspension: { id: 'front', title: 'Front suspension' },
      gears: { id: '21', title: '21 speed' },
      finish: { id: 'mint', title: 'Mint silver' },
    },
  }],
  paymentMethod: 'cod',
  total: 24900,
};

async function prepare(page: Page) {
  await page.addInitScript((order) => {
    window.localStorage.setItem('finspeed-consent', 'denied');
    window.localStorage.setItem('finspeed.user', JSON.stringify({
      name: 'Arjun Mehta',
      email: 'arjun.mehta@email.com',
      phone: '+91 98765 43210',
      since: 'Apr 2024',
    }));
    window.localStorage.setItem('finspeed.orders', JSON.stringify([order]));
  }, configuredOrder);
}

test.describe('storefront owner account', () => {
  test('renders checkout configuration and governed owner-care details without flattening the order', async ({ page }) => {
    await prepare(page);
    await page.goto('/account');

    const orderRow = page.getByRole('button', { name: /Order FS900001/i });
    await expect(orderRow).toContainText('Mako Shark ×2');
    await expect(orderRow).toContainText('Includes a configured build');
    await expect(orderRow).toContainText('₹24,900');
    await orderRow.click();

    await expect(page.getByRole('heading', { name: 'Order FS900001' })).toBeVisible();
    await expect(page.getByText('Mako frame · 27.5"')).toBeVisible();
    await expect(page.getByText('Hydraulic disc')).toBeVisible();
    await expect(page.getByText('Front suspension')).toBeVisible();
    await expect(page.getByText('21 speed')).toBeVisible();
    await expect(page.getByText('Mint silver')).toBeVisible();
    await expect(page.getByText('2-year frame warranty')).toBeVisible();
    await expect(page.getByText('Two complimentary services in the first six months')).toBeVisible();
    await expect(page.getByRole('link', { name: 'support@finspeed.online' })).toHaveAttribute(
      'href',
      'mailto:support@finspeed.online',
    );
    await expect(page.getByRole('link', { name: 'WhatsApp +91 96506 08982' })).toHaveAttribute(
      'href',
      'https://wa.me/919650608982',
    );

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download summary' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('finspeed-fs900001-summary.txt');
  });

  test('supports roving keyboard navigation across account sections', async ({ page }) => {
    await prepare(page);
    await page.goto('/account');

    const tabs = page.getByRole('tablist', { name: 'Account sections' });
    const orders = tabs.getByRole('tab', { name: /Orders/ });
    const delivery = tabs.getByRole('tab', { name: /Delivery details/ });
    const profile = tabs.getByRole('tab', { name: /Profile/ });

    await orders.focus();
    await page.keyboard.press('ArrowRight');
    await expect(delivery).toBeFocused();
    await expect(delivery).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: /Delivery details.*Addresses on file/i })).toBeVisible();

    await page.keyboard.press('End');
    await expect(profile).toBeFocused();
    await expect(profile).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: /Profile.*Personal details/i })).toBeVisible();

    await page.getByRole('button', { name: /Request a profile update/ }).click();
    await expect(page).toHaveURL(/\/support$/);
  });

  test('scopes orders and delivery details to the active local rider identity', async ({ page }) => {
    await page.addInitScript((order) => {
      window.localStorage.setItem('finspeed-consent', 'denied');
      window.localStorage.setItem('finspeed.user', JSON.stringify({
        name: 'Mira Shah',
        email: 'mira@example.com',
        phone: '+91 99999 11111',
        since: 'Jul 2026',
      }));
      window.localStorage.setItem('finspeed.orders', JSON.stringify([
        { ...order, no: 'FS-FOREIGN', ownerEmail: 'another@example.com' },
        {
          ...order,
          no: 'FS-MIRA',
          ownerEmail: 'mira@example.com',
          customer: { name: 'Mira Shah', email: 'mira@example.com', phone: '+91 99999 11111' },
          shippingAddress: {
            name: 'Mira Shah',
            line: '42 Cypress Avenue',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pin: '201301',
            phone: '+91 99999 11111',
          },
        },
      ]));
    }, configuredOrder);

    await page.goto('/account');
    await expect(page.getByRole('button', { name: /Order FS-MIRA/i })).toBeVisible();
    await expect(page.getByText('FS-FOREIGN')).toHaveCount(0);

    await page.getByRole('tab', { name: /Delivery details/ }).click();
    await expect(page.getByText('42 Cypress Avenue')).toBeVisible();
    await expect(page.getByText(/Noida, Uttar Pradesh 201301/)).toBeVisible();
  });
});

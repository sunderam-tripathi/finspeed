import { expect, test, type Page } from '@playwright/test';

const progressLabels = ['Ride', 'Bicycle', 'Fit', 'Setup', 'Finish', 'Extras', 'Review'];

async function expectStage(page: Page, index: number, heading: string) {
  const progress = page.getByRole('navigation', { name: 'Build progress' });
  const activeStep = progress.locator('[aria-current="step"]');

  await expect(page.getByText(`Step ${index + 1} of ${progressLabels.length}`, { exact: true })).toHaveText(
    `Step ${index + 1} of ${progressLabels.length}`,
  );
  await expect(activeStep).toHaveText(progressLabels[index]);
  await expect(page.locator('.configurator-panel__header').getByRole('heading', { level: 2 })).toHaveText(heading);
}

async function chooseRadio(page: Page, name: string | RegExp) {
  const radio = page.getByRole('radio', { name });
  await page.locator('label.configurator-option').filter({ has: radio }).click();
  await expect(radio).toBeChecked();
}

test.describe('WEB-035 comprehensive bespoke configurator', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('finspeed-consent', 'denied');
      window.localStorage.setItem('finspeed-theme', 'light');
    });
  });

  test('clears the bicycle loading treatment after a cached preview loads', async ({ page }) => {
    await page.goto('/build');
    const preview = page.locator('.configurator-stage__bike');

    await expect(preview).toBeVisible({ timeout: 20_000 });
    await expect(preview).not.toHaveClass(/is-loading/);
    await expect(page.getByText('Preparing selected bicycle')).toHaveCount(0);

    await page.goto('/shop');
    await page.goto('/build');

    await expect(preview).toBeVisible({ timeout: 20_000 });
    await expect(preview).not.toHaveClass(/is-loading/);
    await expect(page.getByText('Preparing selected bicycle')).toHaveCount(0);
  });

  test('builds and persists the selected Red Snapper 24-inch IBC catalog variant', async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    await page.goto('/build');

    const progress = page.getByRole('navigation', { name: 'Build progress' });
    await expect(page.getByRole('heading', { level: 1, name: 'Mako Shark' })).toBeVisible({ timeout: 20_000 });
    await expect(progress.getByRole('button')).toHaveCount(progressLabels.length);
    await expect(progress.getByRole('button')).toHaveText(progressLabels);
    await expectStage(page, 0, 'Ride type');

    await chooseRadio(page, /^City /);
    await expect(page.getByRole('heading', { level: 1, name: 'Red Snapper' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expectStage(page, 1, 'Choose bicycle');

    await chooseRadio(page, /^Red Snapper /);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expectStage(page, 2, 'Fit & wheels');

    await chooseRadio(page, /^24-inch /);
    await expect(page.locator('.configurator-price strong')).toHaveText('\u20B94,800');

    const preview = page.locator('.configurator-stage__bike');

    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expectStage(page, 3, 'Ride setup');
    await expect(page.locator('.configurator-panel').getByRole('radio')).toHaveCount(6);
    await expect(page.locator('.configurator-panel').getByRole('radio', { checked: true })).toHaveCount(3);
    for (const optionLabel of ['Power brake', 'Disc brakes', 'Rigid fork', 'Front suspension', 'Single speed', '21-speed']) {
      await expect(page.locator('.configurator-panel')).toContainText(optionLabel);
    }

    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expectStage(page, 4, 'Finish');
    await expect(page.locator('.configurator-panel').getByRole('radio')).toHaveCount(5);
    await expect(page.getByRole('radio', { name: /^Catalog finish / })).toBeChecked();

    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expectStage(page, 5, 'Add-ons');
    await expect(page.locator('.configurator-panel').getByRole('radio')).toHaveCount(2);
    await chooseRadio(page, /^IBC frame-mounted carrier /);
    await expect(page.locator('.configurator-price strong')).toHaveText('\u20B95,000');
    await expect(preview).toHaveAttribute(
      'src',
      '/assets/configurator/v1/red-snapper/side-r/light/poster/red-snapper-24-ibc-r01-w1600.webp',
    );
    await expect(preview).toHaveAttribute(
      'srcset',
      '/assets/configurator/v1/red-snapper/side-r/light/poster/red-snapper-24-ibc-r01-w480.webp 480w, '
        + '/assets/configurator/v1/red-snapper/side-r/light/poster/red-snapper-24-ibc-r01-w960.webp 960w, '
        + '/assets/configurator/v1/red-snapper/side-r/light/poster/red-snapper-24-ibc-r01-w1600.webp 1600w',
    );

    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expectStage(page, 6, 'Review');

    const review = page.locator('.configurator-review');
    await expect(review).toContainText('Red Snapper');
    await expect(review).toContainText('24-inch, IBC carrier');
    await expect(review).toContainText('IBC frame-mounted carrier');
    await expect(review.locator('.configurator-review__total strong')).toHaveText('\u20B95,000');

    await expect.poll(() => page.evaluate(() => JSON.parse(window.localStorage.getItem('finspeed.build') || 'null')))
      .toMatchObject({
        version: 3,
        rideType: 'city',
        modelId: 'red-snapper',
        skuId: 'red-snapper-24-ibc',
        fit: { wheel: '24-inch' },
        accessories: ['ibc-carrier'],
      });

    await page.getByRole('button', { name: 'Add selected build' }).click();
    const drawer = page.getByRole('dialog', { name: /Cart/ });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('article')).toContainText('Red Snapper');
    await expect(drawer.getByRole('article')).toContainText('24-inch, IBC carrier');
    await expect(drawer.locator('.store-cart-item-image img')).toHaveAttribute(
      'src',
      '/assets/configurator/v1/red-snapper/side-r/light/poster/red-snapper-24-ibc-r01-w1600.webp',
    );
    await expect(drawer.getByText('\u20B95,000', { exact: true })).toHaveCount(2);

    await expect.poll(() => page.evaluate(() => {
      const cart = JSON.parse(window.localStorage.getItem('finspeed.cart') || '{}');
      const [lineId, line] = Object.entries(cart)[0] || [];
      return { lineId, line };
    })).toMatchObject({
      lineId: expect.stringMatching(/^configured:red-snapper:fsc3-/),
      line: {
        productId: 'red-snapper',
        quantity: 1,
        unitPrice: 5000,
        configuration: {
          version: 3,
          sku: { id: 'red-snapper-24-ibc' },
          accessories: [{ id: 'ibc-carrier', title: 'IBC frame-mounted carrier' }],
          commerce: { ready: true, status: 'ready' },
          preview: {
            skuId: 'red-snapper-24-ibc',
            light: {
              src: '/assets/configurator/v1/red-snapper/side-r/light/poster/red-snapper-24-ibc-r01-w1600.webp',
            },
            dark: {
              src: '/assets/configurator/v1/red-snapper/side-r/dark/poster/red-snapper-24-ibc-r01-w1600.webp',
            },
          },
        },
      },
    });

    await drawer.getByRole('button', { name: 'Close cart' }).click();
    await page.reload();

    await expect(page.getByRole('heading', { level: 1, name: 'Red Snapper' })).toBeVisible();
    await expect(page.locator('.configurator-price strong')).toHaveText('\u20B95,000');
    await expect(page.locator('.configurator-stage__meta')).toContainText('24-inch, IBC carrier');
    await expect(preview).toHaveAttribute(
      'src',
      '/assets/configurator/v1/red-snapper/side-r/light/poster/red-snapper-24-ibc-r01-w1600.webp',
    );
    expect(runtimeErrors).toEqual([]);
  });

  test('preserves custom component, finish, and carrier requests without treating them as stock commerce', async ({ page }) => {
    await page.goto('/build');
    await expect(page.getByRole('heading', { level: 1, name: 'Mako Shark' })).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: 'Setup' }).click();
    await expectStage(page, 3, 'Ride setup');
    await chooseRadio(page, /^Power brake /);
    await chooseRadio(page, /^Rigid fork /);
    await chooseRadio(page, /^Single speed /);

    await page.getByRole('button', { name: 'Finish' }).click();
    await expectStage(page, 4, 'Finish');
    await chooseRadio(page, /^Deep blue /);

    await page.getByRole('button', { name: 'Extras' }).click();
    await expectStage(page, 5, 'Add-ons');
    await chooseRadio(page, /^IBC frame-mounted carrier /);

    await page.getByRole('button', { name: 'Review' }).click();
    await expectStage(page, 6, 'Review');
    const review = page.locator('.configurator-review');
    await expect(review).toContainText('Power brake');
    await expect(review).toContainText('Rigid fork');
    await expect(review).toContainText('Single speed');
    await expect(review).toContainText('Deep blue');
    await expect(review).toContainText('IBC frame-mounted carrier');
    await expect(review).toContainText('Base bicycle; final quote confirmed by Finspeed');
    await expect(page.getByRole('button', { name: 'Request this build' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add .*build/ })).toHaveCount(0);
    await expect(page.locator('.configurator-notice')).toContainText('custom build request');

    await expect.poll(() => page.evaluate(() => JSON.parse(window.localStorage.getItem('finspeed.build') || 'null')))
      .toMatchObject({
        version: 3,
        modelId: 'mako-shark',
        components: {
          brakes: 'power-brake',
          fork: 'rigid-fork',
          drivetrain: 'single-speed',
        },
        finish: 'deep-blue-request',
        accessories: ['ibc-carrier'],
      });

    await expect.poll(() => page.evaluate(() => JSON.parse(window.localStorage.getItem('finspeed.cart') || '{}')))
      .toEqual({});
  });

  test('requires product identity confirmation instead of adding Bull Shark to cart', async ({ page }) => {
    await page.goto('/build');
    await expect(page.getByRole('heading', { level: 1, name: 'Mako Shark' })).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: 'Bicycle' }).click();
    await chooseRadio(page, /^Bull Shark /);
    await page.getByRole('button', { name: 'Review' }).click();

    await expect(page.getByRole('alert').getByText('Confirm before ordering', { exact: true })).toBeVisible();
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: 'Confirm before ordering' })
        .getByText('Current verified photography and the catalog presentation require a final product-identity check.'),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirm with Finspeed' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add .*build/ })).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => JSON.parse(window.localStorage.getItem('finspeed.cart') || '{}')))
      .toEqual({});
  });
});

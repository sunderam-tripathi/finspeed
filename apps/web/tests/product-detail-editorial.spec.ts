import { expect, test } from '@playwright/test';

test.describe('premium editorial product detail', () => {
  test('uses the official product master and only catalogue-backed specifications', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/products/mako-shark');

    await expect(page.getByRole('heading', { level: 1, name: 'Mako Shark' })).toBeVisible();
    const productImage = page.locator('.product-editorial-stage__image img');
    await expect(productImage).toHaveAttribute('src', '/assets/products/upscaled/mako-shark-1600.webp');
    await expect(productImage).toHaveAttribute(
      'srcset',
      '/assets/products/upscaled/mako-shark-480.webp 480w, /assets/products/upscaled/mako-shark-960.webp 960w, /assets/products/upscaled/mako-shark-1600.webp 1600w',
    );
    await expect(productImage).toHaveJSProperty('complete', true);
    expect(await productImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(640);

    const specification = page.locator('.product-editorial-specification__table');
    await expect(specification).toContainText('Geared Elite');
    await expect(specification).toContainText('Mountain');
    await expect(specification).toContainText('27.5"');
    await expect(specification).toContainText('21-Speed');
    await expect(specification).toContainText('Disc');
    await expect(page.getByText('Powder-coat')).toHaveCount(0);
    await expect(page.getByText('Easy Fire 3×7')).toHaveCount(0);
  });

  test('add to cart and buy now complete real storefront actions', async ({ page }) => {
    await page.goto('/products/mako-shark');

    await page.getByRole('button', { name: 'Increase' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.getByText('Mako Shark added to cart')).toBeVisible();

    await page.getByRole('button', { name: 'Buy now' }).click();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByText('Mako Shark', { exact: true }).first()).toBeVisible();
  });

  test('sold-out availability uses an endpoint when configured or an honest email fallback', async ({ page }) => {
    await page.goto('/products/great-white-shark');

    await expect(page.getByText('Currently unavailable')).toBeVisible();
    await page.getByLabel('Email address').fill('rider@example.com');

    const emailFallback = page.getByRole('link', { name: 'Notify me' });
    const endpointSubmit = page.getByRole('button', { name: 'Notify me' });
    if (await emailFallback.count()) {
      await expect(emailFallback).toHaveAttribute('href', /^mailto:support@finspeed\.online/);
      await expect(emailFallback).toHaveAttribute('href', /great-white-shark/);
      await expect(page.getByText(/No request is sent until you send that email/)).toBeVisible();
    } else {
      await expect(endpointSubmit).toBeVisible();
      await expect(page.getByText(/used only for this availability update/)).toBeVisible();
    }
  });

  test('keeps the primary purchase path inside a 390px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/products/mako-shark');

    const actions = page.locator('.product-editorial-actions .editorial-cta');
    await expect(actions).toHaveCount(2);
    const actionLayout = await page.locator('.product-editorial-actions').evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        innerWidth: window.innerWidth,
        display: style.display,
        flexDirection: style.flexDirection,
        gridTemplateColumns: style.gridTemplateColumns,
        width: rect.width,
      };
    });
    expect(actionLayout).toMatchObject({ innerWidth: 390, display: 'flex', flexDirection: 'column' });
    const boxes = await actions.evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width };
    }));
    for (const box of boxes) {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(390);
      expect(box.width).toBeGreaterThan(200);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

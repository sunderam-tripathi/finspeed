import { test, expect } from '@playwright/test';

const titleOf = (html: string) => /<title>([^<]*)<\/title>/.exec(html)?.[1];

test.describe('server-delivered route metadata', () => {
  test('serves a route-specific title and description per route without JavaScript', async ({ request }) => {
    const cases: Array<[string, string]> = [
      ['/', 'Finspeed — Ride Beyond Boundaries'],
      ['/dealers', 'Finspeed — Dealers'],
      ['/blog', 'Finspeed — Journal'],
      ['/brand-story', 'Finspeed — Our story'],
      ['/support', 'Finspeed — Support'],
      ['/testimonials', 'Finspeed — Rider stories'],
      ['/catalog', 'Finspeed — Shop'],
      ['/shop', 'Finspeed — Shop'],
      ['/build', 'Finspeed — Build your ride'],
      ['/stores', 'Finspeed — Stores'],
    ];
    for (const [path, title] of cases) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      const html = await response.text();
      expect(titleOf(html), path).toBe(title);
      expect(html, path).toContain('name="description"');
    }
  });

  test('serves the product name for a known product page', async ({ request }) => {
    const response = await request.get('/products/bull-shark');
    expect(response.status()).toBe(200);
    expect(titleOf(await response.text())).toBe('Finspeed — Bull Shark');
  });

  test('returns 404 with the not-found page for unknown paths', async ({ request }) => {
    for (const path of ['/definitely-not-a-route', '/products/not-a-model', '/shop/extra']) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
      expect(titleOf(await response.text()), path).toBe('Finspeed — Page not found');
    }
  });

  test('serves distributor portal metadata without indexing', async ({ request }) => {
    const response = await request.get('/distributor');
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(titleOf(html)).toBe('Finspeed Distributor');
    expect(html).toContain('noindex');
  });

  test('keeps the client title aligned with the server title after hydration', async ({ page }) => {
    await page.goto('/dealers');
    await expect(page).toHaveTitle('Finspeed — Dealers');
    await page.goto('/products/bull-shark');
    await expect(page).toHaveTitle('Finspeed — Bull Shark');
    await page.goto('/');
    await expect(page).toHaveTitle('Finspeed — Ride Beyond Boundaries');
  });
});

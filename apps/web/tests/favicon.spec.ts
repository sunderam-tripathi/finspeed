import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

const expectedIcons = [
  {
    path: '/favicon.ico',
    rel: 'icon',
    type: 'image/x-icon',
    sha256: '411b18567c46bd62cbe3718adfa5e2f4857ae38b2332c69d57d984ac2b703695',
  },
  {
    path: '/icon.png',
    rel: 'icon',
    type: 'image/png',
    sha256: 'b1e39d5fe223f8eed214d6513a45ab340d086364742244d91cba034342776b48',
  },
  {
    path: '/apple-icon.png',
    rel: 'apple-touch-icon',
    type: 'image/png',
    sha256: '50cd71aa725c040bc71a9208e91b2d303b3963517c30f4d3244253d10c2ad0e4',
  },
];

test('Finspeed favicon metadata serves the branded icon set', async ({ page, request }) => {
  await page.goto('/');

  const iconLinks = await page.locator('link[rel~="icon"], link[rel="apple-touch-icon"]').evaluateAll((links) =>
    links.map((link) => ({
      href: (link as HTMLLinkElement).href,
      rel: (link as HTMLLinkElement).rel,
      type: (link as HTMLLinkElement).type,
    })),
  );

  for (const expected of expectedIcons) {
    const link = iconLinks.find(({ href }) => new URL(href).pathname === expected.path);
    expect(link).toMatchObject({ rel: expected.rel, type: expected.type });

    const response = await request.get(link!.href);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain(expected.type);
    expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(expected.sha256);
  }
});

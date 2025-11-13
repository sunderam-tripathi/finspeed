import { test, expect } from '@playwright/test';
import { DEALERS } from '@/data/dealers';

const REQUIRED_KEYS: Array<keyof (typeof DEALERS)[number]> = [
  'name',
  'address',
  'city',
  'state',
  'postalCode',
  'services',
  'contact'
];

const POSTAL_REGEX = /^\d{6}$/;

test('dealer data matches SCN-004 schema', () => {
  expect(DEALERS.length).toBeGreaterThanOrEqual(3);
  for (const dealer of DEALERS) {
    for (const key of REQUIRED_KEYS) {
      expect(dealer[key]).toBeTruthy();
    }
    expect(POSTAL_REGEX.test(dealer.postalCode)).toBeTruthy();
    expect(Array.isArray(dealer.services) && dealer.services.length > 0).toBeTruthy();
    expect(typeof dealer.contact.email).toBe('string');
    expect(typeof dealer.contact.whatsapp).toBe('string');
  }
});

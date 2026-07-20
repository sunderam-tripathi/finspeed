import assert from 'node:assert/strict';
import test from 'node:test';

import {
  configurationEntries,
  createOrderReceipt,
  normalizeOrder,
  receiptFilename,
} from '../../features/storefront/account-orders.mjs';

const catalogue = [
  { id: 'mako-shark', name: 'Mako Shark', price: 10100, wheels: '27.5"', speed: '21-Speed' },
  { id: 'tiger-shark', name: 'Tiger Shark', price: 6500, wheels: '26"', speed: 'Single' },
];

const configuredOrder = {
  no: 'FS900001',
  date: '17 Jul 2026',
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
};

test('configured order lines retain their checkout price and build specification', () => {
  const normalized = normalizeOrder(configuredOrder, catalogue);

  assert.equal(normalized.items[0].unitPrice, 12450);
  assert.equal(normalized.items[0].lineTotal, 24900);
  assert.equal(normalized.total, 24900);
  assert.deepEqual(
    normalized.items[0].configurationEntries.map(({ label, value }) => [label, value]),
    [
      ['Frame', 'Mako frame · 27.5"'],
      ['Brakes', 'Hydraulic disc'],
      ['Suspension', 'Front suspension'],
      ['Gears', '21 speed'],
      ['Finish', 'Mint silver'],
    ],
  );
});

test('legacy seeded lines continue to resolve catalogue product data and price', () => {
  const normalized = normalizeOrder({ no: 'FS482190', items: [{ id: 'tiger-shark', qty: 1, unitPrice: null }], total: 6500 }, catalogue);

  assert.equal(normalized.items[0].name, 'Tiger Shark');
  assert.equal(normalized.items[0].unitPrice, 6500);
  assert.equal(normalized.items[0].specification, '26" · Single');
  assert.equal(normalized.total, 6500);
});

test('missing order totals are calculated from normalized line prices', () => {
  const normalized = normalizeOrder({ items: [{ id: 'tiger-shark', quantity: 2 }], total: null }, catalogue);
  assert.equal(normalized.total, 13000);
});

test('configuration entries ignore missing values instead of inventing details', () => {
  assert.deepEqual(configurationEntries({ brakes: { title: 'Mechanical disc' }, gears: null }), [
    { key: 'brakes', label: 'Brakes', value: 'Mechanical disc' },
  ]);
});

test('downloadable receipt includes the configured unit total and governed ownership terms', () => {
  const receipt = createOrderReceipt(configuredOrder, catalogue, { name: 'Arjun Mehta', email: 'arjun@example.com' });

  assert.match(receipt, /Mako Shark × 2 — INR 24,900/);
  assert.match(receipt, /Brakes: Hydraulic disc/);
  assert.match(receipt, /Warranty: current terms, eligibility and exclusions are confirmed by Finspeed\./);
  assert.match(receipt, /Service: scheduled service eligibility is confirmed before handover\./);
  assert.match(receipt, /support@finspeed\.online/);
  assert.match(receipt, /WhatsApp \+91 96506 08982/);
  assert.equal(receiptFilename('FS 90/001'), 'finspeed-fs-90-001-summary.txt');
});

test('preview summaries cannot be mistaken for live order receipts', () => {
  const receipt = createOrderReceipt(configuredOrder, catalogue, {
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    preview: true,
  });

  assert.match(receipt, /SAMPLE ORDER SUMMARY — NOT A LIVE ORDER/);
});

test('checkout productId lines preserve configuration, quantity, and unit pricing', () => {
  const normalized = normalizeOrder({
    no: 'FS-CHECKOUT',
    items: [{
      lineId: 'configured:mako-shark:checkout',
      productId: 'mako-shark',
      quantity: '3',
      unitPrice: '11100',
      configuration: { brakes: 'Power Brakes', gears: { label: '21-Speed' } },
    }],
  }, catalogue);

  assert.equal(normalized.items[0].productId, 'mako-shark');
  assert.equal(normalized.items[0].quantity, 3);
  assert.equal(normalized.items[0].unitPrice, 11100);
  assert.equal(normalized.items[0].lineTotal, 33300);
  assert.deepEqual(normalized.items[0].configurationEntries.map(({ label, value }) => [label, value]), [
    ['Brakes', 'Power Brakes'],
    ['Gears', '21-Speed'],
  ]);
});

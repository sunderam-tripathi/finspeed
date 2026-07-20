import assert from 'node:assert/strict';
import test from 'node:test';

import {
  productCommerceState,
  products,
  productVisualRegistration,
  resolveProductImage,
} from './storefront.js';

test('every storefront product resolves to a canonical light set and an edge-black dark studio', () => {
  assert.equal(products.length, 11);

  products.forEach(({ id }) => {
    const light = resolveProductImage(id, { theme: 'light', role: 'feature', width: 960 });
    const dark = resolveProductImage(id, { theme: 'dark', role: 'feature', width: 960 });

    assert.match(light.src, new RegExp(`/assets/configurator/v1/${id}/side-r/light/poster/.+-w960\\.webp$`));
    assert.match(dark.src, new RegExp(`/assets/products/dark-studio-v[23]/${id}-studio(?:-v3)?\\.webp$`));
    assert.equal(light.srcSet.split(', ').length, 3);
    assert.equal(dark.srcSet, undefined);
    assert.equal(light.registration.position, dark.registration.position);
    assert.equal(light.registration.baseline, dark.registration.baseline);
    assert.equal(light.style['--product-visual-baseline'], '88%');
    assert.equal(light.style['--product-visual-origin'], light.registration.origin);
    assert.equal(dark.style['--product-visual-origin'], dark.registration.origin);
  });
});

test('accuracy-reviewed dark relights use optimized v3 webp files while the remaining products retain v2', () => {
  const reviewed = new Set(['hammerhead', 'lightning-marlin', 'red-snapper', 'tiger-shark']);

  products.forEach(({ id }) => {
    const visual = resolveProductImage(id, { theme: 'dark', role: 'feature', width: 1600 });
    if (reviewed.has(id)) {
      assert.equal(visual.src, `/assets/products/dark-studio-v3/${id}-studio-v3.webp`);
    } else {
      assert.equal(visual.src, `/assets/products/dark-studio-v2/${id}-studio.webp`);
    }
    assert.doesNotMatch(visual.src, /\.png$/);
  });
});

test('theme-specific registration normalizes rendered subject bounds instead of forcing equal numeric scales', () => {
  assert.deepEqual(Object.keys(productVisualRegistration).sort(), products.map(({ id }) => id).sort());

  products.forEach(({ id }) => {
    ['light', 'dark'].forEach((theme) => {
      const { registration, transform } = resolveProductImage(id, { theme, role: 'related', width: 480 });
      const projectedWidth = registration.subject.width * registration.scale;
      const projectedHeight = registration.subject.height * registration.scale;

      assert.ok(projectedWidth <= 84.12, `${id} ${theme} width ${projectedWidth} exceeds the 84% stage target`);
      assert.ok(projectedHeight <= 80.12, `${id} ${theme} height ${projectedHeight} exceeds the 80% stage target`);
      assert.ok(projectedWidth >= 63, `${id} ${theme} is implausibly small after registration`);
      assert.match(transform, /^translate\(.+%\) scale\(.+\)$/);
      assert.equal(
        Number((registration.subject.bottom + registration.translateY).toFixed(2)),
        88,
        `${id} ${theme} must land on the shared tyre baseline`,
      );
      assert.equal(
        Number((registration.subject.centerX + registration.translateX).toFixed(2)),
        50,
        `${id} ${theme} must remain optically centered`,
      );
    });
  });

  assert.notEqual(
    resolveProductImage('red-snapper', { theme: 'light' }).registration.scale,
    resolveProductImage('red-snapper', { theme: 'dark' }).registration.scale,
  );
  assert.equal(resolveProductImage('sunset-marlin', { theme: 'light' }).registration.sourceLimited, true);
});

test('product commerce authority blocks identity-conflicted Bull Shark while audited models remain available', () => {
  const bullShark = productCommerceState('bull-shark');
  assert.equal(bullShark.ready, false);
  assert.equal(bullShark.status, 'identity-confirmation-required');
  assert.equal(bullShark.requiresConfirmation, true);
  assert.match(bullShark.note, /identity check/i);

  assert.equal(productCommerceState('mako-shark').ready, true);
  assert.equal(productCommerceState('mako-shark').requiresConfirmation, false);
});

test('requested display widths snap to the canonical 480, 960, and 1600 posters', () => {
  assert.match(resolveProductImage('mako-shark', { width: 520 }).src, /-w480\.webp$/);
  assert.match(resolveProductImage('mako-shark', { width: 1000 }).src, /-w960\.webp$/);
  assert.match(resolveProductImage('mako-shark', { width: 1440 }).src, /-w1600\.webp$/);
});

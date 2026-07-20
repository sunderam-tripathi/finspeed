import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CONFIGURATOR_SCHEMA_VERSION,
  CONFIGURATOR_STEPS,
  configurationSummary,
  configuredCartFingerprint,
  configuredCartPreview,
  configuratorCatalog,
  configuratorBasePrice,
  configuratorBasePriceByModel,
  configuratorVisual,
  createDefaultBuild,
  migrateBuild,
  optionsForStage,
  resolveBuild,
  selectBuildOption,
} from './configurator.js';

test('catalog exposes seven stages, eleven models, and eighteen physical SKUs', () => {
  assert.equal(CONFIGURATOR_SCHEMA_VERSION, 2);
  assert.equal(CONFIGURATOR_STEPS.length, 7);
  assert.equal(configuratorCatalog.models.length, 11);
  assert.equal(configuratorCatalog.skus.length, 18);
  assert.equal(new Set(configuratorCatalog.models.map(({ id }) => id)).size, 11);
  assert.equal(new Set(configuratorCatalog.skus.map(({ id }) => id)).size, 18);
});

test('model base-price authority resolves the lowest catalogued physical SKU without storefront duplication', () => {
  assert.equal(Object.keys(configuratorBasePriceByModel).length, 11);
  assert.equal(configuratorBasePrice('red-snapper'), 4800);
  assert.equal(configuratorBasePrice('sea-breeze'), 4800);
  assert.equal(configuratorBasePrice('tiger-shark'), 6500);
  assert.equal(configuratorBasePrice('mako-shark'), 10100);
  assert.equal(configuratorBasePrice('unknown-model'), null);
});

test('all SKUs resolve to a real model and an audited retail price', () => {
  const modelIds = new Set(configuratorCatalog.models.map(({ id }) => id));
  for (const sku of configuratorCatalog.skus) {
    assert.ok(modelIds.has(sku.modelId), `${sku.id} has a model`);
    assert.ok(Number.isFinite(sku.retailPrice), `${sku.id} has a numeric retail price`);
    const resolved = resolveBuild({ version: 2, modelId: sku.modelId, skuId: sku.id });
    assert.equal(resolved.sku.id, sku.id);
    assert.equal(resolved.price, sku.retailPrice);
    assert.equal(resolved.commerceReady, sku.id !== 'bull-shark-29');
  }
});

test('legacy two-frame build migrates and incompatible component concepts are removed', () => {
  const migrated = migrateBuild({
    base: 'bull',
    brakes: 'mechanical',
    suspension: 'rigid',
    gears: 'single',
    finish: 'graphite',
  });
  const resolved = resolveBuild(migrated);
  assert.equal(resolved.build.version, 2);
  assert.equal(resolved.build.modelId, 'bull-shark');
  assert.equal(resolved.build.skuId, 'bull-shark-29');
  assert.equal(resolved.build.finish, 'catalog-finish');
  assert.equal(resolved.build.components.brakes, 'disc-brake');
  assert.ok(resolved.issues.some(({ code }) => code === 'unsupported-brakes'));
});

test('ride type, model, and fit selections cascade deterministically', () => {
  let build = createDefaultBuild();
  build = selectBuildOption(build, 'ride-type', 'city');
  assert.equal(build.rideType, 'city');
  assert.equal(build.modelId, 'red-snapper');

  build = selectBuildOption(build, 'model', 'sea-breeze');
  build = selectBuildOption(build, 'fit', 'sea-breeze-26-ibc');
  assert.equal(build.modelId, 'sea-breeze');
  assert.equal(build.skuId, 'sea-breeze-26-ibc');
  assert.deepEqual(build.accessories, ['ibc-carrier']);
  assert.equal(resolveBuild(build).price, 5500);
});

test('Red Snapper and Sea Breeze each expose all four audited catalog variants', () => {
  for (const modelId of ['red-snapper', 'sea-breeze']) {
    const build = createDefaultBuild({ modelId });
    const variants = optionsForStage('fit', build);
    assert.equal(variants.length, 4);
    assert.deepEqual(variants.map(({ price }) => price), [4800, 5000, 5000, 5500]);
  }
});

test('uncatalogued finish and accessories cannot survive normalization', () => {
  const resolved = resolveBuild({
    ...createDefaultBuild(),
    finish: 'invented-blue',
    accessories: ['invented-rack'],
  });
  assert.equal(resolved.build.finish, 'catalog-finish');
  assert.deepEqual(resolved.build.accessories, []);
  assert.ok(resolved.issues.some(({ code }) => code === 'finish-reset'));
  assert.ok(resolved.issues.some(({ code }) => code === 'accessories-reset'));
});

test('summary, visual resolver, and fingerprint use the canonical build', () => {
  const build = createDefaultBuild({ modelId: 'mako-shark' });
  const resolved = resolveBuild(build);
  const summary = configurationSummary(resolved);
  const light = configuratorVisual(resolved, 'light');
  const dark = configuratorVisual(resolved, 'dark');

  assert.equal(summary.title, 'Mako Shark');
  assert.equal(resolved.options['ride-type'].length, 3);
  assert.equal(resolved.options['ride-setup'].length, 3);
  assert.equal(summary.price, 10100);
  assert.match(summary.alt, /Finspeed Mako Shark/);
  assert.equal(light.src, '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp');
  assert.match(light.srcSet, /mako-shark-27-5-geared-r01-w480\.webp 480w/);
  assert.equal(dark.src, '/assets/configurator/v1/mako-shark/side-r/dark/poster/mako-shark-27-5-geared-r01-w1600.webp');
  assert.match(dark.srcSet, /mako-shark-27-5-geared-r01-w480\.webp 480w/);
  assert.equal(configuredCartFingerprint(build), configuredCartFingerprint({ ...build, accessories: [] }));
  assert.match(configuredCartFingerprint(build), /^fsc2-[a-z0-9]{7}$/);
});

test('each single-SKU model resolves its own canonical light and dark visual family', () => {
  const singletonSkus = [
    ['hammerhead', 'hammerhead-24'],
    ['great-white-shark', 'great-white-shark-26'],
    ['lemon-shark', 'lemon-shark-27-5'],
    ['lightning-marlin', 'lightning-marlin-700c'],
    ['bull-shark', 'bull-shark-29'],
    ['shark-blue', 'shark-blue-26-geared'],
    ['mako-shark', 'mako-shark-27-5-geared'],
    ['sunset-marlin', 'sunset-marlin-700c-geared'],
  ];

  for (const [modelId, skuId] of singletonSkus) {
    const resolved = resolveBuild(createDefaultBuild({ modelId }));
    const light = configuratorVisual(resolved, 'light');
    const dark = configuratorVisual(resolved, 'dark');

    assert.equal(resolved.sku.id, skuId);
    assert.equal(resolved.sku.visual.assetKey, skuId);
    assert.match(light.src, new RegExp(`/assets/configurator/v1/${modelId}/side-r/light/poster/${skuId}-r01-w1600\\.webp$`));
    assert.match(light.srcSet, new RegExp(`${skuId}-r01-w480\\.webp 480w`));
    assert.match(dark.src, new RegExp(`/assets/configurator/v1/${modelId}/side-r/dark/poster/${skuId}-r01-w1600\\.webp$`));
    assert.match(dark.srcSet, new RegExp(`${skuId}-r01-w480\\.webp 480w`));
  }
});

test('the reviewed Red Snapper 24 IBC pilot resolves theme-matched responsive imagery', () => {
  const build = selectBuildOption(
    createDefaultBuild({ modelId: 'red-snapper' }),
    'fit',
    'red-snapper-24-ibc',
  );
  const resolved = resolveBuild(build);
  const light = configuratorVisual(resolved, 'light');
  const dark = configuratorVisual(resolved, 'dark');

  assert.match(light.src, /red-snapper-24-ibc-r01-w1600\.webp$/);
  assert.match(light.srcSet, /side-r\/light\/poster/);
  assert.match(dark.src, /side-r\/dark\/poster/);
  assert.match(dark.srcSet, /red-snapper-24-ibc-r01-w480\.webp 480w/);
  assert.equal(resolved.sku.visual.assetKey, 'red-snapper-24-ibc');
});

test('all four Sea Breeze fit choices resolve distinct canonical theme pairs', () => {
  const skuIds = [
    'sea-breeze-24-non-ibc',
    'sea-breeze-24-ibc',
    'sea-breeze-26-non-ibc',
    'sea-breeze-26-ibc',
  ];
  const lightSources = new Set();

  for (const skuId of skuIds) {
    const build = selectBuildOption(
      createDefaultBuild({ modelId: 'sea-breeze' }),
      'fit',
      skuId,
    );
    const resolved = resolveBuild(build);
    const light = configuratorVisual(resolved, 'light');
    const dark = configuratorVisual(resolved, 'dark');

    assert.equal(resolved.sku.visual.assetKey, skuId);
    assert.match(light.src, new RegExp(`${skuId}-r01-w1600\\.webp$`));
    assert.match(light.srcSet, /side-r\/light\/poster/);
    assert.match(dark.src, new RegExp(`${skuId}-r01-w1600\\.webp$`));
    assert.match(dark.srcSet, /side-r\/dark\/poster/);
    lightSources.add(light.src);
  }

  assert.equal(lightSources.size, skuIds.length);
});

test('Tiger Shark 24-inch and 26-inch fit choices resolve distinct canonical theme pairs', () => {
  const resolvedBySku = Object.fromEntries(
    ['tiger-shark-24', 'tiger-shark-26'].map((skuId) => {
      const build = selectBuildOption(
        createDefaultBuild({ modelId: 'tiger-shark' }),
        'fit',
        skuId,
      );
      return [skuId, resolveBuild(build)];
    }),
  );

  for (const [skuId, resolved] of Object.entries(resolvedBySku)) {
    const light = configuratorVisual(resolved, 'light');
    const dark = configuratorVisual(resolved, 'dark');
    assert.equal(resolved.sku.visual.assetKey, skuId);
    assert.match(light.src, new RegExp(`${skuId}-r01-w1600\\.webp$`));
    assert.match(light.srcSet, /side-r\/light\/poster/);
    assert.match(dark.src, new RegExp(`${skuId}-r01-w1600\\.webp$`));
    assert.match(dark.srcSet, /side-r\/dark\/poster/);
  }

  assert.notEqual(
    configuratorVisual(resolvedBySku['tiger-shark-24'], 'light').src,
    configuratorVisual(resolvedBySku['tiger-shark-26'], 'light').src,
  );
});

test('configured cart preview freezes canonical light and dark assets for the selected SKU', () => {
  const build = selectBuildOption(
    createDefaultBuild({ modelId: 'red-snapper' }),
    'fit',
    'red-snapper-24-ibc',
  );
  const preview = configuredCartPreview(build);

  assert.equal(preview.skuId, 'red-snapper-24-ibc');
  assert.equal(preview.light.theme, 'light');
  assert.equal(preview.dark.theme, 'dark');
  assert.match(preview.light.src, /side-r\/light\/poster/);
  assert.match(preview.dark.src, /side-r\/dark\/poster/);
  assert.equal(preview.light.visualStateId, preview.dark.visualStateId);
});

test('critical identity conflict blocks commerce while noncritical provisional specifications remain honest and orderable', () => {
  const bull = resolveBuild(createDefaultBuild({ modelId: 'bull-shark' }));
  const seaBreeze = resolveBuild(createDefaultBuild({ modelId: 'sea-breeze' }));

  assert.equal(bull.commerceReady, false);
  assert.equal(bull.identityConfirmationRequired, true);
  assert.equal(bull.commerceStatus, 'identity-confirmation-required');
  assert.ok(bull.issues.some(({ code, severity }) => (
    code === 'product-identity-confirmation-required' && severity === 'critical'
  )));

  assert.equal(seaBreeze.model.authority.status, 'provisional-specification');
  assert.equal(seaBreeze.commerceReady, true);
  assert.equal(seaBreeze.identityConfirmationRequired, false);
});

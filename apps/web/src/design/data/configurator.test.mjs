import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

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
  hasFullBuildVisualMatrix,
  migrateBuild,
  optionsForStage,
  resolveBuild,
  selectBuildOption,
} from './configurator.js';

const PUBLIC_ROOT = fileURLToPath(new URL('../../../public/', import.meta.url));

test('catalog exposes seven stages, eleven models, and eighteen physical SKUs', () => {
  assert.equal(CONFIGURATOR_SCHEMA_VERSION, 3);
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
    const resolved = resolveBuild(selectBuildOption(
      createDefaultBuild({ modelId: sku.modelId }),
      'fit',
      sku.id,
    ));
    assert.equal(resolved.sku.id, sku.id);
    assert.equal(resolved.price, sku.retailPrice);
    assert.equal(resolved.commerceReady, sku.id !== 'bull-shark-29');
  }
});

test('legacy builds migrate while recognised custom choices are preserved honestly', () => {
  const migrated = migrateBuild({
    base: 'bull',
    brakes: 'mechanical',
    suspension: 'rigid',
    gears: 'single',
    finish: 'graphite',
  });
  const resolved = resolveBuild(migrated);
  assert.equal(resolved.build.version, 3);
  assert.equal(resolved.build.modelId, 'bull-shark');
  assert.equal(resolved.build.skuId, 'bull-shark-29');
  assert.equal(resolved.build.finish, 'catalog-finish');
  assert.equal(resolved.build.components.brakes, 'disc-brake');
  assert.equal(resolved.build.components.fork, 'rigid-fork');
  assert.equal(resolved.build.components.drivetrain, 'single-speed');
  assert.equal(resolved.customizationConfirmationRequired, true);
  assert.equal(resolved.commerceReady, false);
  assert.ok(resolved.issues.some(({ code }) => code === 'invalid-brakes'));
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

test('Red Snapper and Sea Breeze separate wheel fit from carrier choice while retaining all four physical SKUs', () => {
  for (const modelId of ['red-snapper', 'sea-breeze']) {
    let build = createDefaultBuild({ modelId });
    const fits = optionsForStage('fit', build);
    assert.deepEqual(fits.map(({ label }) => label), ['24-inch', '26-inch']);

    build = selectBuildOption(build, 'fit', 'wheel:26-inch');
    assert.equal(resolveBuild(build).price, 5000);
    build = selectBuildOption(build, 'accessories', 'ibc-carrier');
    assert.equal(resolveBuild(build).sku.id, `${modelId}-26-ibc`);
    assert.equal(resolveBuild(build).price, 5500);
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
  assert.ok(resolved.issues.some(({ code }) => code === 'invalid-finish'));
  assert.ok(resolved.issues.some(({ code }) => code === 'invalid-accessories'));
});

test('setup, finish, and add-ons are real choices and custom selections survive normalization', () => {
  let build = createDefaultBuild({ modelId: 'mako-shark' });
  const setupOptions = optionsForStage('ride-setup', build);
  assert.equal(setupOptions.length, 6);
  assert.equal(setupOptions.every(({ visualPreview }) => visualPreview === true), true);
  assert.deepEqual(
    [...new Set(setupOptions.map(({ group }) => group))],
    ['brakes', 'fork', 'drivetrain'],
  );

  build = selectBuildOption(build, 'ride-setup', 'power-brake', 'brakes');
  build = selectBuildOption(build, 'ride-setup', 'rigid-fork', 'fork');
  build = selectBuildOption(build, 'ride-setup', 'single-speed', 'drivetrain');
  build = selectBuildOption(build, 'finish', 'deep-blue-request');
  build = selectBuildOption(build, 'accessories', 'ibc-carrier');
  const resolved = resolveBuild(build);
  const summary = configurationSummary(resolved);

  assert.deepEqual(resolved.build.components, {
    brakes: 'power-brake',
    fork: 'rigid-fork',
    drivetrain: 'single-speed',
  });
  assert.equal(resolved.build.finish, 'deep-blue-request');
  assert.deepEqual(resolved.build.accessories, ['ibc-carrier']);
  assert.equal(resolved.customizationConfirmationRequired, true);
  assert.equal(resolved.requestRequired, true);
  assert.equal(resolved.commerceReady, false);
  assert.equal(resolved.commerceStatus, 'custom-build-request');
  assert.equal(summary.rows.find(({ id }) => id === 'brakes').value, 'Power brake');
  assert.equal(summary.rows.find(({ id }) => id === 'finish').value, 'Deep blue');
  assert.equal(summary.rows.find(({ id }) => id === 'equipment').value, 'IBC frame-mounted carrier');
  assert.match(summary.priceQualifier, /Base bicycle/);
});

test('non-Mako custom setup and finish choices disclose and use selection-dependent visual coverage', () => {
  const build = createDefaultBuild({ modelId: 'red-snapper' });
  const baseLight = configuratorVisual(resolveBuild(build), 'light');
  const setupOptions = optionsForStage('ride-setup', build);
  const customSetupOptions = setupOptions.filter(({ selected }) => !selected);
  assert.ok(customSetupOptions.length > 0);
  assert.equal(customSetupOptions.every(({ visualPreview }) => visualPreview === true), true);
  assert.equal(customSetupOptions.every(({ copy }) => /Preview updates for this Red Snapper request/.test(copy)), true);
  for (const option of customSetupOptions) {
    const customBuild = selectBuildOption(build, 'ride-setup', option.id, option.group);
    const customLight = configuratorVisual(resolveBuild(customBuild), 'light');
    assert.notEqual(customLight.src, baseLight.src, `${option.id} changes the Red Snapper preview`);
  }

  const finishOptions = optionsForStage('finish', build);
  const customFinishOptions = finishOptions.filter(({ id }) => id !== 'catalog-finish');
  assert.equal(customFinishOptions.every(({ visualPreview }) => visualPreview === true), true);
  assert.equal(customFinishOptions.every(({ copy }) => /Preview updates for this Red Snapper finish request/.test(copy)), true);
  for (const option of customFinishOptions) {
    const customBuild = selectBuildOption(build, 'finish', option.id);
    const customLight = configuratorVisual(resolveBuild(customBuild), 'light');
    assert.notEqual(customLight.src, baseLight.src, `${option.id} changes the Red Snapper preview`);
  }
});

test('returning every custom choice to the catalog setup restores direct commerce', () => {
  let build = createDefaultBuild({ modelId: 'mako-shark' });
  build = selectBuildOption(build, 'finish', 'graphite-request');
  assert.equal(resolveBuild(build).commerceReady, false);
  build = selectBuildOption(build, 'finish', 'catalog-finish');
  assert.equal(resolveBuild(build).commerceReady, true);
  assert.equal(resolveBuild(build).requestRequired, false);
});

test('summary, visual resolver, and fingerprint use the canonical build', () => {
  const build = createDefaultBuild({ modelId: 'mako-shark' });
  const resolved = resolveBuild(build);
  const summary = configurationSummary(resolved);
  const light = configuratorVisual(resolved, 'light');
  const dark = configuratorVisual(resolved, 'dark');

  assert.equal(summary.title, 'Mako Shark');
  assert.equal(resolved.options['ride-type'].length, 3);
  assert.equal(resolved.options['ride-setup'].length, 6);
  assert.equal(resolved.options.finish.length, 5);
  assert.equal(resolved.options.accessories.length, 2);
  assert.equal(summary.price, 10100);
  assert.match(summary.alt, /Finspeed Mako Shark/);
  assert.equal(light.src, '/assets/configurator/v1/mako-shark/side-r/light/poster/mako-shark-27-5-geared-r01-w1600.webp');
  assert.match(light.srcSet, /mako-shark-27-5-geared-r01-w480\.webp 480w/);
  assert.equal(dark.src, '/assets/configurator/v1/mako-shark/side-r/dark/poster/mako-shark-27-5-geared-r01-w1600.webp');
  assert.match(dark.srcSet, /mako-shark-27-5-geared-r01-w480\.webp 480w/);
  assert.equal(configuredCartFingerprint(build), configuredCartFingerprint({ ...build, accessories: [] }));
  assert.match(configuredCartFingerprint(build), /^fsc3-[a-z0-9]{7}$/);
});

test('the governed Mako Shark matrix changes the preview for every build selection', () => {
  const brakes = ['power-brake', 'disc-brake'];
  const forks = ['rigid-fork', 'front-suspension'];
  const drivetrains = ['single-speed', '21-speed'];
  const finishes = ['catalog-finish', 'graphite-request', 'deep-blue-request', 'signal-red-request', 'pearl-silver-request'];
  const accessories = ['none', 'ibc-carrier'];
  const lightSources = new Set();
  const darkSources = new Set();

  for (const brake of brakes) {
    for (const fork of forks) {
      for (const drivetrain of drivetrains) {
        for (const finish of finishes) {
          for (const accessory of accessories) {
            let build = createDefaultBuild({ modelId: 'mako-shark' });
            build = selectBuildOption(build, 'ride-setup', brake, 'brakes');
            build = selectBuildOption(build, 'ride-setup', fork, 'fork');
            build = selectBuildOption(build, 'ride-setup', drivetrain, 'drivetrain');
            build = selectBuildOption(build, 'finish', finish);
            build = selectBuildOption(build, 'accessories', accessory);
            const resolved = resolveBuild(build);
            const light = configuratorVisual(resolved, 'light');
            const dark = configuratorVisual(resolved, 'dark');

            assert.match(light.src, /^\/assets\/configurator\/v1\/mako-shark\/side-r\/light\/poster\/mako-/);
            assert.match(dark.src, /^\/assets\/configurator\/v1\/mako-shark\/side-r\/dark\/poster\/mako-/);
            assert.match(light.srcSet, /-r01-w480\.webp 480w/);
            assert.match(dark.srcSet, /-r01-w480\.webp 480w/);
            if (resolved.customizationConfirmationRequired) {
              assert.equal(light.fidelity, 'approved-assisted-full-build-preview');
              assert.equal(dark.fidelity, 'approved-assisted-full-build-preview');
            } else {
              // The exact catalog state keeps the governed Tier A stock poster.
              assert.match(light.src, /mako-shark-27-5-geared-r01-w1600\.webp$/);
              assert.equal(light.fidelity, resolved.sku.visual.match);
            }
            lightSources.add(light.src);
            darkSources.add(dark.src);
          }
        }
      }
    }
  }

  assert.equal(lightSources.size, 80);
  assert.equal(darkSources.size, 80);
});

test('all products resolve every selectable configuration to distinct, complete responsive theme assets', () => {
  const componentOptions = {
    brakes: ['power-brake', 'disc-brake'],
    fork: ['rigid-fork', 'front-suspension'],
    drivetrain: ['single-speed', '21-speed'],
  };
  const finishes = ['catalog-finish', 'graphite-request', 'deep-blue-request', 'signal-red-request', 'pearl-silver-request'];
  const accessories = ['none', 'ibc-carrier'];
  const themes = ['light', 'dark'];
  const widths = [480, 960, 1600];
  const visualStateIds = new Set();
  const sourcesByTheme = Object.fromEntries(themes.map((theme) => [theme, new Set()]));
  let selectableStates = 0;
  let checkedAssets = 0;

  for (const model of configuratorCatalog.models) {
    assert.equal(hasFullBuildVisualMatrix(model.id), true, `${model.name} has an active exhaustive matrix`);
    const wheels = [...new Set(configuratorCatalog.skus
      .filter((sku) => sku.modelId === model.id)
      .map((sku) => sku.wheel))];

    for (const wheel of wheels) {
      for (const brakes of componentOptions.brakes) {
        for (const fork of componentOptions.fork) {
          for (const drivetrain of componentOptions.drivetrain) {
            for (const finish of finishes) {
              for (const accessory of accessories) {
                let build = createDefaultBuild({ modelId: model.id });
                build = selectBuildOption(build, 'fit', `wheel:${wheel}`);
                build = selectBuildOption(build, 'ride-setup', brakes, 'brakes');
                build = selectBuildOption(build, 'ride-setup', fork, 'fork');
                build = selectBuildOption(build, 'ride-setup', drivetrain, 'drivetrain');
                build = selectBuildOption(build, 'finish', finish);
                build = selectBuildOption(build, 'accessories', accessory);
                const resolved = resolveBuild(build);

                assert.equal(resolved.model.id, model.id);
                assert.equal(resolved.build.fit.wheel, wheel);
                assert.equal(resolved.build.components.brakes, brakes);
                assert.equal(resolved.build.components.fork, fork);
                assert.equal(resolved.build.components.drivetrain, drivetrain);
                assert.equal(resolved.build.finish, finish);
                assert.equal(resolved.build.accessories.includes('ibc-carrier'), accessory === 'ibc-carrier');
                assert.equal(visualStateIds.has(resolved.visualStateId), false, `duplicate state ${resolved.visualStateId}`);
                visualStateIds.add(resolved.visualStateId);
                selectableStates += 1;

                for (const theme of themes) {
                  const visual = configuratorVisual(resolved, theme);
                  assert.match(
                    visual.src,
                    new RegExp(`^/assets/configurator/v1/${model.id}/side-r/${theme}/poster/`),
                  );
                  assert.equal(sourcesByTheme[theme].has(visual.src), false, `duplicate ${theme} source ${visual.src}`);
                  sourcesByTheme[theme].add(visual.src);
                  const responsivePaths = new Map(
                    visual.srcSet.split(', ').map((candidate) => {
                      const [assetPath, widthToken] = candidate.split(' ');
                      return [Number(widthToken.slice(0, -1)), assetPath];
                    }),
                  );
                  assert.deepEqual([...responsivePaths.keys()], widths);
                  for (const width of widths) {
                    const assetPath = responsivePaths.get(width);
                    assert.ok(assetPath, `${visual.visualStateId} has ${theme} ${width}w source`);
                    assert.equal(
                      existsSync(path.join(PUBLIC_ROOT, assetPath.slice(1))),
                      true,
                      `missing ${theme} ${width}w asset ${assetPath}`,
                    );
                    checkedAssets += 1;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  assert.equal(selectableStates, 1120);
  assert.equal(visualStateIds.size, 1120);
  assert.equal(sourcesByTheme.light.size, 1120);
  assert.equal(sourcesByTheme.dark.size, 1120);
  assert.equal(checkedAssets, 6720);
});

test('each single-SKU model resolves its own canonical light and dark visual family', () => {
  const singletonSkus = [
    ['hammerhead', 'hammerhead-24'],
    ['great-white-shark', 'great-white-shark-26'],
    ['lemon-shark', 'lemon-shark-27-5'],
    ['lightning-marlin', 'lightning-marlin-700c'],
    ['bull-shark', 'bull-shark-29'],
    ['shark-blue', 'shark-blue-26-geared'],
    ['sunset-marlin', 'sunset-marlin-700c-geared'],
  ];

  for (const [modelId, skuId] of singletonSkus) {
    const resolved = resolveBuild(createDefaultBuild({ modelId }));
    const light = configuratorVisual(resolved, 'light');
    const dark = configuratorVisual(resolved, 'dark');

    assert.equal(resolved.sku.id, skuId);
    assert.equal(resolved.sku.visual.assetKey, skuId);
    assert.match(light.src, new RegExp(`/assets/configurator/v1/${modelId}/side-r/light/poster/${modelId}-.+-r01-w1600\\.webp$`));
    assert.match(light.srcSet, new RegExp(`${modelId}-.+-r01-w480\\.webp 480w`));
    assert.match(dark.src, new RegExp(`/assets/configurator/v1/${modelId}/side-r/dark/poster/${modelId}-.+-r01-w1600\\.webp$`));
    assert.match(dark.srcSet, new RegExp(`${modelId}-.+-r01-w480\\.webp 480w`));
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
  const assetKey = 'red-snapper-24-ibc';

  assert.equal(light.src, `/assets/configurator/v1/red-snapper/side-r/light/poster/${assetKey}-r01-w1600.webp`);
  assert.match(light.srcSet, new RegExp(`${assetKey}-r01-w480\\.webp 480w`));
  assert.equal(dark.src, `/assets/configurator/v1/red-snapper/side-r/dark/poster/${assetKey}-r01-w1600.webp`);
  assert.match(dark.srcSet, new RegExp(`${assetKey}-r01-w480\\.webp 480w`));
  assert.equal(light.visualStateId, dark.visualStateId);
  assert.equal(resolved.sku.visual.assetKey, 'red-snapper-24-ibc');
});

test('all four Sea Breeze fit choices resolve distinct exhaustive theme pairs', () => {
  const skuStates = [
    ['sea-breeze-24-non-ibc', 'sea-breeze-24-non-ibc'],
    ['sea-breeze-24-ibc', 'sea-breeze-24-ibc'],
    ['sea-breeze-26-non-ibc', 'sea-breeze-26-non-ibc'],
    ['sea-breeze-26-ibc', 'sea-breeze-26-ibc'],
  ];
  const lightSources = new Set();

  for (const [skuId, assetKey] of skuStates) {
    const build = selectBuildOption(
      createDefaultBuild({ modelId: 'sea-breeze' }),
      'fit',
      skuId,
    );
    const resolved = resolveBuild(build);
    const light = configuratorVisual(resolved, 'light');
    const dark = configuratorVisual(resolved, 'dark');

    assert.equal(resolved.sku.visual.assetKey, skuId);
    assert.equal(light.src, `/assets/configurator/v1/sea-breeze/side-r/light/poster/${assetKey}-r01-w1600.webp`);
    assert.match(light.srcSet, new RegExp(`${assetKey}-r01-w480\\.webp 480w`));
    assert.equal(dark.src, `/assets/configurator/v1/sea-breeze/side-r/dark/poster/${assetKey}-r01-w1600.webp`);
    assert.match(dark.srcSet, new RegExp(`${assetKey}-r01-w480\\.webp 480w`));
    assert.equal(light.visualStateId, dark.visualStateId);
    lightSources.add(light.src);
  }

  assert.equal(lightSources.size, skuStates.length);
});

test('Tiger Shark 24-inch and 26-inch fit choices resolve distinct exhaustive theme pairs', () => {
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
    const assetKey = skuId;
    assert.equal(resolved.sku.visual.assetKey, skuId);
    assert.equal(light.src, `/assets/configurator/v1/tiger-shark/side-r/light/poster/${assetKey}-r01-w1600.webp`);
    assert.match(light.srcSet, new RegExp(`${assetKey}-r01-w480\\.webp 480w`));
    assert.equal(dark.src, `/assets/configurator/v1/tiger-shark/side-r/dark/poster/${assetKey}-r01-w1600.webp`);
    assert.match(dark.srcSet, new RegExp(`${assetKey}-r01-w480\\.webp 480w`));
    assert.equal(light.visualStateId, dark.visualStateId);
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

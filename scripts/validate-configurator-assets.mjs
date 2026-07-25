#!/usr/bin/env node

/**
 * Read-only validation for the WEB-035 configurator asset inventory.
 *
 * The validator intentionally accepts honest `missing` selection variants and
 * rejects invented paths. It verifies the exact stock fallback set, actual
 * WebP dimensions, and the governed SHA-256 chain for Tier A light assets.
 */

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_MANIFEST = path.join(
  REPO_ROOT,
  'apps',
  'web',
  'public',
  'assets',
  'configurator',
  'manifest.json',
);
const CONFIGURATOR_MODULE = path.join(
  REPO_ROOT,
  'apps',
  'web',
  'src',
  'design',
  'data',
  'configurator.js',
);

const EXPECTED_PRODUCTS = [
  'bull-shark',
  'great-white-shark',
  'hammerhead',
  'lemon-shark',
  'lightning-marlin',
  'mako-shark',
  'red-snapper',
  'sea-breeze',
  'shark-blue',
  'sunset-marlin',
  'tiger-shark',
];

const REQUIRED_SELECTION_CLASSES = [
  'fit',
  'brakes',
  'fork',
  'drivetrain',
  'finish',
  'accessories',
];

const REQUIRED_WIDTHS = [480, 960, 1600];
const EXHAUSTIVE_VISUAL_CONTRACT = Object.freeze({
  matrices: 11,
  selectableStates: 1120,
  themedStates: 2240,
  responsiveAssets: 6720,
});

// One exact catalog state per catalogued physical SKU keeps its governed
// Tier A stock poster instead of the matrix render, in both themes.
const EXPECTED_SKU_COUNT = 18;

const errors = [];
let checkedAssets = 0;
let verifiedTierAAssets = 0;
let missingSelectionClasses = 0;
let runtimeResolverStates = 0;
let matrixRuntimeResolverStates = 0;
let catalogShadowedMatrixStates = 0;
let stockFamilyAssetsChecked = 0;
let customVisualFamilies = 0;
let hashBoundPixelMetricAssets = 0;
let nonCanonicalVisualFamilies = 0;
let matrixVisualFamilies = 0;
let matrixResponsiveAssets = 0;

function check(condition, message) {
  if (!condition) errors.push(message);
}

function sorted(values) {
  return [...values].sort((left, right) => String(left).localeCompare(String(right)));
}

function sameSet(actual, expected) {
  return JSON.stringify(sorted(actual)) === JSON.stringify(sorted(expected));
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function parseSrcSet(value, label) {
  if (!value) return [];
  return String(value).split(',').map((candidate) => {
    const match = candidate.trim().match(/^(\S+)\s+(\d+)w$/);
    check(Boolean(match), `${label} contains an invalid srcSet candidate: ${candidate.trim()}`);
    return match ? { path: match[1], width: Number(match[2]) } : null;
  }).filter(Boolean);
}

function maxSpread(values) {
  return Math.max(...values) - Math.min(...values);
}

function visualFamilies(entry) {
  return Array.isArray(entry?.families) ? entry.families : [entry];
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function webpDimensions(buffer, label) {
  if (
    buffer.length < 20
    || buffer.toString('ascii', 0, 4) !== 'RIFF'
    || buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    throw new Error(`${label} is not a WebP RIFF file`);
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (chunkType === 'VP8X' && data + 10 <= buffer.length) {
      return {
        width: readUInt24LE(buffer, data + 4) + 1,
        height: readUInt24LE(buffer, data + 7) + 1,
      };
    }

    if (chunkType === 'VP8 ' && data + 10 <= buffer.length) {
      check(
        buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a,
        `${label} has an invalid VP8 frame header`,
      );
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      };
    }

    if (chunkType === 'VP8L' && data + 5 <= buffer.length) {
      check(buffer[data] === 0x2f, `${label} has an invalid VP8L signature`);
      const byte1 = buffer[data + 1];
      const byte2 = buffer[data + 2];
      const byte3 = buffer[data + 3];
      const byte4 = buffer[data + 4];
      return {
        width: 1 + byte1 + ((byte2 & 0x3f) << 8),
        height: 1 + ((byte2 & 0xc0) >> 6) + (byte3 << 2) + ((byte4 & 0x0f) << 10),
      };
    }

    offset = data + chunkSize + (chunkSize % 2);
  }

  throw new Error(`${label} has no supported WebP image chunk`);
}

function webpUsesAlpha(buffer, label) {
  if (
    buffer.length < 20
    || buffer.toString('ascii', 0, 4) !== 'RIFF'
    || buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    throw new Error(`${label} is not a WebP RIFF file`);
  }

  let offset = 12;
  let alphaFromExtendedHeader = false;
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (chunkType === 'ALPH') return true;
    if (chunkType === 'VP8X' && data < buffer.length) {
      alphaFromExtendedHeader = (buffer[data] & 0x10) !== 0;
    }
    if (chunkType === 'VP8L' && data + 5 <= buffer.length) {
      const losslessHeader = buffer.readUInt32LE(data + 1);
      return (losslessHeader & 0x10000000) !== 0;
    }

    offset = data + chunkSize + (chunkSize % 2);
  }
  return alphaFromExtendedHeader;
}

function publicAssetPath(publicRoot, urlPath, label) {
  check(typeof urlPath === 'string' && urlPath.startsWith('/assets/'), `${label} must start with /assets/`);
  check(!String(urlPath).includes('..'), `${label} must not contain path traversal`);
  const relative = String(urlPath).replace(/^\/+/, '').split('/').join(path.sep);
  const absolute = path.resolve(publicRoot, relative);
  const rootWithSeparator = `${path.resolve(publicRoot)}${path.sep}`;
  check(absolute.startsWith(rootWithSeparator), `${label} resolves outside apps/web/public`);
  return absolute;
}

async function loadJson(filePath, label) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${label}: ${error.message}`);
  }
}

async function validateAsset(publicRoot, asset, label) {
  check(asset && typeof asset === 'object', `${label} must be an object`);
  check(Number.isInteger(asset?.width) && asset.width > 0, `${label}.width must be a positive integer`);
  check(Number.isInteger(asset?.height) && asset.height > 0, `${label}.height must be a positive integer`);

  const absolute = publicAssetPath(publicRoot, asset?.path, `${label}.path`);
  try {
    const buffer = await readFile(absolute);
    const dimensions = webpDimensions(buffer, label);
    check(dimensions.width === asset.width, `${label} width is ${dimensions.width}; manifest says ${asset.width}`);
    check(dimensions.height === asset.height, `${label} height is ${dimensions.height}; manifest says ${asset.height}`);
    checkedAssets += 1;
    return { buffer, absolute, usesAlpha: webpUsesAlpha(buffer, label) };
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
    return null;
  }
}

function validateCustomPixelFamilies(customEntries, manifest) {
  const responsiveTolerance = Number(manifest.pixelValidation?.responsiveMetricTolerancePercent);
  const canonical = manifest.canonical;

  check(
    Number.isFinite(responsiveTolerance) && responsiveTolerance >= 0 && responsiveTolerance <= 1,
    'pixelValidation.responsiveMetricTolerancePercent must be between 0 and 1',
  );

  for (const entryRecord of customEntries) {
    const { entry, label, assetRecords } = entryRecord;
    customVisualFamilies += 1;

    const byTheme = new Map((canonical.themes || []).map((theme) => [
      theme,
      assetRecords.filter((record) => record.asset.theme === theme),
    ]));

    for (const theme of canonical.themes || []) {
      const records = byTheme.get(theme) || [];
      check(
        sameSet(records.map(({ asset }) => asset.width), REQUIRED_WIDTHS),
        `${label} ${theme} assets must contain exactly ${REQUIRED_WIDTHS.join(', ')} widths`,
      );
      check(
        records.every(({ asset }) => asset.height === Math.round(asset.width * 2 / 3)),
        `${label} ${theme} assets must retain the 3:2 responsive canvas (with integer rounding)`,
      );

      for (const record of records) {
        const expectedAlphaMode = record.asset.alphaMode || (
          theme === 'light' && entry.lightPresentation !== 'multiply-poster'
            ? 'transparent'
            : 'opaque'
        );
        check(record.asset.alphaMode === expectedAlphaMode, `${record.assetLabel}.alphaMode must be ${expectedAlphaMode}`);
        check(
          record.usesAlpha === (expectedAlphaMode === 'transparent'),
          `${record.assetLabel} encoded WebP alpha does not match alphaMode ${expectedAlphaMode}`,
        );
        if (expectedAlphaMode === 'transparent') {
          const metrics = record.asset.pixelMetrics;
          check(Boolean(metrics), `${record.assetLabel}.pixelMetrics is required for transparent custom assets`);
          check(
            metrics?.subjectThreshold === manifest.pixelValidation.alphaSubjectThreshold,
            `${record.assetLabel}.pixelMetrics.subjectThreshold must match pixelValidation.alphaSubjectThreshold`,
          );
          check(metrics?.alphaMin === 0 && metrics?.alphaMax === 255, `${record.assetLabel} must record full alpha range 0..255`);
          check(Boolean(metrics?.subjectBounds), `${record.assetLabel}.pixelMetrics.subjectBounds is required`);
          hashBoundPixelMetricAssets += 1;
        } else {
          check(!record.asset.pixelMetrics, `${record.assetLabel} opaque poster must not claim alpha-derived subject bounds`);
        }
      }
    }

    const lightMetrics = (byTheme.get('light') || [])
      .map((record) => record.asset.pixelMetrics?.subjectBounds)
      .filter(Boolean);
    const metricNames = [
      'subjectWidthPercent',
      'baselinePercent',
      'topSafetyPercent',
      'leftSafetyPercent',
      'rightSafetyPercent',
    ];
    for (const metricName of metricNames) {
      if (lightMetrics.length === REQUIRED_WIDTHS.length) {
        check(
          maxSpread(lightMetrics.map((item) => item[metricName])) <= responsiveTolerance,
          `${label} ${metricName} shifts by more than ${responsiveTolerance} percentage points across responsive widths`,
        );
      }
    }

    if (entry.canvasConformance === 'canonical') {
      // 480px derivatives quantize one source pixel to 0.2083 percentage
      // points.  Half-pixel rounding can therefore land just outside a
      // canonical boundary even when the 3072px master is registered exactly.
      const rasterRoundingEpsilon = 0.15;
      for (const metrics of lightMetrics) {
        check(
          Math.abs(metrics.subjectWidthPercent - canonical.subjectWidthPercent.target)
            <= canonical.subjectWidthPercent.tolerance + rasterRoundingEpsilon,
          `${label} subject width ${metrics.subjectWidthPercent}% is outside canonical ${canonical.subjectWidthPercent.target}% +/- ${canonical.subjectWidthPercent.tolerance}%`,
        );
        check(
          Math.abs(metrics.baselinePercent - canonical.baselinePercent.target)
            <= canonical.baselinePercent.tolerance + rasterRoundingEpsilon,
          `${label} baseline ${metrics.baselinePercent}% is outside canonical ${canonical.baselinePercent.target}% +/- ${canonical.baselinePercent.tolerance}%`,
        );
        check(metrics.topSafetyPercent + rasterRoundingEpsilon >= canonical.safetyPercent.top, `${label} top safety is below canonical minimum`);
        check(metrics.leftSafetyPercent + rasterRoundingEpsilon >= canonical.safetyPercent.left, `${label} left safety is below canonical minimum`);
        check(metrics.rightSafetyPercent + rasterRoundingEpsilon >= canonical.safetyPercent.right, `${label} right safety is below canonical minimum`);
      }
    } else {
      check(
        entry.canvasConformance === 'reviewed-pilot-noncanonical',
        `${label}.canvasConformance must be canonical or reviewed-pilot-noncanonical`,
      );
      check(entry.layoutReview?.status === 'known-deviation', `${label}.layoutReview must disclose a known deviation`);
      check(
        typeof entry.layoutReview?.reason === 'string' && entry.layoutReview.reason.length >= 24,
        `${label}.layoutReview.reason must explain the non-canonical framing`,
      );
      nonCanonicalVisualFamilies += 1;
    }
  }
}

async function validateRuntimeResolver(manifest) {
  const runtime = await import(pathToFileURL(CONFIGURATOR_MODULE).href);
  const catalog = runtime.configuratorCatalog;
  const productsById = new Map((manifest.products || []).map((product) => [product.productId, product]));
  const modelsById = new Map((catalog.models || []).map((model) => [model.id, model]));
  const skusById = new Map((catalog.skus || []).map((sku) => [sku.id, sku]));
  const matrixById = new Map((manifest.visualMatrices || []).map((matrix) => [matrix.id, matrix]));
  const matrixBySkuId = new Map();
  for (const matrix of manifest.visualMatrices || []) {
    for (const skuId of matrix.sourceSkuIds || []) {
      const sku = skusById.get(skuId);
      check(Boolean(sku), `visual matrix ${matrix.id} references unknown runtime SKU ${skuId}`);
      check(sku?.modelId === matrix.productId, `visual matrix ${matrix.id} registers SKU ${skuId} under the wrong product`);
      check(!matrixBySkuId.has(skuId), `runtime SKU ${skuId} is registered by more than one visual matrix`);
      matrixBySkuId.set(skuId, matrix);
    }
  }

  check(modelsById.size === catalog.models.length, 'runtime configurator model IDs must be unique');
  check(skusById.size === catalog.skus.length, 'runtime configurator SKU IDs must be unique');
  check(
    sameSet(modelsById.keys(), productsById.keys()),
    'runtime configurator models and manifest products must be the same exact set',
  );

  const customManifestBySku = new Map();
  const stateManifestFamilies = [];
  for (const product of manifest.products || []) {
    for (const [selectionClass, entry] of Object.entries(product.selectionDependent || {})) {
      if (entry.status === 'missing') continue;
      if (entry.matrixId) {
        const matrix = matrixById.get(entry.matrixId);
        check(Boolean(matrix), `products.${product.productId}.selectionDependent.${selectionClass}.matrixId references an unknown visual matrix`);
        check(matrix?.productId === product.productId, `products.${product.productId}.selectionDependent.${selectionClass}.matrixId points to the wrong product`);
        for (const family of entry.stockFamilies || []) {
          check(
            Array.isArray(family.sourceSkuIds) && family.sourceSkuIds.length > 0,
            `products.${product.productId}.selectionDependent.${selectionClass}.stockFamilies.${family.variant || 'family'}.sourceSkuIds is required`,
          );
          for (const skuId of family.sourceSkuIds || []) {
            check(!customManifestBySku.has(skuId), `manifest SKU ${skuId} is registered by more than one custom visual entry`);
            customManifestBySku.set(skuId, { product, entry: family, selectionClass });
          }
        }
        continue;
      }
      for (const family of visualFamilies(entry)) {
        check(
          Array.isArray(family.sourceSkuIds) && family.sourceSkuIds.length > 0,
          `products.${product.productId}.selectionDependent.${selectionClass}.${family.variant || 'family'}.sourceSkuIds is required`,
        );
        if (family.stateCriteria) {
          stateManifestFamilies.push({ product, entry: family, selectionClass });
          continue;
        }
        for (const skuId of family.sourceSkuIds || []) {
          check(!customManifestBySku.has(skuId), `manifest SKU ${skuId} is registered by more than one custom visual entry`);
          customManifestBySku.set(skuId, { product, entry: family, selectionClass });
        }
      }
    }
  }

  for (const sku of catalog.skus || []) {
    const model = modelsById.get(sku.modelId);
    const product = productsById.get(sku.modelId);
    check(Boolean(model), `runtime SKU ${sku.id} references unknown model ${sku.modelId}`);
    check(Boolean(product), `runtime SKU ${sku.id} has no manifest product ${sku.modelId}`);
    if (!model || !product) continue;

    // Drive the public selection API instead of constructing an incomplete
    // raw payload. Carrier-equipped physical SKUs intentionally synchronize
    // their add-on state during fit selection.
    const runtimeBuild = runtime.selectBuildOption(
      runtime.createDefaultBuild({ modelId: model.id }),
      'fit',
      sku.id,
    );
    const resolved = runtime.resolveBuild(runtimeBuild);
    check(resolved.sku.id === sku.id, `runtime resolver cannot round-trip SKU ${sku.id}`);

    const manifestCustom = customManifestBySku.get(sku.id);
    const manifestMatrix = matrixBySkuId.get(sku.id);
    if (sku.visual.assetKey) {
      check(Boolean(manifestCustom || manifestMatrix), `runtime custom visual ${sku.visual.assetKey} for ${sku.id} is absent from the manifest`);
      if (manifestCustom) {
        check(manifestCustom.product.productId === sku.modelId, `custom visual for ${sku.id} is registered under the wrong product`);
        check(manifestCustom.entry.variant === sku.visual.assetKey, `custom visual key for ${sku.id} differs between runtime and manifest`);
      }
    } else {
      check(!manifestCustom, `manifest registers a custom visual for ${sku.id}, but the runtime SKU has no visual.assetKey`);
    }

    // Exact catalog states keep the governed Tier A stock poster, so the
    // matrix registration is intentionally shadowed for them at runtime.
    const stockShadowed = !resolved.customizationConfirmationRequired
      && Boolean(sku.visual.assetKey)
      && Boolean(manifestCustom);

    for (const theme of ['light', 'dark']) {
      const visual = runtime.configuratorVisual(resolved, theme);
      check(visual.productId === product.productId, `runtime visual product mismatch for ${sku.id} (${theme})`);
      check(visual.skuId === sku.id, `runtime visual SKU mismatch for ${sku.id} (${theme})`);

      if (manifestMatrix && !stockShadowed) {
        const inventoryPath = publicAssetPath(path.resolve(REPO_ROOT, manifest.publicRoot || 'apps/web/public'), manifestMatrix.inventoryPath, `visualMatrices.${manifestMatrix.id}.inventoryPath`);
        const inventory = await loadJson(inventoryPath, `visual matrix ${manifestMatrix.id}`);
        const variant = inventory.variants.find((candidate) => (
          (!candidate.stateCriteria?.fitWheel || candidate.stateCriteria.fitWheel === resolved.build.fit.wheel)
          && candidate.stateCriteria?.components?.brakes === resolved.build.components.brakes
          && candidate.stateCriteria?.components?.fork === resolved.build.components.fork
          && candidate.stateCriteria?.components?.drivetrain === resolved.build.components.drivetrain
          && candidate.stateCriteria?.finishId === resolved.build.finish
          && JSON.stringify(candidate.stateCriteria?.accessories || []) === JSON.stringify(resolved.build.accessories || [])
        ));
        check(Boolean(variant), `visual matrix ${manifestMatrix.id} has no variant for runtime state ${resolved.visualStateId}`);
        const themeAssets = (variant?.assets || []).filter((asset) => asset.theme === theme);
        const largest = themeAssets.find((asset) => asset.width === 1600);
        check(visual.src === largest?.path, `runtime matrix src for ${sku.id} (${theme}) is not the matrix 1600px asset`);
        check(
          JSON.stringify(parseSrcSet(visual.srcSet, `${sku.id} matrix ${theme}`).sort((a, b) => a.width - b.width))
            === JSON.stringify(themeAssets.map(({ path: assetPath, width }) => ({ path: assetPath, width })).sort((a, b) => a.width - b.width)),
          `runtime matrix srcSet for ${sku.id} (${theme}) differs from matrix assets`,
        );
      } else if (manifestCustom) {
        const themeAssets = manifestCustom.entry.assets.filter((asset) => asset.theme === theme);
        const largest = themeAssets.find((asset) => asset.width === 1600);
        check(visual.src === largest?.path, `runtime src for ${sku.id} (${theme}) is not the manifest 1600px asset`);
        check(
          JSON.stringify(parseSrcSet(visual.srcSet, `${sku.id} ${theme}`).sort((a, b) => a.width - b.width))
            === JSON.stringify(themeAssets.map(({ path: assetPath, width }) => ({ path: assetPath, width })).sort((a, b) => a.width - b.width)),
          `runtime srcSet for ${sku.id} (${theme}) differs from the manifest assets`,
        );
      } else if (theme === 'light') {
        const stockAssets = product.stock.light.assets;
        const largest = stockAssets.find((asset) => asset.width === 1600);
        check(visual.src === largest?.path, `runtime light fallback for ${sku.id} is not the registered stock asset`);
        check(
          JSON.stringify(parseSrcSet(visual.srcSet, `${sku.id} light`).sort((a, b) => a.width - b.width))
            === JSON.stringify(stockAssets.map(({ path: assetPath, width }) => ({ path: assetPath, width })).sort((a, b) => a.width - b.width)),
          `runtime light fallback srcSet for ${sku.id} differs from stock manifest assets`,
        );
      } else {
        const darkAssets = product.stock.darkPoster.assets;
        check(darkAssets.some((asset) => asset.path === visual.src), `runtime dark fallback for ${sku.id} is not registered in the manifest`);
        check(!visual.srcSet, `runtime dark fallback for ${sku.id} must not invent an unregistered srcSet`);
      }

      runtimeResolverStates += 1;
    }
  }

  for (const [skuId, registration] of customManifestBySku) {
    const sku = skusById.get(skuId);
    check(Boolean(sku), `manifest custom visual references unknown runtime SKU ${skuId}`);
    if (sku) {
      check(sku.modelId === registration.product.productId, `manifest custom visual ${skuId} is registered under the wrong product`);
      check(sku.visual.assetKey === registration.entry.variant, `manifest custom visual ${skuId} is not reachable through the runtime resolver`);
    }
  }

  for (const registration of stateManifestFamilies) {
    const { product, entry, selectionClass } = registration;
    check(
      entry.stateCriteria && typeof entry.stateCriteria === 'object',
      `manifest state visual ${entry.variant} must declare stateCriteria`,
    );
    check(
      entry.stateCriteria.components && typeof entry.stateCriteria.components === 'object',
      `manifest state visual ${entry.variant} must declare component criteria`,
    );
    check(
      selectionClass in entry.stateCriteria.components,
      `manifest state visual ${entry.variant} must constrain its ${selectionClass} selection`,
    );

    for (const skuId of entry.sourceSkuIds || []) {
      const sku = skusById.get(skuId);
      check(Boolean(sku), `manifest state visual ${entry.variant} references unknown runtime SKU ${skuId}`);
      if (!sku) continue;
      check(sku.modelId === product.productId, `manifest state visual ${entry.variant} is registered under the wrong product`);

      let build = runtime.createDefaultBuild({ modelId: product.productId });
      if (build.skuId !== skuId) build = runtime.selectBuildOption(build, 'fit', skuId);
      for (const [group, optionId] of Object.entries(entry.stateCriteria.components || {})) {
        build = runtime.selectBuildOption(build, 'ride-setup', optionId, group);
      }
      if (entry.stateCriteria.finishId) {
        build = runtime.selectBuildOption(build, 'finish', entry.stateCriteria.finishId);
      }
      for (const accessoryId of entry.stateCriteria.accessories || []) {
        build = runtime.selectBuildOption(build, 'accessories', accessoryId);
      }

      const resolved = runtime.resolveBuild(build);
      for (const theme of ['light', 'dark']) {
        const visual = runtime.configuratorVisual(resolved, theme);
        const themeAssets = entry.assets.filter((asset) => asset.theme === theme);
        const largest = themeAssets.find((asset) => asset.width === 1600);
        check(visual.src === largest?.path, `runtime state src for ${entry.variant} (${theme}) is not the manifest 1600px asset`);
        check(
          JSON.stringify(parseSrcSet(visual.srcSet, `${entry.variant} ${theme}`).sort((a, b) => a.width - b.width))
            === JSON.stringify(themeAssets.map(({ path: assetPath, width }) => ({ path: assetPath, width })).sort((a, b) => a.width - b.width)),
          `runtime state srcSet for ${entry.variant} (${theme}) differs from the manifest assets`,
        );
        runtimeResolverStates += 1;
      }
    }
  }

  for (const matrix of manifest.visualMatrices || []) {
    const inventoryPath = publicAssetPath(path.resolve(REPO_ROOT, manifest.publicRoot || 'apps/web/public'), matrix.inventoryPath, `visualMatrices.${matrix.id}.inventoryPath`);
    const inventory = await loadJson(inventoryPath, `visual matrix ${matrix.id}`);
    for (const variant of inventory.variants || []) {
      let build = runtime.createDefaultBuild({ modelId: matrix.productId });
      if (variant.stateCriteria?.fitWheel) {
        const fitSkuId = (matrix.sourceSkuIds || []).find((skuId) => (
          skusById.get(skuId)?.wheel === variant.stateCriteria.fitWheel
        ));
        check(Boolean(fitSkuId), `visual matrix ${matrix.id} has no source SKU for fit ${variant.stateCriteria.fitWheel}`);
        if (!fitSkuId) continue;
        build = runtime.selectBuildOption(build, 'fit', fitSkuId);
      }
      for (const [group, optionId] of Object.entries(variant.stateCriteria?.components || {})) {
        build = runtime.selectBuildOption(build, 'ride-setup', optionId, group);
      }
      if (variant.stateCriteria?.finishId) {
        build = runtime.selectBuildOption(build, 'finish', variant.stateCriteria.finishId);
      }
      build = runtime.selectBuildOption(
        build,
        'accessories',
        (variant.stateCriteria?.accessories || []).includes('ibc-carrier') ? 'ibc-carrier' : 'none',
      );
      const resolved = runtime.resolveBuild(build);
      const shadowingCustom = !resolved.customizationConfirmationRequired && resolved.sku.visual.assetKey
        ? customManifestBySku.get(resolved.sku.id)
        : null;
      for (const theme of ['light', 'dark']) {
        const visual = runtime.configuratorVisual(resolved, theme);
        if (shadowingCustom) {
          const stockAssets = shadowingCustom.entry.assets.filter((asset) => asset.theme === theme);
          const stockLargest = stockAssets.find((asset) => asset.width === 1600);
          check(
            visual.src === stockLargest?.path,
            `runtime catalog state for ${variant.variant} (${theme}) must keep the governed stock poster`,
          );
          runtimeResolverStates += 1;
          catalogShadowedMatrixStates += 1;
          continue;
        }
        const themeAssets = variant.assets.filter((asset) => asset.theme === theme);
        const largest = themeAssets.find((asset) => asset.width === 1600);
        check(visual.src === largest?.path, `runtime matrix state src for ${variant.variant} (${theme}) is not the matrix 1600px asset`);
        check(
          JSON.stringify(parseSrcSet(visual.srcSet, `${variant.variant} ${theme}`).sort((a, b) => a.width - b.width))
            === JSON.stringify(themeAssets.map(({ path: assetPath, width }) => ({ path: assetPath, width })).sort((a, b) => a.width - b.width)),
          `runtime matrix state srcSet for ${variant.variant} (${theme}) differs from matrix assets`,
        );
        runtimeResolverStates += 1;
        matrixRuntimeResolverStates += 1;
      }
    }
  }
}

async function main() {
  const manifestPath = path.resolve(process.argv[2] || DEFAULT_MANIFEST);
  const manifest = await loadJson(manifestPath, 'configurator manifest');
  const publicRoot = path.resolve(REPO_ROOT, manifest.publicRoot || 'apps/web/public');
  const customEntries = [];

  check(manifest.schemaVersion === 1, 'schemaVersion must be 1');
  check(manifest.contractVersion === '2.0.0', 'contractVersion must be 2.0.0');
  check(manifest.fallbackPolicy === 'stock-only-with-explicit-missing-reason', 'fallbackPolicy must remain stock-only');
  check(manifest.canonical?.canvas?.width === 3072, 'canonical canvas width must be 3072');
  check(manifest.canonical?.canvas?.height === 2048, 'canonical canvas height must be 2048');
  check(manifest.canonical?.canvas?.aspectRatio === '3:2', 'canonical aspect ratio must be 3:2');
  check(manifest.canonical?.view === 'side-r', 'canonical view must be side-r');
  check(manifest.pixelValidation?.decoder === 'Pillow', 'pixelValidation.decoder must be Pillow');
  check(manifest.pixelValidation?.alphaSubjectThreshold === 32, 'pixelValidation.alphaSubjectThreshold must be 32');
  check(
    sameSet(manifest.canonical?.requiredResponsiveWidths || [], REQUIRED_WIDTHS),
    `required responsive widths must be ${REQUIRED_WIDTHS.join(', ')}`,
  );
  check(
    sameSet(manifest.requiredSelectionClasses || [], REQUIRED_SELECTION_CLASSES),
    `required selection classes must be ${REQUIRED_SELECTION_CLASSES.join(', ')}`,
  );

  const productIds = (manifest.products || []).map((product) => product.productId);
  check(productIds.length === new Set(productIds).size, 'product IDs must be unique');
  check(
    sameSet(productIds, EXPECTED_PRODUCTS),
    `manifest products must be exactly: ${EXPECTED_PRODUCTS.join(', ')}`,
  );

  const provenanceByCatalog = new Map();
  for (const [catalogId, catalog] of Object.entries(manifest.provenanceCatalogs || {})) {
    const catalogPath = publicAssetPath(publicRoot, catalog.path, `provenanceCatalogs.${catalogId}.path`);
    try {
      const payload = await loadJson(catalogPath, `provenance catalog ${catalogId}`);
      provenanceByCatalog.set(
        catalogId,
        new Map((payload.assets || []).map((record) => [record.output, record])),
      );
    } catch (error) {
      errors.push(error.message);
    }
  }

  for (const [index, shared] of (manifest.sharedAssets || []).entries()) {
    const label = `sharedAssets[${index}]`;
    check(shared.status === 'available', `${label}.status must be available`);
    await validateAsset(publicRoot, shared, label);
  }

  const matrixIds = new Set();
  for (const [matrixIndex, matrix] of (manifest.visualMatrices || []).entries()) {
    const matrixLabel = `visualMatrices[${matrixIndex}]`;
    check(typeof matrix.id === 'string' && matrix.id.length > 0, `${matrixLabel}.id is required`);
    check(!matrixIds.has(matrix.id), `${matrixLabel}.id must be unique`);
    matrixIds.add(matrix.id);
    check(EXPECTED_PRODUCTS.includes(matrix.productId), `${matrixLabel}.productId must reference a known product`);
    check(matrix.status === 'available', `${matrixLabel}.status must be available`);
    check(matrix.canvasConformance === 'canonical', `${matrixLabel}.canvasConformance must be canonical`);
    check(Array.isArray(matrix.sourceSkuIds) && matrix.sourceSkuIds.length > 0, `${matrixLabel}.sourceSkuIds is required`);
    check(sameSet(matrix.dimensions?.themes || [], ['light', 'dark']), `${matrixLabel}.dimensions.themes must be light and dark`);
    check(sameSet(matrix.dimensions?.widths || [], REQUIRED_WIDTHS), `${matrixLabel}.dimensions.widths must be ${REQUIRED_WIDTHS.join(', ')}`);
    try {
      await readFile(path.resolve(REPO_ROOT, matrix.generationRecord || ''));
    } catch (error) {
      errors.push(`${matrixLabel}.generationRecord: ${error.message}`);
    }

    const inventoryPath = publicAssetPath(publicRoot, matrix.inventoryPath, `${matrixLabel}.inventoryPath`);
    const inventory = await loadJson(inventoryPath, `visual matrix inventory ${matrix.id}`);
    check(inventory.id === matrix.id, `${matrixLabel}.inventory.id must match matrix id`);
    check(inventory.productId === matrix.productId, `${matrixLabel}.inventory.productId must match matrix productId`);

    const expectedVariantCount = Object.entries({
      ...(matrix.dimensions?.fit ? { fit: matrix.dimensions.fit } : {}),
      brakes: matrix.dimensions?.brakes,
      fork: matrix.dimensions?.fork,
      drivetrain: matrix.dimensions?.drivetrain,
      finish: matrix.dimensions?.finish,
      accessories: matrix.dimensions?.accessories,
    }).reduce((count, [dimension, values]) => {
      check(Array.isArray(values) && values.length > 0, `${matrixLabel}.dimensions.${dimension} must be non-empty`);
      return count * (Array.isArray(values) ? values.length : 0);
    }, 1);
    check((inventory.variants || []).length === expectedVariantCount, `${matrixLabel} must contain ${expectedVariantCount} variants`);

    const seenVariants = new Set();
    const seenStates = new Set();
    for (const [variantIndex, variant] of (inventory.variants || []).entries()) {
      const variantLabel = `${matrixLabel}.variants[${variantIndex}]`;
      check(typeof variant.variant === 'string' && variant.variant.length > 0, `${variantLabel}.variant is required`);
      check(!seenVariants.has(variant.variant), `${variantLabel}.variant must be unique`);
      seenVariants.add(variant.variant);
      check(variant.stateCriteria?.components, `${variantLabel}.stateCriteria.components is required`);
      if (matrix.dimensions.fit) {
        check(matrix.dimensions.fit.includes(variant.stateCriteria?.fitWheel), `${variantLabel}.stateCriteria.fitWheel is outside matrix dimensions`);
      } else {
        check(!variant.stateCriteria?.fitWheel, `${variantLabel}.stateCriteria.fitWheel is not declared by matrix dimensions`);
      }
      check(matrix.dimensions.brakes.includes(variant.stateCriteria?.components?.brakes), `${variantLabel}.stateCriteria.components.brakes is outside matrix dimensions`);
      check(matrix.dimensions.fork.includes(variant.stateCriteria?.components?.fork), `${variantLabel}.stateCriteria.components.fork is outside matrix dimensions`);
      check(matrix.dimensions.drivetrain.includes(variant.stateCriteria?.components?.drivetrain), `${variantLabel}.stateCriteria.components.drivetrain is outside matrix dimensions`);
      check(matrix.dimensions.finish.includes(variant.stateCriteria?.finishId), `${variantLabel}.stateCriteria.finishId is outside matrix dimensions`);
      const accessoryId = (variant.stateCriteria?.accessories || []).includes('ibc-carrier') ? 'ibc-carrier' : 'none';
      check(matrix.dimensions.accessories.includes(accessoryId), `${variantLabel}.stateCriteria.accessories is outside matrix dimensions`);
      const stateKey = JSON.stringify({
        fitWheel: variant.stateCriteria?.fitWheel || null,
        components: variant.stateCriteria?.components || {},
        finishId: variant.stateCriteria?.finishId || null,
        accessories: [...(variant.stateCriteria?.accessories || [])].sort(),
      });
      check(!seenStates.has(stateKey), `${variantLabel}.stateCriteria must be unique within the matrix`);
      seenStates.add(stateKey);
      check(
        sameSet((variant.assets || []).map((asset) => `${asset.theme}:${asset.width}`), ['light:480', 'light:960', 'light:1600', 'dark:480', 'dark:960', 'dark:1600']),
        `${variantLabel}.assets must contain light/dark assets at each required width`,
      );

      const assetRecords = [];
      for (const [assetIndex, asset] of (variant.assets || []).entries()) {
        const assetLabel = `${variantLabel}.assets[${assetIndex}]`;
        check(['light', 'dark'].includes(asset.theme), `${assetLabel}.theme must be light or dark`);
        const result = await validateAsset(publicRoot, asset, assetLabel);
        check(asset.alphaMode === 'transparent', `${assetLabel}.alphaMode must be transparent`);
        check(/^[A-F0-9]{64}$/.test(asset.sha256 || ''), `${assetLabel}.sha256 is required as uppercase SHA-256`);
        if (result) {
          check(sha256(result.buffer) === asset.sha256, `${assetLabel} SHA-256 differs from inventory`);
          assetRecords.push({ ...result, asset, assetLabel });
        }
      }
      matrixVisualFamilies += 1;
      matrixResponsiveAssets += (variant.assets || []).length;
      customEntries.push({
        product: { productId: matrix.productId },
        selectionClass: 'matrix',
        entry: {
          variant: variant.variant,
          assets: variant.assets,
          canvasConformance: matrix.canvasConformance,
        },
        label: variantLabel,
        assetRecords,
      });
    }
  }

  check(
    matrixIds.size === EXHAUSTIVE_VISUAL_CONTRACT.matrices,
    `visualMatrices must contain exactly ${EXHAUSTIVE_VISUAL_CONTRACT.matrices} exhaustive product matrices`,
  );
  check(
    sameSet((manifest.visualMatrices || []).map((matrix) => matrix.productId), EXPECTED_PRODUCTS),
    'visualMatrices must cover every product exactly once',
  );
  check(
    matrixVisualFamilies === EXHAUSTIVE_VISUAL_CONTRACT.selectableStates,
    `visual matrices must contain exactly ${EXHAUSTIVE_VISUAL_CONTRACT.selectableStates} selectable states`,
  );
  check(
    matrixResponsiveAssets === EXHAUSTIVE_VISUAL_CONTRACT.responsiveAssets,
    `visual matrices must contain exactly ${EXHAUSTIVE_VISUAL_CONTRACT.responsiveAssets} responsive theme assets`,
  );

  for (const product of manifest.products || []) {
    const productLabel = `products.${product.productId}`;
    check(typeof product.sourceAlias === 'string' && product.sourceAlias.length > 0, `${productLabel}.sourceAlias is required`);

    const light = product.stock?.light;
    check(light?.status === 'available', `${productLabel}.stock.light must be available`);
    check(light?.authorityTier === 'A', `${productLabel}.stock.light must be Tier A`);
    check(light?.canvasConformance === 'legacy-stock', `${productLabel}.stock.light must disclose legacy-stock canvas`);
    check(
      sameSet((light?.assets || []).map((asset) => asset.width), REQUIRED_WIDTHS),
      `${productLabel}.stock.light must contain 480, 960, and 1600 widths`,
    );

    const provenance = provenanceByCatalog.get(light?.provenanceCatalog);
    check(Boolean(provenance), `${productLabel}.stock.light references an unknown provenance catalog`);

    for (const [assetIndex, asset] of (light?.assets || []).entries()) {
      const label = `${productLabel}.stock.light.assets[${assetIndex}]`;
      const result = await validateAsset(publicRoot, asset, label);
      const outputKey = String(asset.path).replace(/^\//, '');
      const record = provenance?.get(outputKey);
      check(Boolean(record), `${label} is missing from governed provenance`);
      if (result && record) {
        check(record.width === asset.width, `${label} provenance width mismatch`);
        check(record.height === asset.height, `${label} provenance height mismatch`);
        check(sha256(result.buffer) === record.output_sha256, `${label} SHA-256 differs from governed provenance`);
        verifiedTierAAssets += 1;
      }
    }

    const light1600 = (light?.assets || []).find((asset) => asset.width === 1600)?.path;
    for (const lane of ['darkCutout', 'darkPoster']) {
      const stockLane = product.stock?.[lane];
      const label = `${productLabel}.stock.${lane}`;
      check(stockLane?.status === 'available', `${label} must be available`);
      check(stockLane?.authorityTier === 'provisional', `${label} must remain provisional until provenance is complete`);
      check(stockLane?.provenanceStatus === 'pending-output-catalog', `${label} must disclose pending output provenance`);
      for (const [assetIndex, asset] of (stockLane?.assets || []).entries()) {
        await validateAsset(publicRoot, asset, `${label}.assets[${assetIndex}]`);
      }
    }
    check(
      product.stock?.darkCutout?.sourceAsset === light1600,
      `${productLabel}.stock.darkCutout.sourceAsset must be the registered 1600px light stock asset`,
    );

    const selectionKeys = Object.keys(product.selectionDependent || {});
    check(
      sameSet(selectionKeys, REQUIRED_SELECTION_CLASSES),
      `${productLabel}.selectionDependent must declare every required selection class`,
    );
    for (const selectionClass of REQUIRED_SELECTION_CLASSES) {
      const entry = product.selectionDependent?.[selectionClass];
      const label = `${productLabel}.selectionDependent.${selectionClass}`;
      check(['missing', 'partial', 'available'].includes(entry?.status), `${label}.status must be missing, partial, or available`);
      check(Array.isArray(entry?.assets) || Array.isArray(entry?.families) || typeof entry?.matrixId === 'string', `${label} must declare assets, visual families, or a visual matrix`);
      check(!Object.hasOwn(entry || {}, 'path'), `${label} must not contain a single speculative path`);
      if (entry?.status === 'missing') {
        check(Array.isArray(entry.assets) && entry.assets.length === 0, `${label}.assets must be empty while status is missing`);
        check(!Array.isArray(entry.families) || entry.families.length === 0, `${label}.families must be empty while status is missing`);
        missingSelectionClasses += 1;
      } else if (entry?.matrixId) {
        check(matrixIds.has(entry.matrixId), `${label}.matrixId references an unknown visual matrix`);
        check(Array.isArray(entry.assets) && entry.assets.length === 0, `${label}.assets must be empty when delegated to a visual matrix`);
        check(!Array.isArray(entry.families) || entry.families.length === 0, `${label}.families must be empty when delegated to a visual matrix`);
        for (const [familyIndex, family] of (entry.stockFamilies || []).entries()) {
          const familyLabel = `${label}.stockFamilies[${familyIndex}]`;
          check(typeof family.variant === 'string' && family.variant.length > 0, `${familyLabel}.variant is required`);
          check(typeof family.generationRecord === 'string' && family.generationRecord.length > 0, `${familyLabel}.generationRecord is required`);
          check(Array.isArray(family.assets) && family.assets.length > 0, `${familyLabel}.assets must contain approved derivatives`);
          for (const [assetIndex, asset] of (family.assets || []).entries()) {
            const assetLabel = `${familyLabel}.assets[${assetIndex}]`;
            const result = await validateAsset(publicRoot, asset, assetLabel);
            if (result && asset.sha256) {
              check(sha256(result.buffer) === asset.sha256, `${assetLabel} SHA-256 differs from its governed registration`);
            }
            stockFamilyAssetsChecked += 1;
          }
        }
      } else {
        const families = visualFamilies(entry);
        check(families.length > 0, `${label}.families must contain approved visual families`);
        for (const [familyIndex, family] of families.entries()) {
          const familyLabel = Array.isArray(entry.families)
            ? `${label}.families[${familyIndex}]`
            : label;
          check(Array.isArray(family.assets) && family.assets.length > 0, `${familyLabel}.assets must contain approved derivatives`);
          check(typeof family.variant === 'string' && family.variant.length > 0, `${familyLabel}.variant is required`);
          check(typeof family.generationRecord === 'string' && family.generationRecord.length > 0, `${familyLabel}.generationRecord is required`);
          check(
            ['canonical', 'reviewed-pilot-noncanonical'].includes(family.canvasConformance),
            `${familyLabel}.canvasConformance must disclose canonical or reviewed-pilot-noncanonical`,
          );
          const generationRecordPath = path.resolve(REPO_ROOT, family.generationRecord || '');
          check(
            generationRecordPath.startsWith(`${REPO_ROOT}${path.sep}`),
            `${familyLabel}.generationRecord must resolve inside the repository`,
          );
          try {
            await readFile(generationRecordPath);
          } catch (error) {
            errors.push(`${familyLabel}.generationRecord: ${error.message}`);
          }
          const assetRecords = [];
          for (const [assetIndex, asset] of family.assets.entries()) {
            const assetLabel = `${familyLabel}.assets[${assetIndex}]`;
            check(['light', 'dark'].includes(asset.theme), `${assetLabel}.theme must be light or dark`);
            const result = await validateAsset(publicRoot, asset, assetLabel);
            check(/^[A-F0-9]{64}$/.test(asset.sha256 || ''), `${assetLabel}.sha256 is required as uppercase SHA-256`);
            if (result) {
              check(sha256(result.buffer) === asset.sha256, `${assetLabel} SHA-256 differs from manifest`);
              assetRecords.push({ ...result, asset, assetLabel });
            }
          }
          customEntries.push({ product, selectionClass, entry: family, label: familyLabel, assetRecords });
        }
      }
    }
  }

  validateCustomPixelFamilies(customEntries, manifest);
  await validateRuntimeResolver(manifest);

  check(missingSelectionClasses === 0, 'no selectable class may remain missing in the exhaustive configurator');
  check(
    catalogShadowedMatrixStates === EXPECTED_SKU_COUNT * 2,
    `exactly ${EXPECTED_SKU_COUNT * 2} themed catalog states must keep their governed stock posters`,
  );
  check(
    stockFamilyAssetsChecked === EXPECTED_SKU_COUNT * 6,
    `exactly ${EXPECTED_SKU_COUNT * 6} governed stock poster assets must be registered and verified`,
  );
  check(
    matrixRuntimeResolverStates + catalogShadowedMatrixStates === EXHAUSTIVE_VISUAL_CONTRACT.themedStates,
    `runtime resolver plus stock-shadowed catalog states must cover exactly ${EXHAUSTIVE_VISUAL_CONTRACT.themedStates} themed matrix states`,
  );

  if (errors.length > 0) {
    console.error(`Configurator asset validation FAILED (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log('Configurator asset validation PASSED');
  console.log(`- products: ${EXPECTED_PRODUCTS.length}`);
  console.log(`- existing assets checked: ${checkedAssets}`);
  console.log(`- Tier A assets verified against SHA-256 provenance: ${verifiedTierAAssets}`);
  console.log(`- explicit missing selection classes: ${missingSelectionClasses}`);
  console.log(`- runtime resolver states matched to manifest: ${runtimeResolverStates}`);
  console.log(`- exhaustive themed matrix states matched by runtime: ${matrixRuntimeResolverStates}`);
  console.log(`- themed catalog states keeping governed stock posters: ${catalogShadowedMatrixStates}`);
  console.log(`- governed stock poster assets verified: ${stockFamilyAssetsChecked}`);
  console.log(`- exhaustive selectable matrix states: ${matrixVisualFamilies}`);
  console.log(`- exhaustive responsive theme assets: ${matrixResponsiveAssets}`);
  console.log(`- custom visual families pixel-checked: ${customVisualFamilies}`);
  console.log(`- custom assets with hash-bound pixel metrics: ${hashBoundPixelMetricAssets}`);
  console.log(`- disclosed non-canonical pilot families: ${nonCanonicalVisualFamilies}`);
}

main().catch((error) => {
  console.error(`Configurator asset validation FAILED: ${error.message}`);
  process.exitCode = 1;
});

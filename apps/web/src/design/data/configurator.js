/**
 * Finspeed Build Your Ride domain model.
 *
 * The configurator keeps build choices aligned with the products Finspeed can
 * sell and support today. The data is versioned so saved builds remain stable.
 */

import { AVAILABLE_CONFIGURATOR_MATRIX_IDS } from './configurator-matrix-availability.js';

export const CONFIGURATOR_SCHEMA_VERSION = 3;

export const CONFIGURATOR_STEPS = Object.freeze([
  { id: 'ride-type', label: 'Ride type', shortLabel: 'Ride', eyebrow: 'How do you ride?' },
  { id: 'model', label: 'Choose bicycle', shortLabel: 'Bicycle', eyebrow: 'Choose your bicycle' },
  { id: 'fit', label: 'Fit & wheels', shortLabel: 'Fit', eyebrow: 'Choose your fit' },
  { id: 'ride-setup', label: 'Ride setup', shortLabel: 'Setup', eyebrow: 'Choose your components' },
  { id: 'finish', label: 'Finish', shortLabel: 'Finish', eyebrow: 'Choose your finish' },
  { id: 'accessories', label: 'Add-ons', shortLabel: 'Extras', eyebrow: 'Choose your equipment' },
  { id: 'review', label: 'Review', shortLabel: 'Review', eyebrow: 'Review your build' },
]);

export const CONFIGURATOR_AUTHORITY = Object.freeze({
  catalog: 'finspeed-catalog-2024-25',
  pricing: 'finspeed-distributor-consolidated-pricing-2024-25',
  assets: 'WEB-031-verified-product-assets',
  storefront: 'current-storefront-provisional',
  needsValidation: 'needs-product-validation',
});

const RIDE_TYPES = Object.freeze([
  {
    id: 'mountain',
    label: 'Mountain',
    copy: 'Broad tyres and confident geometry for trails, rough roads, and mixed terrain.',
  },
  {
    id: 'city',
    label: 'City',
    copy: 'Straightforward everyday bicycles for commutes, errands, and familiar roads.',
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    copy: 'Fast 700C bicycles that combine road efficiency with everyday control.',
  },
]);

const CATALOG_FINISH = Object.freeze({
  id: 'catalog-finish',
  label: 'Catalog finish',
  copy: 'The finish shown for this model.',
  status: 'included',
  authority: CONFIGURATOR_AUTHORITY.assets,
});

const FINISH_OPTIONS = Object.freeze([
  CATALOG_FINISH,
  {
    id: 'graphite-request',
    label: 'Graphite',
    copy: 'A deep charcoal colour request. Final tone and availability are confirmed before order.',
    status: 'custom-request',
    swatch: '#34383a',
  },
  {
    id: 'deep-blue-request',
    label: 'Deep blue',
    copy: 'A rich blue colour request. Final tone and availability are confirmed before order.',
    status: 'custom-request',
    swatch: '#244b69',
  },
  {
    id: 'signal-red-request',
    label: 'Signal red',
    copy: 'A confident red colour request. Final tone and availability are confirmed before order.',
    status: 'custom-request',
    swatch: '#a42c2f',
  },
  {
    id: 'pearl-silver-request',
    label: 'Pearl silver',
    copy: 'A light metallic colour request. Final tone and availability are confirmed before order.',
    status: 'custom-request',
    swatch: '#bfc0bc',
  },
]);

const COMPONENT_OPTIONS = Object.freeze({
  brakes: Object.freeze([
    {
      id: 'power-brake',
      label: 'Power brake',
      copy: 'Simple, direct braking for everyday streets and familiar routes.',
    },
    {
      id: 'disc-brake',
      label: 'Disc brakes',
      copy: 'Consistent stopping control for faster riding, rough roads and changing conditions.',
    },
  ]),
  fork: Object.freeze([
    {
      id: 'rigid-fork',
      label: 'Rigid fork',
      copy: 'A lighter, direct feel for smoother roads and efficient everyday riding.',
    },
    {
      id: 'front-suspension',
      label: 'Front suspension',
      copy: 'Extra comfort and control when the road gets broken or the trail turns rough.',
    },
  ]),
  drivetrain: Object.freeze([
    {
      id: 'single-speed',
      label: 'Single speed',
      copy: 'Low-maintenance simplicity for flatter routes and easy daily use.',
    },
    {
      id: '21-speed',
      label: '21-speed (3 × 7)',
      copy: 'A wider gear range for climbs, longer rides and changes in pace.',
    },
  ]),
});

const COMPONENT_GROUP_LABELS = Object.freeze({
  brakes: 'Brakes',
  fork: 'Fork',
  drivetrain: 'Gears',
});

const FINISH_BY_ID = new Map(FINISH_OPTIONS.map((item) => [item.id, item]));
const COMPONENT_BY_GROUP_AND_ID = Object.fromEntries(
  Object.entries(COMPONENT_OPTIONS).map(([group, items]) => [
    group,
    new Map(items.map((item) => [item.id, item])),
  ]),
);
const BUILD_VISUAL_MATRIX_BY_MODEL_ID = Object.freeze({
  'mako-shark': Object.freeze({
    id: 'mako-exhaustive-r01',
    status: 'available',
    assetPrefix: 'mako',
    skuIds: Object.freeze(['mako-shark-27-5-geared']),
    fitTokens: null,
    fidelity: 'approved-assisted-full-build-preview',
  }),
  'shark-blue': Object.freeze({
    id: 'shark-blue-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'shark-blue',
    skuIds: Object.freeze(['shark-blue-26-geared']),
    fitTokens: null,
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  'bull-shark': Object.freeze({
    id: 'bull-shark-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'bull-shark',
    skuIds: Object.freeze(['bull-shark-29']),
    fitTokens: null,
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  'lemon-shark': Object.freeze({
    id: 'lemon-shark-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'lemon-shark',
    skuIds: Object.freeze(['lemon-shark-27-5']),
    fitTokens: null,
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  'tiger-shark': Object.freeze({
    id: 'tiger-shark-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'tiger-shark',
    skuIds: Object.freeze(['tiger-shark-24', 'tiger-shark-26']),
    fitTokens: Object.freeze({ '24-inch': '24', '26-inch': '26' }),
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  'red-snapper': Object.freeze({
    id: 'red-snapper-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'red-snapper',
    skuIds: Object.freeze([
      'red-snapper-24-non-ibc',
      'red-snapper-24-ibc',
      'red-snapper-26-non-ibc',
      'red-snapper-26-ibc',
    ]),
    fitTokens: Object.freeze({ '24-inch': '24', '26-inch': '26' }),
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  'sea-breeze': Object.freeze({
    id: 'sea-breeze-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'sea-breeze',
    skuIds: Object.freeze([
      'sea-breeze-24-non-ibc',
      'sea-breeze-24-ibc',
      'sea-breeze-26-non-ibc',
      'sea-breeze-26-ibc',
    ]),
    fitTokens: Object.freeze({ '24-inch': '24', '26-inch': '26' }),
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  hammerhead: Object.freeze({
    id: 'hammerhead-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'hammerhead',
    skuIds: Object.freeze(['hammerhead-24']),
    fitTokens: null,
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  'great-white-shark': Object.freeze({
    id: 'great-white-shark-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'great-white-shark',
    skuIds: Object.freeze(['great-white-shark-26']),
    fitTokens: null,
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  'lightning-marlin': Object.freeze({
    id: 'lightning-marlin-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'lightning-marlin',
    skuIds: Object.freeze(['lightning-marlin-700c']),
    fitTokens: null,
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
  'sunset-marlin': Object.freeze({
    id: 'sunset-marlin-exhaustive-r01',
    status: 'planned',
    assetPrefix: 'sunset-marlin',
    skuIds: Object.freeze(['sunset-marlin-700c-geared']),
    fitTokens: null,
    fidelity: 'ai-assisted-full-build-preview-product-owner-review-required',
  }),
});

export function hasFullBuildVisualMatrix(modelId) {
  const matrixId = BUILD_VISUAL_MATRIX_BY_MODEL_ID[modelId]?.id;
  return Boolean(matrixId && AVAILABLE_CONFIGURATOR_MATRIX_IDS.includes(matrixId));
}

const SETUPS = Object.freeze({
  urbanPower: {
    brakes: { id: 'power-brake', label: 'Power brake', status: 'included' },
    fork: { id: 'rigid-fork', label: 'Rigid fork', status: 'included' },
    drivetrain: { id: 'single-speed', label: 'Single speed', status: 'included' },
  },
  streetSingle: {
    brakes: { id: 'power-brake', label: 'Power brake', status: 'provisional' },
    fork: { id: 'rigid-fork', label: 'Rigid fork', status: 'included' },
    drivetrain: { id: 'single-speed', label: 'Single speed', status: 'included' },
  },
  trailSingle: {
    brakes: { id: 'disc-brake', label: 'Disc brakes', status: 'included' },
    fork: { id: 'front-suspension', label: 'Front suspension', status: 'included' },
    drivetrain: { id: 'single-speed', label: 'Single speed', status: 'included' },
  },
  bigWheelSingle: {
    brakes: { id: 'disc-brake', label: 'Disc brakes', status: 'included' },
    fork: { id: 'rigid-fork', label: 'Rigid fork', status: 'provisional' },
    drivetrain: { id: 'single-speed', label: 'Single speed', status: 'included' },
  },
  bullCurrent: {
    brakes: { id: 'disc-brake', label: 'Disc brakes', status: 'included' },
    fork: { id: 'front-suspension', label: 'Front suspension', status: 'provisional' },
    drivetrain: { id: '21-speed', label: '21-speed (3 x 7)', status: 'provisional' },
  },
  hybridSingle: {
    brakes: { id: 'disc-brake', label: 'Disc brakes', status: 'provisional' },
    fork: { id: 'front-suspension', label: 'Front suspension', status: 'included' },
    drivetrain: { id: 'single-speed', label: 'Single speed', status: 'included' },
  },
  hybridGeared: {
    brakes: { id: 'disc-brake', label: 'Disc brakes', status: 'provisional' },
    fork: { id: 'rigid-fork', label: 'Rigid fork', status: 'included' },
    drivetrain: { id: '21-speed', label: '21-speed (3 x 7)', status: 'included' },
  },
  gearedElite: {
    brakes: { id: 'disc-brake', label: 'Disc brakes', status: 'included' },
    fork: { id: 'front-suspension', label: 'Front suspension', status: 'included' },
    drivetrain: { id: '21-speed', label: '21-speed (3 x 7)', status: 'included' },
  },
});

function model({
  id,
  name,
  rideType,
  series,
  copy,
  defaultSkuId,
  setup,
  validationStatus = 'catalog-audited',
  validationNote = '',
}) {
  return {
    id,
    name,
    rideType,
    series,
    copy,
    defaultSkuId,
    setup,
    finish: CATALOG_FINISH,
    authority: {
      identity: CONFIGURATOR_AUTHORITY.catalog,
      image: CONFIGURATOR_AUTHORITY.assets,
      status: validationStatus,
      note: validationNote,
    },
  };
}

const MODELS = Object.freeze([
  model({
    id: 'mako-shark',
    name: 'Mako Shark',
    rideType: 'mountain',
    series: 'Geared Elite',
    copy: 'A confident trail bike with front suspension, disc brakes and 21 gears.',
    defaultSkuId: 'mako-shark-27-5-geared',
    setup: SETUPS.gearedElite,
  }),
  model({
    id: 'shark-blue',
    name: 'Shark Blue',
    rideType: 'mountain',
    series: 'Geared Elite',
    copy: 'A versatile 26-inch bike for rough roads and weekend trails.',
    defaultSkuId: 'shark-blue-26-geared',
    setup: SETUPS.gearedElite,
  }),
  model({
    id: 'bull-shark',
    name: 'Bull Shark',
    rideType: 'mountain',
    series: 'Big Wheel',
    copy: 'A big-wheel bike for rough trails, broken roads and steady control.',
    defaultSkuId: 'bull-shark-29',
    setup: SETUPS.bullCurrent,
    validationStatus: 'provisional-specification',
    validationNote: 'Contact us to confirm the exact gear setup before ordering.',
  }),
  model({
    id: 'lemon-shark',
    name: 'Lemon Shark',
    rideType: 'mountain',
    series: 'Big Wheel',
    copy: 'A nimble 27.5-inch bike with wide tyres for confident grip.',
    defaultSkuId: 'lemon-shark-27-5',
    setup: SETUPS.bigWheelSingle,
    validationStatus: 'provisional-specification',
    validationNote: 'Contact us to confirm the fork setup before ordering.',
  }),
  model({
    id: 'tiger-shark',
    name: 'Tiger Shark',
    rideType: 'mountain',
    series: 'Tiger',
    copy: 'A capable trail bike with wide tyres, front suspension and disc brakes.',
    defaultSkuId: 'tiger-shark-26',
    setup: SETUPS.trailSingle,
  }),
  model({
    id: 'red-snapper',
    name: 'Red Snapper',
    rideType: 'city',
    series: 'Urban',
    copy: 'An easy city bike for daily commutes, errands and familiar roads.',
    defaultSkuId: 'red-snapper-24-non-ibc',
    setup: SETUPS.urbanPower,
  }),
  model({
    id: 'sea-breeze',
    name: 'Sea Breeze',
    rideType: 'city',
    series: 'Urban',
    copy: 'A comfortable step-through city bike for everyday errands.',
    defaultSkuId: 'sea-breeze-24-non-ibc',
    setup: SETUPS.urbanPower,
    validationStatus: 'provisional-specification',
    validationNote: 'Contact us to confirm the exact brake setup before ordering.',
  }),
  model({
    id: 'hammerhead',
    name: 'Hammerhead',
    rideType: 'city',
    series: 'Street',
    copy: 'A tough, simple city bike for everyday movement.',
    defaultSkuId: 'hammerhead-24',
    setup: SETUPS.streetSingle,
    validationStatus: 'provisional-specification',
    validationNote: 'Contact us to confirm the exact brake setup before ordering.',
  }),
  model({
    id: 'great-white-shark',
    name: 'Great White Shark',
    rideType: 'city',
    series: 'Street',
    copy: 'A strong city bike with wide tyres for a planted feel.',
    defaultSkuId: 'great-white-shark-26',
    setup: SETUPS.streetSingle,
    validationStatus: 'provisional-specification',
    validationNote: 'Contact us to confirm the exact brake setup before ordering.',
  }),
  model({
    id: 'lightning-marlin',
    name: 'Lightning Marlin',
    rideType: 'hybrid',
    series: 'Hybrid',
    copy: 'A quick 700C bike for smooth roads, rough patches and daily rides.',
    defaultSkuId: 'lightning-marlin-700c',
    setup: SETUPS.hybridSingle,
    validationStatus: 'provisional-specification',
    validationNote: 'Contact us to confirm the exact brake setup before ordering.',
  }),
  model({
    id: 'sunset-marlin',
    name: 'Sunset Marlin',
    rideType: 'hybrid',
    series: 'Hybrid',
    copy: 'A faster 700C bike with 21 gears for longer city rides.',
    defaultSkuId: 'sunset-marlin-700c-geared',
    setup: SETUPS.hybridGeared,
    validationStatus: 'provisional-specification',
    validationNote: 'Contact us to confirm the exact brake setup before ordering.',
  }),
]);

function sku({
  id,
  modelId,
  wheel,
  variantLabel,
  retailPrice,
  carrier = false,
  rim = null,
  visualMatch = 'model-exact',
  visualNote = '',
  visualAssetKey = null,
}) {
  return {
    id,
    modelId,
    wheel,
    variantLabel,
    retailPrice,
    carrier,
    rim,
    authority: {
      variant: CONFIGURATOR_AUTHORITY.pricing,
      price: CONFIGURATOR_AUTHORITY.pricing,
      status: 'catalog-audited-provisional',
    },
    visual: {
      match: visualMatch,
      note: visualNote,
      assetKey: visualAssetKey,
    },
  };
}

const SKUS = Object.freeze([
  sku({ id: 'red-snapper-24-non-ibc', modelId: 'red-snapper', wheel: '24-inch', variantLabel: '24-inch, non-IBC', retailPrice: 4800, visualMatch: 'model-exact', visualNote: 'Canonical deterministic derivative of the verified 24-inch non-IBC Red Snapper product photograph.', visualAssetKey: 'red-snapper-24-non-ibc' }),
  sku({ id: 'red-snapper-24-ibc', modelId: 'red-snapper', wheel: '24-inch', variantLabel: '24-inch, IBC carrier', retailPrice: 5000, carrier: true, visualMatch: 'ai-assisted-catalog-variant', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'red-snapper-24-ibc' }),
  sku({ id: 'red-snapper-26-non-ibc', modelId: 'red-snapper', wheel: '26-inch', variantLabel: '26-inch, non-IBC', retailPrice: 5000, visualMatch: 'ai-assisted-catalog-variant', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'red-snapper-26-non-ibc' }),
  sku({ id: 'red-snapper-26-ibc', modelId: 'red-snapper', wheel: '26-inch', variantLabel: '26-inch, IBC carrier', retailPrice: 5500, carrier: true, visualMatch: 'ai-assisted-catalog-variant', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'red-snapper-26-ibc' }),

  sku({ id: 'sea-breeze-24-non-ibc', modelId: 'sea-breeze', wheel: '24-inch', variantLabel: '24-inch, non-IBC', retailPrice: 4800, visualMatch: 'ai-assisted-catalog-variant', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'sea-breeze-24-non-ibc' }),
  sku({ id: 'sea-breeze-24-ibc', modelId: 'sea-breeze', wheel: '24-inch', variantLabel: '24-inch, IBC carrier', retailPrice: 5000, carrier: true, visualMatch: 'carrier-state-exact-wheel-reference', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'sea-breeze-24-ibc' }),
  sku({ id: 'sea-breeze-26-non-ibc', modelId: 'sea-breeze', wheel: '26-inch', variantLabel: '26-inch, non-IBC', retailPrice: 5000, visualMatch: 'ai-assisted-catalog-variant', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'sea-breeze-26-non-ibc' }),
  sku({ id: 'sea-breeze-26-ibc', modelId: 'sea-breeze', wheel: '26-inch', variantLabel: '26-inch, IBC carrier', retailPrice: 5500, carrier: true, visualMatch: 'ai-assisted-catalog-variant', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'sea-breeze-26-ibc' }),

  sku({ id: 'hammerhead-24', modelId: 'hammerhead', wheel: '24-inch', variantLabel: '24-inch', retailPrice: 6000, rim: 'Steel rim', visualAssetKey: 'hammerhead-24' }),
  sku({ id: 'great-white-shark-26', modelId: 'great-white-shark', wheel: '26-inch', variantLabel: '26-inch', retailPrice: 6300, visualAssetKey: 'great-white-shark-26' }),
  sku({ id: 'tiger-shark-24', modelId: 'tiger-shark', wheel: '24-inch', variantLabel: '24-inch', retailPrice: 6500, rim: 'Single-walled rim', visualMatch: 'ai-assisted-catalog-variant', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'tiger-shark-24' }),
  sku({ id: 'tiger-shark-26', modelId: 'tiger-shark', wheel: '26-inch', variantLabel: '26-inch', retailPrice: 7700, rim: 'Double-walled rim', visualMatch: 'ai-assisted-catalog-variant', visualNote: 'Contact us to confirm this exact setup before ordering.', visualAssetKey: 'tiger-shark-26' }),
  sku({ id: 'lemon-shark-27-5', modelId: 'lemon-shark', wheel: '27.5-inch', variantLabel: '27.5-inch', retailPrice: 8700, rim: 'Double-walled rim', visualAssetKey: 'lemon-shark-27-5' }),
  sku({ id: 'lightning-marlin-700c', modelId: 'lightning-marlin', wheel: '700C', variantLabel: '700C, single speed', retailPrice: 9500, rim: 'Double-walled rim', visualAssetKey: 'lightning-marlin-700c' }),
  sku({ id: 'bull-shark-29', modelId: 'bull-shark', wheel: '29-inch', variantLabel: '29-inch', retailPrice: 9500, visualMatch: 'identity-conflict', visualNote: 'Current verified photography and the catalog presentation require a final product-identity check.', visualAssetKey: 'bull-shark-29' }),
  sku({ id: 'shark-blue-26-geared', modelId: 'shark-blue', wheel: '26-inch', variantLabel: '26-inch, geared', retailPrice: 9700, rim: 'Double-walled rim', visualAssetKey: 'shark-blue-26-geared' }),
  sku({ id: 'mako-shark-27-5-geared', modelId: 'mako-shark', wheel: '27.5-inch', variantLabel: '27.5-inch, geared', retailPrice: 10100, rim: 'Double-walled rim', visualAssetKey: 'mako-shark-27-5-geared' }),
  sku({ id: 'sunset-marlin-700c-geared', modelId: 'sunset-marlin', wheel: '700C', variantLabel: '700C, geared', retailPrice: 10500, visualAssetKey: 'sunset-marlin-700c-geared' }),
]);

const MODEL_BY_ID = new Map(MODELS.map((item) => [item.id, item]));
const SKU_BY_ID = new Map(SKUS.map((item) => [item.id, item]));
const RIDE_TYPE_BY_ID = new Map(RIDE_TYPES.map((item) => [item.id, item]));

const DEFAULT_MODEL_ID = 'mako-shark';

export const configuratorCatalog = Object.freeze({
  schemaVersion: CONFIGURATOR_SCHEMA_VERSION,
  authority: CONFIGURATOR_AUTHORITY,
  stages: CONFIGURATOR_STEPS,
  rideTypes: RIDE_TYPES,
  models: MODELS,
  skus: SKUS,
});

export const configuratorBasePriceByModel = Object.freeze(Object.fromEntries(
  MODELS.map(({ id }) => {
    const prices = SKUS
      .filter(({ modelId, retailPrice }) => modelId === id && Number.isFinite(retailPrice))
      .map(({ retailPrice }) => retailPrice);
    return [id, prices.length ? Math.min(...prices) : null];
  }),
));

export function configuratorBasePrice(modelId) {
  return Object.hasOwn(configuratorBasePriceByModel, modelId)
    ? configuratorBasePriceByModel[modelId]
    : null;
}

function canonicalFromModel(modelItem, skuItem = null) {
  const resolvedSku = skuItem || SKU_BY_ID.get(modelItem.defaultSkuId);
  const includedAccessories = resolvedSku.carrier ? ['ibc-carrier'] : [];
  return {
    version: CONFIGURATOR_SCHEMA_VERSION,
    rideType: modelItem.rideType,
    modelId: modelItem.id,
    skuId: resolvedSku.id,
    fit: {
      wheel: resolvedSku.wheel,
      frameSize: null,
    },
    components: {
      brakes: modelItem.setup.brakes.id,
      fork: modelItem.setup.fork.id,
      drivetrain: modelItem.setup.drivetrain.id,
    },
    finish: CATALOG_FINISH.id,
    accessories: includedAccessories,
  };
}

function legacyModelId(value) {
  const base = value?.base;
  if (base === 'mako') return 'mako-shark';
  if (base === 'bull') return 'bull-shark';
  if (MODEL_BY_ID.has(base)) return base;
  if (MODEL_BY_ID.has(value?.modelId)) return value.modelId;
  if (MODEL_BY_ID.has(value?.productId)) return value.productId;
  if (MODEL_BY_ID.has(value?.model)) return value.model;
  return null;
}

export function migrateBuild(value) {
  const candidate = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  if (Number(candidate.version) === CONFIGURATOR_SCHEMA_VERSION) {
    return {
      version: CONFIGURATOR_SCHEMA_VERSION,
      rideType: candidate.rideType,
      modelId: candidate.modelId,
      skuId: candidate.skuId,
      fit: candidate.fit && typeof candidate.fit === 'object' ? { ...candidate.fit } : {},
      components: candidate.components && typeof candidate.components === 'object' ? { ...candidate.components } : {},
      finish: candidate.finish,
      accessories: Array.isArray(candidate.accessories) ? [...candidate.accessories] : [],
    };
  }

  const modelId = legacyModelId(candidate) || DEFAULT_MODEL_ID;
  const modelItem = MODEL_BY_ID.get(modelId) || MODEL_BY_ID.get(DEFAULT_MODEL_ID);
  const requestedSku = SKU_BY_ID.get(candidate.skuId);
  const base = canonicalFromModel(
    modelItem,
    requestedSku?.modelId === modelItem.id ? requestedSku : null,
  );
  const legacyBrakes = { power: 'power-brake', disc: 'disc-brake' }[candidate.brakes] || candidate.brakes;
  const legacyFork = { front: 'front-suspension', rigid: 'rigid-fork' }[candidate.suspension] || candidate.suspension;
  const legacyDrivetrain = { 21: '21-speed', single: 'single-speed' }[candidate.gears] || candidate.gears;
  return {
    ...base,
    rideType: RIDE_TYPE_BY_ID.has(candidate.rideType) ? candidate.rideType : base.rideType,
    modelId,
    skuId: base.skuId,
    fit: {
      ...base.fit,
      ...(candidate.fit && typeof candidate.fit === 'object' ? candidate.fit : {}),
    },
    components: {
      ...base.components,
      brakes: legacyBrakes || candidate.components?.brakes || base.components.brakes,
      fork: legacyFork || candidate.components?.fork || base.components.fork,
      drivetrain: legacyDrivetrain || candidate.components?.drivetrain || base.components.drivetrain,
    },
    // Legacy finish names were design concepts, not sale finishes.
    finish: CATALOG_FINISH.id,
    accessories: Array.isArray(candidate.accessories) ? [...candidate.accessories] : base.accessories,
  };
}

function issue(code, message, field, severity = 'info') {
  return { code, message, field, severity };
}

function selectedComponents(build) {
  return Object.fromEntries(
    Object.keys(COMPONENT_OPTIONS).map((group) => [
      group,
      COMPONENT_BY_GROUP_AND_ID[group].get(build.components[group]),
    ]),
  );
}

function skuForCarrier(modelId, wheel, carrier) {
  return SKUS.find((item) => (
    item.modelId === modelId
    && item.wheel === wheel
    && Boolean(item.carrier) === Boolean(carrier)
  ));
}

function normalizeComponents(candidate, canonical, issues) {
  const requested = candidate.components || {};
  return Object.fromEntries(
    Object.keys(COMPONENT_OPTIONS).map((group) => {
      const requestedId = requested[group];
      if (requestedId && COMPONENT_BY_GROUP_AND_ID[group].has(requestedId)) {
        return [group, requestedId];
      }
      if (requestedId) {
        issues.push(issue(
          `invalid-${group}`,
          `${COMPONENT_GROUP_LABELS[group]} was returned to the bicycle's standard setup.`,
          `components.${group}`,
          'warning',
        ));
      }
      return [group, canonical.components[group]];
    }),
  );
}

export function resolveBuild(value, changedField = null) {
  const candidate = migrateBuild(value);
  const issues = [];

  let rideType = RIDE_TYPE_BY_ID.has(candidate.rideType) ? candidate.rideType : null;
  if (!rideType && candidate.rideType) {
    issues.push(issue('invalid-ride-type', 'Ride type was changed to the closest available option.', 'rideType', 'warning'));
  }

  let modelItem = MODEL_BY_ID.get(candidate.modelId);
  const changedRideType = changedField === 'rideType' || changedField === 'ride-type';
  if (changedRideType && rideType && modelItem?.rideType !== rideType) modelItem = null;

  if (!modelItem) {
    const preferredRideType = rideType || MODEL_BY_ID.get(DEFAULT_MODEL_ID).rideType;
    modelItem = MODELS.find((item) => item.rideType === preferredRideType) || MODEL_BY_ID.get(DEFAULT_MODEL_ID);
    issues.push(issue('model-reset', `Bicycle was reset to ${modelItem.name} for the selected ride type.`, 'modelId'));
  }

  if (rideType && rideType !== modelItem.rideType) {
    issues.push(issue('ride-type-aligned', `Ride type was aligned with ${modelItem.name}.`, 'rideType'));
  }
  rideType = modelItem.rideType;

  let skuItem = SKU_BY_ID.get(candidate.skuId);
  if (!skuItem || skuItem.modelId !== modelItem.id) {
    const wheelMatch = SKUS.find((item) => item.modelId === modelItem.id && item.wheel === candidate.fit?.wheel);
    skuItem = wheelMatch || SKU_BY_ID.get(modelItem.defaultSkuId);
    if (candidate.skuId) {
      issues.push(issue('sku-reset', `Variant was reset to ${skuItem.variantLabel} for ${modelItem.name}.`, 'skuId'));
    }
  }

  const unsupportedAccessories = (candidate.accessories || []).filter((item) => item !== 'ibc-carrier');
  if (unsupportedAccessories.length) {
    issues.push(issue('invalid-accessories', 'Unknown add-ons were removed from this build.', 'accessories', 'warning'));
  }
  const wantsCarrier = (candidate.accessories || []).includes('ibc-carrier');
  if (wantsCarrier !== Boolean(skuItem.carrier)) {
    const exactCarrierSku = skuForCarrier(modelItem.id, skuItem.wheel, wantsCarrier);
    if (exactCarrierSku) skuItem = exactCarrierSku;
  }

  const canonical = canonicalFromModel(modelItem, skuItem);
  const finish = FINISH_BY_ID.has(candidate.finish) ? candidate.finish : CATALOG_FINISH.id;
  if (candidate.finish && !FINISH_BY_ID.has(candidate.finish)) {
    issues.push(issue('invalid-finish', 'The unknown finish was returned to the catalog finish.', 'finish', 'warning'));
  }

  const build = {
    ...canonical,
    components: normalizeComponents(candidate, canonical, issues),
    finish,
    accessories: wantsCarrier ? ['ibc-carrier'] : [],
  };

  const customRequestReasons = [];
  for (const group of Object.keys(COMPONENT_OPTIONS)) {
    if (build.components[group] !== modelItem.setup[group].id) {
      customRequestReasons.push({
        field: `components.${group}`,
        label: COMPONENT_GROUP_LABELS[group],
      });
    }
  }
  if (build.finish !== CATALOG_FINISH.id) {
    customRequestReasons.push({ field: 'finish', label: 'Finish' });
  }
  if (build.accessories.includes('ibc-carrier') !== Boolean(skuItem.carrier)) {
    customRequestReasons.push({ field: 'accessories', label: 'Rear carrier' });
  }

  const customizationConfirmationRequired = customRequestReasons.length > 0;
  if (customizationConfirmationRequired) {
    issues.push(issue(
      'custom-build-confirmation-required',
      'This is a custom build request. Finspeed will confirm compatibility, final appearance, availability and price before you order.',
      customRequestReasons[0].field,
      'warning',
    ));
  }

  if (modelItem.authority.status !== 'catalog-audited') {
    issues.push(issue('provisional-model-specification', modelItem.authority.note, 'modelId'));
  }
  if (skuItem.visual.match === 'identity-conflict') {
    issues.push(issue(
      'product-identity-confirmation-required',
      skuItem.visual.note || 'Contact us to confirm this exact model before ordering.',
      'skuId',
      'critical',
    ));
  } else if (skuItem.visual.match !== 'model-exact') {
    issues.push(issue('visual-reference-only', 'Contact us to confirm this exact setup before ordering.', 'skuId'));
  }

  const visualStateId = [
    `v${CONFIGURATOR_SCHEMA_VERSION}`,
    build.modelId,
    build.skuId,
    build.components.brakes,
    build.components.fork,
    build.components.drivetrain,
    build.finish,
    [...build.accessories].sort().join('+') || 'none',
  ].join('__');

  const identityConfirmationRequired = issues.some(({ code }) => code === 'product-identity-confirmation-required');
  const requestRequired = identityConfirmationRequired || customizationConfirmationRequired;
  const resolved = {
    build,
    model: modelItem,
    sku: skuItem,
    rideType: RIDE_TYPE_BY_ID.get(rideType),
    price: skuItem.retailPrice,
    basePrice: skuItem.retailPrice,
    priceAuthority: skuItem.authority.price,
    commerceReady: Number.isFinite(skuItem.retailPrice) && !requestRequired,
    identityConfirmationRequired,
    customizationConfirmationRequired,
    requestRequired,
    customRequestReasons,
    commerceStatus: identityConfirmationRequired
      ? 'identity-confirmation-required'
      : customizationConfirmationRequired
        ? 'custom-build-request'
        : 'ready',
    issues,
    changedField,
    visualStateId,
    selections: {
      components: selectedComponents(build),
      finish: FINISH_BY_ID.get(build.finish),
      accessories: build.accessories.includes('ibc-carrier')
        ? [{ id: 'ibc-carrier', label: 'IBC frame-mounted carrier' }]
        : [],
    },
  };

  resolved.options = Object.fromEntries(
    CONFIGURATOR_STEPS.map(({ id }) => [id, optionsForStage(id, resolved)]),
  );
  return resolved;
}

export function createDefaultBuild(overrides = {}) {
  const candidate = overrides && typeof overrides === 'object' ? overrides : {};
  const requestedModel = MODEL_BY_ID.get(candidate.modelId);
  const requestedRide = RIDE_TYPE_BY_ID.has(candidate.rideType) ? candidate.rideType : null;
  const baseModel = requestedModel
    || (requestedRide ? MODELS.find((item) => item.rideType === requestedRide) : null)
    || MODEL_BY_ID.get(DEFAULT_MODEL_ID);
  return resolveBuild({ ...canonicalFromModel(baseModel), ...candidate }).build;
}

function resolvedInput(value) {
  return value?.build && value?.model && value?.sku ? value : resolveBuild(value);
}

function selectedOption(option, selectedId) {
  return { ...option, selected: option.id === selectedId };
}

export function optionsForStage(stageId, value) {
  const resolved = resolvedInput(value);
  const { build, model: modelItem, sku: skuItem } = resolved;

  switch (stageId) {
    case 'ride-type':
      return RIDE_TYPES.map((item) => selectedOption({ ...item, available: true }, build.rideType));
    case 'model':
      return MODELS
        .filter((item) => item.rideType === build.rideType)
        .map((item) => selectedOption({
          id: item.id,
          label: item.name,
          copy: item.copy,
          series: item.series,
          available: true,
          status: item.authority.status,
        }, build.modelId));
    case 'fit':
      return [...new Set(SKUS
        .filter((item) => item.modelId === modelItem.id)
        .map((item) => item.wheel))]
        .map((wheel) => {
          const targetSku = skuForCarrier(
            modelItem.id,
            wheel,
            build.accessories.includes('ibc-carrier'),
          ) || skuForCarrier(modelItem.id, wheel, false)
            || SKUS.find((item) => item.modelId === modelItem.id && item.wheel === wheel);
          return selectedOption({
            id: `wheel:${wheel}`,
            label: wheel,
            copy: [targetSku.rim, 'Choose equipment on the Add-ons step.'].filter(Boolean).join(' · '),
            wheel,
            price: targetSku.retailPrice,
            available: true,
            status: targetSku.authority.status,
            visualMatch: targetSku.visual.match,
          }, `wheel:${build.fit.wheel}`);
        });
    case 'ride-setup':
      {
        const fullVisualMatrix = hasFullBuildVisualMatrix(modelItem.id);
        return Object.entries(COMPONENT_OPTIONS).flatMap(([group, items]) => (
          items.map((item) => {
            const standard = item.id === modelItem.setup[group].id;
            const copy = standard
              ? `${item.copy} Standard on ${modelItem.name}.`
              : fullVisualMatrix
                ? `${item.copy} Preview updates for this ${modelItem.name} request; final compatibility and price are confirmed by Finspeed.`
                : `${item.copy} Custom request; the preview remains the verified ${modelItem.name} reference until Finspeed confirms the final build.`;
            return selectedOption({
              ...item,
              group,
              groupLabel: COMPONENT_GROUP_LABELS[group],
              copy,
              status: standard ? modelItem.setup[group].status : 'custom-request',
              available: true,
              visualPreview: standard || fullVisualMatrix,
            }, build.components[group]);
          })
        ));
      }
    case 'finish':
      {
        const fullVisualMatrix = hasFullBuildVisualMatrix(modelItem.id);
        return FINISH_OPTIONS.map((item) => {
          const catalog = item.id === CATALOG_FINISH.id;
          return selectedOption({
            ...item,
            copy: catalog
              ? `The verified finish shown for ${modelItem.name}.`
              : fullVisualMatrix
                ? `${item.copy} Preview updates for this ${modelItem.name} finish request.`
                : `${item.copy} The preview remains the verified ${modelItem.name} reference until Finspeed confirms the final finish.`,
            available: true,
            modelId: modelItem.id,
            visualPreview: catalog || fullVisualMatrix,
          }, build.finish);
        });
      }
    case 'accessories':
      {
        const fullVisualMatrix = hasFullBuildVisualMatrix(modelItem.id);
        return [
        {
          id: 'none',
          label: 'No add-ons',
          copy: skuForCarrier(modelItem.id, skuItem.wheel, false)
            ? 'A clean frame setup with no rear carrier.'
            : 'Requested without a rear carrier; final setup confirmed by Finspeed.',
          price: skuForCarrier(modelItem.id, skuItem.wheel, false)?.retailPrice,
          status: build.accessories.length === 0 && !skuItem.carrier ? 'included' : 'catalog-audited',
          available: true,
          visualPreview: fullVisualMatrix || !skuItem.carrier,
        },
        {
          id: 'ibc-carrier',
          label: 'IBC frame-mounted carrier',
          copy: skuForCarrier(modelItem.id, skuItem.wheel, true)
            ? 'A verified carrier-equipped catalog setup for this wheel size.'
            : 'Custom carrier request; fit, availability and price confirmed by Finspeed.',
          price: skuForCarrier(modelItem.id, skuItem.wheel, true)?.retailPrice,
          status: skuForCarrier(modelItem.id, skuItem.wheel, true)
            ? (build.accessories.includes('ibc-carrier') && skuItem.carrier ? 'included' : 'catalog-audited')
            : 'custom-request',
          available: true,
          visualPreview: fullVisualMatrix || Boolean(skuForCarrier(modelItem.id, skuItem.wheel, true)),
        },
      ].map((item) => selectedOption(
        item,
        build.accessories.includes('ibc-carrier') ? 'ibc-carrier' : 'none',
      ));
      }
    case 'review':
      return [];
    default:
      return [];
  }
}

export function selectBuildOption(value, stageId, optionId, groupId = null) {
  const resolved = resolveBuild(value);
  const next = { ...resolved.build };

  if (stageId === 'ride-type' && RIDE_TYPE_BY_ID.has(optionId)) {
    const nextModel = MODELS.find((item) => item.rideType === optionId);
    return resolveBuild(canonicalFromModel(nextModel), 'rideType').build;
  }

  if (stageId === 'model' && MODEL_BY_ID.has(optionId)) {
    return resolveBuild(canonicalFromModel(MODEL_BY_ID.get(optionId)), 'modelId').build;
  }

  if (stageId === 'fit') {
    const requestedSku = SKU_BY_ID.get(optionId);
    if (requestedSku?.modelId === next.modelId) {
      return resolveBuild({
        ...next,
        skuId: requestedSku.id,
        fit: { ...next.fit, wheel: requestedSku.wheel },
        accessories: requestedSku.carrier ? ['ibc-carrier'] : [],
      }, 'skuId').build;
    }
    const wheel = optionId.startsWith('wheel:') ? optionId.slice('wheel:'.length) : null;
    if (wheel) {
      const nextSku = skuForCarrier(next.modelId, wheel, next.accessories.includes('ibc-carrier'))
        || skuForCarrier(next.modelId, wheel, false)
        || SKUS.find((item) => item.modelId === next.modelId && item.wheel === wheel);
      if (nextSku) {
        return resolveBuild({
          ...next,
          skuId: nextSku.id,
          fit: { ...next.fit, wheel: nextSku.wheel },
          accessories: nextSku.carrier ? ['ibc-carrier'] : [],
        }, 'skuId').build;
      }
    }
  }

  if (stageId === 'ride-setup') {
    const group = groupId || Object.keys(COMPONENT_OPTIONS)
      .find((candidateGroup) => COMPONENT_BY_GROUP_AND_ID[candidateGroup].has(optionId));
    if (group && COMPONENT_BY_GROUP_AND_ID[group].has(optionId)) {
      return resolveBuild({
        ...next,
        components: { ...next.components, [group]: optionId },
      }, `components.${group}`).build;
    }
  }

  if (stageId === 'finish' && FINISH_BY_ID.has(optionId)) {
    return resolveBuild({ ...next, finish: optionId }, 'finish').build;
  }

  if (stageId === 'accessories' && ['none', 'ibc-carrier'].includes(optionId)) {
    const wantsCarrier = optionId === 'ibc-carrier';
    const exactSku = skuForCarrier(next.modelId, next.fit.wheel, wantsCarrier);
    return resolveBuild({
      ...next,
      ...(exactSku ? { skuId: exactSku.id } : {}),
      accessories: wantsCarrier ? ['ibc-carrier'] : [],
    }, 'accessories').build;
  }

  return resolved.build;
}

export function formatConfiguratorPrice(value) {
  return Number.isFinite(value) ? `₹${Number(value).toLocaleString('en-IN')}` : 'Price on request';
}

export function configurationSummary(value) {
  const resolved = resolvedInput(value);
  const { build, model: modelItem, sku: skuItem } = resolved;
  const selections = resolved.selections || {
    components: selectedComponents(build),
    finish: FINISH_BY_ID.get(build.finish),
    accessories: build.accessories.includes('ibc-carrier')
      ? [{ id: 'ibc-carrier', label: 'IBC frame-mounted carrier' }]
      : [],
  };
  const accessories = selections.accessories.map(({ label }) => label);
  const rows = [
    { id: 'bicycle', label: 'Bicycle', value: modelItem.name },
    { id: 'fit', label: 'Fit & wheels', value: skuItem.variantLabel },
    {
      id: 'brakes',
      label: 'Brakes',
      value: selections.components.brakes.label,
      status: build.components.brakes === modelItem.setup.brakes.id ? modelItem.setup.brakes.status : 'custom-request',
    },
    {
      id: 'fork',
      label: 'Fork',
      value: selections.components.fork.label,
      status: build.components.fork === modelItem.setup.fork.id ? modelItem.setup.fork.status : 'custom-request',
    },
    {
      id: 'drivetrain',
      label: 'Gears',
      value: selections.components.drivetrain.label,
      status: build.components.drivetrain === modelItem.setup.drivetrain.id ? modelItem.setup.drivetrain.status : 'custom-request',
    },
    {
      id: 'finish',
      label: 'Finish',
      value: selections.finish.label,
      status: build.finish === CATALOG_FINISH.id ? 'included' : 'custom-request',
    },
    {
      id: 'equipment',
      label: 'Add-ons',
      value: accessories.join(', ') || 'No add-ons',
      status: build.accessories.includes('ibc-carrier') === Boolean(skuItem.carrier) ? 'included' : 'custom-request',
    },
  ];
  const componentText = [
    selections.components.brakes.label,
    selections.components.fork.label,
    selections.components.drivetrain.label,
  ]
    .join(', ');
  return {
    title: modelItem.name,
    variant: skuItem.variantLabel,
    price: resolved.price,
    priceLabel: formatConfiguratorPrice(resolved.price),
    priceQualifier: resolved.customizationConfirmationRequired ? 'Base bicycle; final quote confirmed by Finspeed' : 'Selected build',
    rows,
    items: rows,
    includedAccessories: accessories,
    sentence: `${modelItem.name}, ${skuItem.variantLabel}, with ${componentText}.`,
    alt: visualAlt(resolved),
    authority: {
      price: resolved.priceAuthority,
      modelStatus: modelItem.authority.status,
      visualMatch: skuItem.visual.match,
    },
  };
}

function visualAlt(resolved, selectionFamily = null) {
  const { build, model: modelItem, sku: skuItem } = resolved;
  const selected = `Selected build: ${modelItem.name}, ${skuItem.variantLabel}`;
  if (!selectionFamily && (resolved.customizationConfirmationRequired || skuItem.visual.match !== 'model-exact')) {
    return `Finspeed ${modelItem.name} reference image. ${selected}.`;
  }
  const carrier = build.accessories.includes('ibc-carrier') ? ' with IBC carrier' : '';
  return `Finspeed ${modelItem.name} ${skuItem.variantLabel}${carrier}, shown in side profile with the selected components and finish.`;
}

function lightSrcSet(modelId) {
  return [480, 960, 1600]
    .map((width) => `/assets/products/upscaled/${modelId}-${width}.webp ${width}w`)
    .join(', ');
}

function customVisualSrcSet(root, assetKey) {
  return [480, 960, 1600]
    .map((width) => `${root}/${assetKey}-r01-w${width}.webp ${width}w`)
    .join(', ');
}

const BUILD_VISUAL_MATRIX_TOKENS = Object.freeze({
  brakes: Object.freeze({
    'power-brake': 'power',
    'disc-brake': 'disc',
  }),
  fork: Object.freeze({
    'rigid-fork': 'rigid',
    'front-suspension': 'front',
  }),
  drivetrain: Object.freeze({
    'single-speed': 'single',
    '21-speed': '21',
  }),
  finish: Object.freeze({
    'catalog-finish': 'catalog',
    'graphite-request': 'graphite',
    'deep-blue-request': 'blue',
    'signal-red-request': 'red',
    'pearl-silver-request': 'silver',
  }),
});

function buildVisualMatrixAsset(resolved) {
  const matrix = BUILD_VISUAL_MATRIX_BY_MODEL_ID[resolved.model.id];
  if (!matrix || !AVAILABLE_CONFIGURATOR_MATRIX_IDS.includes(matrix.id) || !matrix.skuIds.includes(resolved.sku.id)) return null;
  const brake = BUILD_VISUAL_MATRIX_TOKENS.brakes[resolved.build.components.brakes];
  const fork = BUILD_VISUAL_MATRIX_TOKENS.fork[resolved.build.components.fork];
  const drivetrain = BUILD_VISUAL_MATRIX_TOKENS.drivetrain[resolved.build.components.drivetrain];
  const finish = BUILD_VISUAL_MATRIX_TOKENS.finish[resolved.build.finish];
  if (!brake || !fork || !drivetrain || !finish) return null;
  const fit = matrix.fitTokens?.[resolved.build.fit.wheel];
  if (matrix.fitTokens && !fit) return null;
  const carrier = resolved.build.accessories.includes('ibc-carrier') ? 'carrier' : 'none';
  const assetKey = [matrix.assetPrefix, fit, brake, fork, drivetrain, finish, carrier]
    .filter(Boolean)
    .join('-');
  return { matrix, assetKey };
}

/**
 * Governed selection-dependent visual families.
 *
 * Stock SKU imagery remains the fallback. A family is only selected when the
 * complete registered criteria match, so an assisted preview cannot silently
 * stand in for a different component or finish.
 */
const SELECTION_VISUAL_FAMILIES = Object.freeze([]);

function selectionVisualFamily(resolved) {
  // Exact catalog states must keep the governed Tier A stock poster
  // (asset-contract: verified source covers stock product, catalog, and
  // configurator base). The exhaustive matrix serves every deviating state.
  const catalogExactStockState = !resolved.customizationConfirmationRequired
    && Boolean(resolved.sku.visual.assetKey);
  const matrixAsset = catalogExactStockState ? null : buildVisualMatrixAsset(resolved);
  if (matrixAsset) {
    const { matrix, assetKey } = matrixAsset;
    return {
      id: `${matrix.id}__${assetKey}`,
      modelId: resolved.model.id,
      skuIds: matrix.skuIds,
      assetKey,
      fidelity: matrix.fidelity,
      note: `Preview updates to the selected ${resolved.model.name} fit, components, finish and carrier. Finspeed confirms final availability and quote before order.`,
    };
  }
  return SELECTION_VISUAL_FAMILIES.find((family) => {
    if (family.modelId !== resolved.model.id || !family.skuIds.includes(resolved.sku.id)) return false;
    return Object.entries(family.components || {}).every(
      ([group, optionId]) => resolved.selections.components[group]?.id === optionId,
    );
  }) || null;
}

export function configuratorVisual(value, theme = 'light') {
  const resolved = resolvedInput(value);
  const dark = theme === 'dark';
  const selectedFamily = selectionVisualFamily(resolved);
  const customAssetKey = selectedFamily?.assetKey || resolved.sku.visual.assetKey;
  const customRoot = customAssetKey
    ? `/assets/configurator/v1/${resolved.model.id}/side-r/${dark ? 'dark' : 'light'}/poster`
    : null;
  const src = customRoot
    ? `${customRoot}/${customAssetKey}-r01-w1600.webp`
    : dark
      ? `/assets/products/dark-studio-v2/${resolved.model.id}-studio.webp`
      : `/assets/products/upscaled/${resolved.model.id}-1600.webp`;
  const srcSet = customRoot
    ? customVisualSrcSet(customRoot, customAssetKey)
    : dark
      ? undefined
      : lightSrcSet(resolved.model.id);
  return {
    id: `${resolved.visualStateId}__${dark ? 'dark' : 'light'}`,
    visualStateId: resolved.visualStateId,
    productId: resolved.model.id,
    skuId: resolved.sku.id,
    theme: dark ? 'dark' : 'light',
    src,
    srcSet,
    sizes: '(max-width: 900px) 100vw, 60vw',
    alt: visualAlt(resolved, selectedFamily),
    fidelity: selectedFamily?.fidelity || resolved.sku.visual.match,
    note: selectedFamily?.note || (resolved.customizationConfirmationRequired
      ? 'Reference image of the selected bicycle. Custom components, finish and equipment are confirmed before order.'
      : resolved.sku.visual.note),
    authority: CONFIGURATOR_AUTHORITY.assets,
    layers: [{ id: 'base', role: 'base', src }],
  };
}

function cartPreviewVisual(value, theme) {
  const visual = configuratorVisual(value, theme);
  return {
    id: visual.id,
    visualStateId: visual.visualStateId,
    productId: visual.productId,
    skuId: visual.skuId,
    theme: visual.theme,
    src: visual.src,
    srcSet: visual.srcSet,
    sizes: visual.sizes,
    alt: visual.alt,
    fidelity: visual.fidelity,
  };
}

/**
 * Canonical, theme-paired product imagery persisted with a configured cart
 * line. Storing both variants lets the cart and checkout follow the active
 * site theme without recomputing a possibly newer catalog state.
 */
export function configuredCartPreview(value) {
  const resolved = resolvedInput(value);
  return {
    visualStateId: resolved.visualStateId,
    productId: resolved.model.id,
    skuId: resolved.sku.id,
    light: cartPreviewVisual(resolved, 'light'),
    dark: cartPreviewVisual(resolved, 'dark'),
  };
}

function canonicalFingerprintPayload(value) {
  const { build } = resolvedInput(value);
  return JSON.stringify({
    version: CONFIGURATOR_SCHEMA_VERSION,
    modelId: build.modelId,
    skuId: build.skuId,
    fit: {
      wheel: build.fit.wheel,
      frameSize: build.fit.frameSize || null,
    },
    components: {
      brakes: build.components.brakes,
      fork: build.components.fork,
      drivetrain: build.components.drivetrain,
    },
    finish: build.finish,
    accessories: [...build.accessories].sort(),
  });
}

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36).padStart(7, '0');
}

export function configuredCartFingerprint(value) {
  return `fsc${CONFIGURATOR_SCHEMA_VERSION}-${fnv1a(canonicalFingerprintPayload(value))}`;
}

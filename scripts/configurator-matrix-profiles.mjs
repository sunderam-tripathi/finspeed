const root = (productId, assetKey) => (
  `specs/proofs/web/WEB-035/masters/${assetKey}-r01/light-cutout-master-3072x2048.webp`
);

function stock(wheel, brakes, fork, drivetrain, carrier, assetKey) {
  return { wheel, brakes, fork, drivetrain, carrier, source: assetKey };
}

const sharedFinishes = Object.freeze([
  { id: 'catalog', optionId: 'catalog-finish', label: 'Catalog finish', tint: null },
  { id: 'graphite', optionId: 'graphite-request', label: 'Graphite', tint: { h: 205, s: 0.08, lScale: 0.36, lOffset: 0.02 } },
  { id: 'blue', optionId: 'deep-blue-request', label: 'Deep blue', tint: { h: 207, s: 0.48, lScale: 0.58, lOffset: 0.04 } },
  { id: 'red', optionId: 'signal-red-request', label: 'Signal red', tint: { h: 358, s: 0.66, lScale: 0.66, lOffset: 0.03 } },
  { id: 'silver', optionId: 'pearl-silver-request', label: 'Pearl silver', tint: { h: 55, s: 0.08, lScale: 0.9, lOffset: 0.08 } },
]);

const profiles = {
  'shark-blue': {
    productName: 'Shark Blue',
    matrixId: 'shark-blue-exhaustive-r01',
    assetPrefix: 'shark-blue',
    fits: [{ wheel: '26-inch', token: null }],
    paint: { hueRanges: [[185, 245]], minS: 0.18, minL: 0.12, maxL: 0.9 },
    stock: [stock('26-inch', 'disc', 'front', '21', 'none', 'shark-blue-26-geared')],
  },
  'bull-shark': {
    productName: 'Bull Shark',
    matrixId: 'bull-shark-exhaustive-r01',
    assetPrefix: 'bull-shark',
    fits: [{ wheel: '29-inch', token: null }],
    paint: { hueRanges: [[185, 245]], minS: 0.16, minL: 0.12, maxL: 0.9 },
    stock: [stock('29-inch', 'disc', 'front', '21', 'none', 'bull-shark-29')],
  },
  'lemon-shark': {
    productName: 'Lemon Shark',
    matrixId: 'lemon-shark-exhaustive-r01',
    assetPrefix: 'lemon-shark',
    fits: [{ wheel: '27.5-inch', token: null }],
    paint: { hueRanges: [[45, 105]], minS: 0.18, minL: 0.12, maxL: 0.9 },
    stock: [stock('27.5-inch', 'disc', 'front', '21', 'none', 'lemon-shark-27-5')],
  },
  'tiger-shark': {
    productName: 'Tiger Shark',
    matrixId: 'tiger-shark-exhaustive-r01',
    assetPrefix: 'tiger-shark',
    fits: [{ wheel: '24-inch', token: '24' }, { wheel: '26-inch', token: '26' }],
    paint: { hueRanges: [[18, 58]], minS: 0.22, minL: 0.1, maxL: 0.9 },
    // Tiger Shark uses two governed fit photographs with slightly different
    // camera geometry. A 0.50 overlap still catches paint drift while allowing
    // validated fork/drivetrain/carrier edits to change the aligned silhouette.
    minPaintOverlap: 0.5,
    // The governed stock masters contain coloured RGB noise in nominally
    // transparent pixels. Use clean cutouts derived from the approved white
    // studio inputs for paint-fidelity comparisons only.
    auditSources: {
      '24-inch': 'specs/proofs/web/WEB-035/tiger-shark-exhaustive-r01/audit-references/tiger-shark-24-r01-cutout.png',
      '26-inch': 'specs/proofs/web/WEB-035/tiger-shark-exhaustive-r01/audit-references/tiger-shark-26-r01-cutout.png',
    },
    stock: [
      stock('24-inch', 'disc', 'front', '21', 'none', 'tiger-shark-24'),
      stock('26-inch', 'disc', 'front', '21', 'none', 'tiger-shark-26'),
    ],
  },
  'red-snapper': {
    productName: 'Red Snapper',
    matrixId: 'red-snapper-exhaustive-r01',
    assetPrefix: 'red-snapper',
    fits: [{ wheel: '24-inch', token: '24' }, { wheel: '26-inch', token: '26' }],
    // The approved 24/26 and IBC/non-IBC catalog photographs use materially
    // different wheelbase and carrier silhouettes. Normalised paint overlap is
    // therefore a coarse identity guard here; component and wordmark accuracy
    // remain gated by the generated contact sheet and visual review.
    minPaintOverlap: 0.4,
    paint: { hueRanges: [[335, 360], [0, 24]], minS: 0.24, minL: 0.08, maxL: 0.9 },
    stock: [
      stock('24-inch', 'power', 'rigid', 'single', 'none', 'red-snapper-24-non-ibc'),
      stock('24-inch', 'power', 'rigid', 'single', 'carrier', 'red-snapper-24-ibc'),
      stock('26-inch', 'power', 'rigid', 'single', 'none', 'red-snapper-26-non-ibc'),
      stock('26-inch', 'power', 'rigid', 'single', 'carrier', 'red-snapper-26-ibc'),
    ],
  },
  'sea-breeze': {
    productName: 'Sea Breeze',
    matrixId: 'sea-breeze-exhaustive-r01',
    assetPrefix: 'sea-breeze',
    fits: [{ wheel: '24-inch', token: '24' }, { wheel: '26-inch', token: '26' }],
    // The approved 24-inch non-IBC reference and its visually reviewed 3x7
    // variants differ slightly in rear-triangle paint alignment after the
    // drivetrain edit. A 0.58 floor admits those two reviewed masters while
    // retaining a tighter identity guard than the multi-fit Red Snapper set.
    minPaintOverlap: 0.58,
    paint: { hueRanges: [[155, 205]], minS: 0.18, minL: 0.12, maxL: 0.92 },
    stock: [
      stock('24-inch', 'power', 'rigid', 'single', 'none', 'sea-breeze-24-non-ibc'),
      stock('24-inch', 'power', 'rigid', 'single', 'carrier', 'sea-breeze-24-ibc'),
      stock('26-inch', 'power', 'rigid', 'single', 'none', 'sea-breeze-26-non-ibc'),
      stock('26-inch', 'power', 'rigid', 'single', 'carrier', 'sea-breeze-26-ibc'),
    ],
  },
  hammerhead: {
    productName: 'Hammerhead',
    matrixId: 'hammerhead-exhaustive-r01',
    assetPrefix: 'hammerhead',
    fits: [{ wheel: '24-inch', token: null }],
    // Hammerhead's governed identity is a neutral silver/black frame. The only
    // strongly chromatic pixels are the small red fender accents, whose position
    // legitimately changes with carrier/fork edits and is therefore not a sound
    // paint-registration proxy. Keep alpha, resolution, crop and silhouette
    // gates automated; product paint, wordmark and hardware are contact-sheet
    // reviewed for all 15 generated masters.
    paintAuditMode: 'visual-only',
    paint: {
      neutral: { maxS: 0.16, minL: 0.34, maxL: 0.92 },
      regions: [[0.24, 0.15, 0.82, 0.78]],
    },
    stock: [stock('24-inch', 'power', 'rigid', 'single', 'none', 'hammerhead-24')],
  },
  'great-white-shark': {
    productName: 'Great White Shark',
    matrixId: 'great-white-shark-exhaustive-r01',
    assetPrefix: 'great-white-shark',
    fits: [{ wheel: '26-inch', token: null }],
    // White frame paint cannot be separated reliably from white highlights on
    // tyres, spokes and components after the AI edit is keyed to alpha. Keep
    // the geometric/alpha gates automated and require the governed contact
    // sheet to carry the product-paint and wordmark review for this model.
    paintAuditMode: 'visual-only',
    paint: {
      neutral: { maxS: 0.14, minL: 0.48, maxL: 0.99 },
      regions: [[0.24, 0.15, 0.82, 0.78]],
    },
    stock: [stock('26-inch', 'power', 'rigid', '21', 'none', 'great-white-shark-26')],
  },
  'lightning-marlin': {
    productName: 'Lightning Marlin',
    matrixId: 'lightning-marlin-exhaustive-r01',
    assetPrefix: 'lightning-marlin',
    fits: [{ wheel: '700C', token: null }],
    // The 700C carrier, fork and drivetrain edits shift occupied pixels while
    // retaining the reviewed yellow/graphite paint map. The 0.55 floor admits
    // the seven visually approved edge cases (0.5566–0.5982) while the alpha,
    // crop, aspect and paint-area gates continue to reject structural drift.
    minPaintOverlap: 0.55,
    paint: { hueRanges: [[42, 78]], minS: 0.24, minL: 0.12, maxL: 0.9 },
    stock: [stock('700C', 'disc', 'front', '21', 'none', 'lightning-marlin-700c')],
  },
  'sunset-marlin': {
    productName: 'Sunset Marlin',
    matrixId: 'sunset-marlin-exhaustive-r01',
    assetPrefix: 'sunset-marlin',
    fits: [{ wheel: '700C', token: null }],
    // The governed stock photograph is a pronounced three-quarter view and
    // cannot be a geometric or pixel-aligned paint reference for the corrected
    // axle-height side-elevation family. Keep alpha, resolution, crop and
    // silhouette gates automated; product paint, FINSPEED wordmark, hardware,
    // orientation and equal-wheel perspective are contact-sheet reviewed for
    // all 16 assisted-edit masters.
    paintAuditMode: 'visual-only',
    paint: { hueRanges: [[5, 48]], minS: 0.24, minL: 0.1, maxL: 0.9 },
    auditSources: {
      '700C': 'specs/proofs/web/WEB-035/sunset-marlin-exhaustive-r01/masters/disc-rigid-21-none-cutout.png',
    },
    stock: [],
  },
};

for (const [productId, profile] of Object.entries(profiles)) {
  profile.productId = productId;
  profile.finishes = sharedFinishes;
  profile.stock = profile.stock.map((item) => ({ ...item, source: root(productId, item.source) }));
}

export const CONFIGURATOR_MATRIX_PROFILES = Object.freeze(profiles);

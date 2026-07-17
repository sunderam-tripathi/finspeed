const CONFIGURATION_FIELDS = [
  ['base', 'Frame'],
  ['brakes', 'Brakes'],
  ['suspension', 'Suspension'],
  ['gears', 'Gears'],
  ['finish', 'Finish'],
];

function finiteMoney(...values) {
  const value = values.find((candidate) => (
    candidate !== null
    && candidate !== undefined
    && candidate !== ''
    && Number.isFinite(Number(candidate))
  ));
  return value === undefined ? 0 : Number(value);
}

function optionLabel(option, key) {
  if (typeof option === 'string') return option;
  if (!option || typeof option !== 'object') return '';
  const title = option.title || option.label || option.name || option.id || '';
  if (key === 'base' && option.wheels) {
    return [title, option.wheels].filter(Boolean).join(' · ');
  }
  return title;
}

export function configurationEntries(configuration) {
  if (!configuration || typeof configuration !== 'object') return [];
  return CONFIGURATION_FIELDS.flatMap(([key, label]) => {
    const value = optionLabel(configuration[key], key);
    return value ? [{ key, label, value }] : [];
  });
}

export function normalizeOrder(order, catalogue = []) {
  const productById = new Map(catalogue.map((product) => [product.id, product]));
  const items = Array.isArray(order?.items) ? order.items : [];
  const lines = items.map((item, index) => {
    const productId = item?.productId || item?.id || null;
    const product = productById.get(productId) || null;
    const parsedQuantity = Number(item?.quantity ?? item?.qty ?? 1);
    const quantity = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;
    const unitPrice = finiteMoney(item?.unitPrice, item?.price, product?.price);
    const configuration = item?.configuration || null;
    const config = configurationEntries(configuration);
    const standardSpecification = [product?.wheels, product?.speed].filter(Boolean).join(' · ');

    return {
      lineId: item?.lineId || `${productId || 'item'}-${index}`,
      productId,
      product,
      name: item?.name || product?.name || 'Finspeed bicycle',
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
      configuration,
      configurationEntries: config,
      specification: config.map(({ value }) => value).join(' · ') || standardSpecification,
    };
  });
  const calculatedTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const hasProvidedTotal = order?.total !== null && order?.total !== undefined && order?.total !== '';
  const providedTotal = Number(order?.total);

  return {
    ...order,
    items: lines,
    total: hasProvidedTotal && Number.isFinite(providedTotal) ? providedTotal : calculatedTotal,
    calculatedTotal,
  };
}

export function receiptFilename(orderNumber) {
  const safeNumber = String(orderNumber || 'order').replace(/[^a-z0-9-_]/gi, '-');
  return `finspeed-${safeNumber.toLowerCase()}-summary.txt`;
}

export function createOrderReceipt(order, catalogue = [], customer = {}) {
  const normalized = normalizeOrder(order, catalogue);
  const money = (value) => `INR ${Number(value).toLocaleString('en-IN')}`;
  const itemLines = normalized.items.flatMap((line, index) => {
    const detail = line.configurationEntries.length
      ? line.configurationEntries.map(({ label, value }) => `   ${label}: ${value}`)
      : line.specification
        ? [`   Specification: ${line.specification}`]
        : [];
    return [
      `${index + 1}. ${line.name} × ${line.quantity} — ${money(line.lineTotal)}`,
      ...detail,
    ];
  });

  return [
    'FINSPEED',
    'ORDER SUMMARY',
    '',
    `Order: ${normalized.no || 'Pending'}`,
    `Placed: ${normalized.date || 'Not available'}`,
    customer?.name ? `Customer: ${customer.name}` : null,
    customer?.email ? `Email: ${customer.email}` : null,
    '',
    ...itemLines,
    '',
    `Total: ${money(normalized.total)}`,
    normalized.paymentMethod ? `Payment: ${normalized.paymentMethod.toUpperCase()}` : null,
    '',
    'Warranty: 2-year frame warranty.',
    'Service: Two complimentary services within the first six months.',
    'Rider support: support@finspeed.online | WhatsApp +91 96506 08982.',
    'Support hub: https://www.finspeed.online/support.',
  ].filter((line) => line !== null).join('\n');
}

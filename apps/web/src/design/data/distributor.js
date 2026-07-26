// Finspeed Distributor Portal — client-safe presentation helpers only.
// The portal dataset (dealer prices, margins, orders, account, invoices,
// tickets) moved server-side in WEB-039 and is served exclusively by
// /api/distributor/portal behind a session token; nothing price-bearing may
// be exported from this module.
export const distributorProductImage = (id) => `/assets/products/upscaled/${id}-480.webp`;
export const formatInr = (n) => '₹' + Number(n).toLocaleString('en-IN');

// B2B fulfilment stages (index = current step)
export const distributorTrackingStages = ['Confirmed', 'In production', 'Dispatched', 'In transit', 'Delivered'];
// status -> tracking step + badge tone
export const distributorStatus = {
  'Processing': { step: 1, tone: 'neutral' },
  'In transit': { step: 3, tone: 'brand' },
  'Delivered': { step: 4, tone: 'success' },
};

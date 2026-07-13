// Finspeed Distributor Portal — data (from the Consolidated Pricing Matrix, 2024/25)
// margin% is on retail: (retail - dp) / retail
export const distributorProducts = [
  { id:'red-snapper',       model:'Red Snapper',       variant:'24" Non IBC',   series:'Urban',      retail:4800,  dp:3300, margin:31.3, stock:'in' },
  { id:'red-snapper',       model:'Red Snapper',       variant:'26" IBC',       series:'Urban',      retail:5500,  dp:3400, margin:38.2, stock:'in' },
  { id:'sea-breeze',        model:'Sea Breeze',        variant:'26" IBC',       series:'Urban',      retail:5500,  dp:3400, margin:38.2, stock:'in' },
  { id:'hammerhead',        model:'Hammerhead',        variant:'24"',           series:'Street',     retail:6000,  dp:3900, margin:35.0, stock:'in' },
  { id:'great-white-shark', model:'Great White Shark', variant:'26"',           series:'Street',     retail:6300,  dp:4000, margin:36.5, stock:'low' },
  { id:'tiger-shark',       model:'Tiger Shark',       variant:'24"',           series:'Tiger',      retail:6500,  dp:4800, margin:26.2, stock:'in' },
  { id:'tiger-shark',       model:'Tiger Shark',       variant:'26"',           series:'Tiger',      retail:7700,  dp:5500, margin:28.6, stock:'in' },
  { id:'lemon-shark',       model:'Lemon Shark',       variant:'27.5"',         series:'Big Wheel',  retail:8700,  dp:5700, margin:34.5, stock:'in' },
  { id:'lightning-marlin',  model:'Lightning Marlin',  variant:'700C',          series:'Hybrid',     retail:9500,  dp:7000, margin:26.3, stock:'low' },
  { id:'bull-shark',        model:'Bull Shark',        variant:'29"',           series:'Big Wheel',  retail:9500,  dp:5900, margin:37.9, stock:'in' },
  { id:'shark-blue',        model:'Shark Blue',        variant:'26" Geared',    series:'Geared Elite', retail:9700, dp:7000, margin:27.8, stock:'in' },
  { id:'mako-shark',        model:'Mako Shark',        variant:'27.5" Geared',  series:'Geared Elite', retail:10100, dp:7300, margin:27.7, stock:'out' },
  { id:'sunset-marlin',     model:'Sunset Marlin',     variant:'700C Geared',   series:'Hybrid',     retail:10500, dp:7000, margin:33.3, stock:'in' },
];

export const distributorOrders = [
  { no:'PO-2451', date:'12 Jun 2025', units:60,  value:228000, status:'Delivered' },
  { no:'PO-2460', date:'24 Jun 2025', units:35,  value:171500, status:'In transit' },
  { no:'PO-2477', date:'02 Jul 2025', units:48,  value:262400, status:'Processing' },
  { no:'PO-2489', date:'09 Jul 2025', units:24,  value:141600, status:'Processing' },
];

// Credit / account terms for Ravi Stores (Tier 1)
export const distributorAccount = {
  legalName:'Ravi Stores',
  tradeName:'Ravi Cycle Mart',
  gstin:'09AABCR1234F1Z5',
  pan:'AABCR1234F',
  contact:'Ravi Kumar',
  phone:'+91 98100 45678',
  email:'ravi@ravistores.in',
  since:'Mar 2019',
  tier:'Tier 1',
  terms:'Net 30',
  creditLimit:1500000,
  creditUsed:764400,
  billing:{ line1:'Shop No. 14, Sector 18', line2:'Noida, Uttar Pradesh 201301' },
  shipping:{ line1:'Plot 7, Phase 2, Sector 63', line2:'Noida, Uttar Pradesh 201307' },
};

export const distributorTeam = [
  { name:'Ravi Kumar',    role:'Owner',      email:'ravi@ravistores.in',   access:'Full access',      you:true },
  { name:'Anita Sharma',  role:'Purchasing', email:'anita@ravistores.in',  access:'Orders & invoices' },
  { name:'Vikram Singh',  role:'Accounts',   email:'vikram@ravistores.in', access:'Invoices only' },
];

// Invoices (Net-30). paid = amount already settled.
export const distributorInvoices = [
  { no:'INV-8841', issued:'12 May 2025', due:'11 Jun 2025', po:'PO-2451', amount:228000, paid:228000, status:'Paid' },
  { no:'INV-8902', issued:'24 May 2025', due:'23 Jun 2025', po:'PO-2460', amount:171500, paid:171500, status:'Paid' },
  { no:'INV-8967', issued:'02 Jun 2025', due:'02 Jul 2025', po:'PO-2477', amount:262400, paid:0,      status:'Overdue' },
  { no:'INV-9013', issued:'18 Jun 2025', due:'18 Jul 2025', po:'PO-2489', amount:141600, paid:0,      status:'Due' },
  { no:'INV-9056', issued:'28 Jun 2025', due:'28 Jul 2025', po:'PO-2494', amount:98400,  paid:50000,  status:'Partial' },
  { no:'INV-9090', issued:'06 Jul 2025', due:'05 Aug 2025', po:'PO-2501', amount:312000, paid:0,      status:'Due' },
];

// Support
export const distributorRepresentative = {
  name:'Neha Verma',
  title:'Distributor Success Manager',
  phone:'+91 99580 11234',
  email:'neha.verma@finspeed.in',
  sla:'Replies within 4 business hours',
  hours:'Mon–Sat · 9:30–18:30 IST',
};

export const distributorTickets = [
  { id:'TK-3421', subject:'Warranty claim — Mako Shark fork play', category:'Warranty',    status:'In progress', updated:'2 days ago' },
  { id:'TK-3398', subject:'Missing spares carton in PO-2477',      category:'Order issue', status:'Resolved',    updated:'6 days ago' },
  { id:'TK-3375', subject:'GST invoice correction — INV-8902',     category:'Billing',     status:'Resolved',    updated:'12 days ago' },
];

export const distributorFaq = [
  { q:'Warranty & claims', a:'Frames carry a 5-year structural warranty; components 12 months. Raise a Warranty ticket with the model, variant and serial — replacements dispatch ex-works within 5 working days of approval.' },
  { q:'Returns & replacements', a:'Transit-damaged units are replaced free when reported within 48 hours of delivery with photos. Stock returns are accepted within 30 days at 90% of DP for unused, boxed units.' },
  { q:'Spares & accessories ordering', a:'Spares ship against the same Net-30 terms as cycles. Use the Order builder for forks, wheelsets and drivetrain kits, or raise a Spares ticket for items not in the matrix.' },
  { q:'Payment terms & credit', a:'Tier-1 accounts run on Net-30 from invoice date. Credit limits are reviewed quarterly against trailing volume — request an increase through your success manager.' },
  { q:'Dispatch & logistics', a:'All orders dispatch ex-works Greater Noida. FTL freight is arranged on request and billed at actuals; LTL consignments are insured to destination.' },
];

export const distributorProductImage = (id) => '/assets/products/' + id + '.jpg';
export const formatInr = (n) => '₹' + Number(n).toLocaleString('en-IN');

// B2B fulfilment stages (index = current step)
export const distributorTrackingStages = ['Confirmed','In production','Dispatched','In transit','Delivered'];
// status -> tracking step + badge tone
export const distributorStatus = {
  'Processing': { step:1, tone:'neutral' },
  'In transit': { step:3, tone:'brand' },
  'Delivered':  { step:4, tone:'success' },
};
// richer order rows for the Orders screen (lines + ETA)
export const distributorOrderDetails = {
  'PO-2451': { eta:'Delivered 18 Jun', lines:[['bull-shark','29"',30],['red-snapper','24" Non IBC',30]] },
  'PO-2460': { eta:'Arriving 28 Jun', lines:[['tiger-shark','26"',20],['sea-breeze','26" IBC',15]] },
  'PO-2477': { eta:'Ships 27 Jun', lines:[['mako-shark','27.5" Geared',24],['shark-blue','26" Geared',24]] },
  'PO-2489': { eta:'Ships 30 Jun', lines:[['lemon-shark','27.5"',12],['lightning-marlin','700C',12]] },
};

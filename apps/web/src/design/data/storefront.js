// Finspeed storefront — product catalogue (from the 2024/25 catalog)
export const products = [
  { id:'bull-shark', name:'Bull Shark', series:'Big Wheel Series', tag:'mountain', sub:'29" Terrain Dominator',
    price:9500, mrp:11000, rating:4.7, reviews:64, badge:'29 inch', wheels:'29"', speed:'21-Speed', brakes:'Disc',
    desc:'The big-wheel terrain dominator. 29-inch double-walled rims and broad 2.40" rubber flatten everything in their path.',
    colors:['#2f7fb5','#9aa3ab'] },
  { id:'mako-shark', name:'Mako Shark', series:'Geared Elite', tag:'mountain', sub:'27.5" 21-Speed MTB',
    price:10100, mrp:null, rating:4.8, reviews:38, badge:'Flagship', wheels:'27.5"', speed:'21-Speed', brakes:'Disc',
    desc:'Our flagship all-terrain hardtail. Front suspension, disc brakes and a 21-gear combination for total command.',
    colors:['#8fd9c4','#5a6570'] },
  { id:'tiger-shark', name:'Tiger Shark', series:'Tiger Series', tag:'mountain', sub:'Performance Hardtail',
    price:6500, mrp:7200, rating:4.6, reviews:52, badge:null, wheels:'26"', speed:'Single', brakes:'Disc',
    desc:'Performance hardtail with broad 2.40" tyres, front suspension and disc brakes. Built for the trail.',
    colors:['#e8853a','#5a6570'] },
  { id:'lemon-shark', name:'Lemon Shark', series:'Big Wheel Series', tag:'mountain', sub:'27.5" Performance Hardtail',
    price:8200, mrp:null, rating:4.5, reviews:29, badge:null, stock:3, wheels:'27.5"', speed:'Single', brakes:'Disc',
    desc:'Double-walled 27.5" rims and broad tyres. A nimble big-wheel hardtail for the long way round.',
    colors:['#b5c23a','#5a6570'] },
  { id:'great-white-shark', name:'Great White Shark', series:'Street Series', tag:'city', sub:'Grip & Presence',
    price:5800, mrp:null, rating:4.4, reviews:41, badge:null, stock:0, wheels:'26"', speed:'Single', brakes:'Power',
    desc:'Broad Metro 26 × 2.25 tyres for superior grip and street presence. High-tensile steel frame.',
    colors:['#e8eef2','#cfd6dc'] },
  { id:'hammerhead', name:'Hammerhead', series:'Street Series', tag:'city', sub:'Urban Commute Specialist',
    price:5500, mrp:null, rating:4.3, reviews:33, badge:null, wheels:'24"', speed:'Single', brakes:'Power',
    desc:'High-tensile steel frame and steel rims tuned for the daily commute. Tough, simple, dependable.',
    colors:['#7c848c','#3a4651'] },
  { id:'lightning-marlin', name:'Lightning Marlin', series:'Hybrid Series', tag:'hybrid', sub:'700C Single Speed',
    price:9000, mrp:null, rating:4.5, reviews:22, badge:'New', wheels:'700C', speed:'Single', brakes:'Disc',
    desc:'700C double-walled rims, sleek 700×35C tyres and front suspension. Road standards, hybrid attitude.',
    colors:['#e8c93a','#5a6570'] },
  { id:'sunset-marlin', name:'Sunset Marlin', series:'Hybrid Series', tag:'hybrid', sub:'700C 21-Speed',
    price:10000, mrp:null, rating:4.6, reviews:19, badge:'New', wheels:'700C', speed:'21-Speed', brakes:'Disc',
    desc:'Rigid fork for efficiency, Easy Fire shifters and a 3×7 gear set. The quickest way across the city.',
    colors:['#e8623a','#5a6570'] },
  { id:'shark-blue', name:'Shark Blue', series:'Geared Elite', tag:'mountain', sub:'26" Geared All-Terrain',
    price:9700, mrp:null, rating:4.5, reviews:27, badge:null, wheels:'26"', speed:'21-Speed', brakes:'Disc',
    desc:'21-speed all-terrain with high-tensile steel, front suspension and double-walled rims.',
    colors:['#4a90d0','#9aa3ab'] },
  { id:'red-snapper', name:'Red Snapper', series:'Urban Series', tag:'city', sub:'Unisex City Commuter',
    price:4800, mrp:5500, rating:4.2, reviews:58, badge:'Best value', wheels:'24 / 26"', speed:'Single', brakes:'Power',
    desc:'A tarmac-focused unisex commuter with a power brake. Available with an IBC frame-mounted carrier.',
    colors:['#b5302f','#3a4651'] },
  { id:'sea-breeze', name:'Sea Breeze', series:'Urban Series', tag:'city', sub:'Unisex City Cruiser',
    price:4800, mrp:5500, rating:4.3, reviews:47, badge:null, wheels:'24 / 26"', speed:'Single', brakes:'Power',
    desc:'A comfortable step-through city cruiser with single-walled steel rims and an optional carrier.',
    colors:['#2f9b96','#3a4651'] },
];
const PRODUCT_IMAGE_WIDTHS = [480, 960, 1600];
export const productImage = (id, width = 480) => `/assets/products/upscaled/${id}-${width}.webp`;
export const productImageSrcSet = (id) => PRODUCT_IMAGE_WIDTHS
  .map((width) => `${productImage(id, width)} ${width}w`)
  .join(', ');

// Cart storage supports both legacy product-id → quantity entries and richer
// configured-build entries. Keeping the reader backward compatible prevents
// an existing local cart from being lost while giving bespoke builds a real
// line-item identity, unit price, and configuration summary.
export function cartLines(items) {
  if (!items || typeof items !== 'object' || Array.isArray(items)) return [];
  return Object.entries(items).flatMap(([lineId, value]) => {
    const legacy = typeof value === 'number';
    const productId = legacy ? lineId : value?.productId;
    const product = products.find((item) => item.id === productId);
    const quantity = legacy ? value : Number(value?.quantity);
    if (!product || !Number.isFinite(quantity) || quantity <= 0) return [];
    return [{
      lineId,
      product,
      quantity,
      unitPrice: legacy || !Number.isFinite(value?.unitPrice) ? product.price : value.unitPrice,
      configuration: legacy ? null : value.configuration || null,
    }];
  });
}

// Signed-in rider profile + saved addresses (mock)
export const demoUser = {
  name:'Arjun Mehta', email:'arjun.mehta@email.com', phone:'+91 98765 43210', since:'Apr 2024',
};
export const addresses = [
  { id:'a1', label:'Home', name:'Arjun Mehta', line:'Flat 402, Lotus Residency, Sector 50', city:'Noida', state:'Uttar Pradesh', pin:'201301', phone:'+91 98765 43210', primary:true },
  { id:'a2', label:'Work', name:'Arjun Mehta', line:'7th Floor, Tower B, Stellar IT Park, Sector 62', city:'Noida', state:'Uttar Pradesh', pin:'201309', phone:'+91 98765 43210', primary:false },
];
// Order-tracking stages (index = current step)
export const trackingStages = ['Confirmed','Packed','Shipped','Out for delivery','Delivered'];
// Past orders (seeded so the account has history)
export const seedOrders = [
  { no:'FS482190', date:'02 Jun 2026', step:4, eta:'Delivered 06 Jun', items:[{id:'tiger-shark',qty:1}], total:6500 },
  { no:'FS476005', date:'21 May 2026', step:2, eta:'Arriving 27 Jun', items:[{id:'red-snapper',qty:1},{id:'sea-breeze',qty:1}], total:9600 },
];

// Verified Finspeed locations from the governed dealer-location handoff.
// Keep this list intentionally narrow: unverified marketplace listings do not
// belong in the customer-facing visit journey.
export const stores = [
  {
    id: 'sarin-farm',
    name: 'Finspeed Dealer — Sarin Farm',
    type: 'Sales · Test rides · Service',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    addr: 'Shop No. 20, Left Side, Sarin Farm Colony, UPSIDC Site A, Surajpur',
    pin: '201306',
  },
  {
    id: 'krystal-height',
    name: 'Finspeed Dealer — Krystal Height',
    type: 'Sales · Service',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    addr: 'Lower Ground Shop No. 8, Krystal Height Market, behind ACE CITY, Sector 1, Noida Extension, Bisrakh Jalalpur',
    pin: '201306',
  },
];

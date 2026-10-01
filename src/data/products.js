const img = (f) => `/assets/images/${f}`

// roast / pack dates are relative to today so tins never read as weeks old
const ago = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).replace(',', '')
}
export const freshDate = (n = 2) => ago(n)

export const FLAVOURS = {
  plain: { name: 'Classic Plain', color: '#EADBC0', tint: 'rgba(234,219,192,0.55)', dot: '/assets/icons/dot-plain.svg' },
  roasted: { name: 'Roasted & Salted', color: '#B77A3E', tint: 'rgba(183,122,62,0.22)', dot: '/assets/icons/dot-roasted.svg' },
  pepper: { name: 'Pepper & Salt', color: '#4A4A48', tint: 'rgba(74,74,72,0.22)', dot: '/assets/icons/dot-pepper.svg' },
  chilli: { name: 'Chilli Garlic', color: '#B8322A', tint: 'rgba(184,50,42,0.22)' },
  honey: { name: 'Honey Glazed', color: '#D9A23A', tint: 'rgba(217,162,58,0.22)', dot: '/assets/icons/dot-honey.svg' },
  chettinad: { name: 'Chettinad Masala', color: '#8C3B1F', tint: 'rgba(140,59,31,0.22)', dot: '/assets/icons/dot-chettinad.svg' },
  mint: { name: 'Mint & Lime', color: '#5E8C5A', tint: 'rgba(94,140,90,0.22)' },
}

// Prices from Figma 02 · Home bestseller shelf. Extra pack sizes are placeholders [confirm].
export const PRODUCTS = [
  {
    id: 'w240-classic-plain',
    name: 'W240 Classic Plain',
    grade: 'W240',
    flavour: 'plain',
    style: 'Raw',
    rating: 4.8,
    reviews: 212,
    roasted: ago(2),
    image: img('w240-plain.png'),
    defaultGrams: 250, // cards show this pack; the product page lists all four
    sizes: [
      { grams: 100, price: 149 },
      { grams: 250, price: 349 },
      { grams: 500, price: 679 },
      { grams: 1000, price: 1299 },
    ],
  },
  {
    id: 'chettinad-masala',
    name: 'Chettinad Masala',
    grade: 'W240',
    flavour: 'chettinad',
    style: 'Oil roasted',
    rating: 4.8,
    reviews: 212,
    roasted: ago(4),
    image: img('chettinad.png'),
    sizes: [
      { grams: 100, price: 229 },
      { grams: 250, price: 549 },
    ],
  },
  {
    id: 'roasted-salted',
    name: 'Roasted & Salted',
    grade: 'W240',
    flavour: 'roasted',
    style: 'Dry roasted',
    rating: 4.8,
    reviews: 212,
    roasted: ago(2),
    image: img('roasted-salted.png'),
    sizes: [
      { grams: 250, price: 379 },
      { grams: 500, price: 739 },
    ],
  },
  {
    id: 'w180-king-whole',
    name: 'W180 King Whole',
    grade: 'W180',
    flavour: 'plain',
    style: 'Raw',
    rating: 4.9,
    reviews: 98,
    roasted: ago(2),
    image: img('mood-snacking.png'),
    sizes: [
      { grams: 250, price: 549 },
      { grams: 500, price: 1079 },
      { grams: 1000, price: 2099, soldOut: true }, // demo of the 16f "out of stock" state
    ],
  },
  {
    id: 'honey-glazed',
    name: 'Honey Glazed',
    grade: 'W240',
    flavour: 'honey',
    style: 'Glazed',
    rating: 4.8,
    reviews: 212,
    roasted: ago(3),
    image: img('honey-glazed.png'),
    sizes: [
      { grams: 100, price: 249 },
      { grams: 250, price: 599 },
    ],
  },
  {
    id: 'pepper-salt',
    name: 'Pepper & Salt',
    grade: 'W240',
    flavour: 'pepper',
    style: 'Oil roasted',
    rating: 4.8,
    reviews: 212,
    roasted: ago(3),
    image: img('roasted-salted.png'),
    sizes: [
      { grams: 100, price: 239 },
      { grams: 250, price: 569 },
    ],
  },
]

// Figma 03 · Shop all — the listing carries two more flavours and the W320 grade.
// Extra pack sizes, ratings and diet tags are placeholders [confirm].
export const SHOP_ONLY_PRODUCTS = [
  {
    id: 'chilli-garlic',
    name: 'Chilli Garlic',
    grade: 'W240',
    flavour: 'chilli',
    style: 'Oil roasted',
    diet: ['Vegan', 'Gluten free'],
    rating: 4.8,
    reviews: 212,
    roasted: ago(3),
    image: img('chettinad.png'),
    sizes: [
      { grams: 100, price: 239 },
      { grams: 250, price: 569 },
    ],
  },
  {
    id: 'mint-lime',
    name: 'Mint & Lime',
    grade: 'W240',
    flavour: 'mint',
    style: 'Dry roasted',
    diet: ['Vegan', 'Gluten free'],
    rating: 4.8,
    reviews: 212,
    roasted: ago(5),
    image: img('honey-glazed.png'),
    sizes: [
      { grams: 100, price: 239 },
      { grams: 250, price: 569 },
    ],
  },
  {
    id: 'w320-everyday',
    name: 'W320 Everyday',
    grade: 'W320',
    flavour: 'plain',
    style: 'Raw',
    diet: ['Vegan', 'Gluten free'],
    rating: 4.8,
    reviews: 212,
    roasted: ago(2),
    dateLabel: 'Packed',
    image: img('w240-plain.png'),
    sizes: [
      { grams: 500, price: 449 },
      { grams: 1000, price: 869 },
    ],
  },
]

// Home bestseller shelf keeps its six; the shop lists everything
export const BESTSELLERS = PRODUCTS
const ALL_PRODUCTS = [...PRODUCTS, ...SHOP_ONLY_PRODUCTS]
const SHOP_ORDER = [
  'w240-classic-plain',
  'w180-king-whole',
  'roasted-salted',
  'chettinad-masala',
  'honey-glazed',
  'chilli-garlic',
  'mint-lime',
  'w320-everyday',
  'pepper-salt',
]
export const ALL_PRODUCTS_LIST = ALL_PRODUCTS
export const SHOP_PRODUCTS = SHOP_ORDER.map((id) => ALL_PRODUCTS.find((p) => p.id === id))

export const defaultSize = (p) => p.sizes.find((s) => s.grams === p.defaultGrams) ?? p.sizes[0]

// Cart lookups cover every product, including ones the shop page doesn't list (Pepper & Salt)
export const getProduct = (id) => ALL_PRODUCTS.find((p) => p.id === id)

// One upsell used by both the drawer and the cart page, so they no longer disagree
export const UPSELL = { productId: 'honey-glazed', grams: 100 }

// value = flat ₹ off, percent = % off (capped by max); minSubtotal = minimum cart value
export const COUPONS = {
  DIWALI100: { code: 'DIWALI100', value: 100, freeDelivery: true, minSubtotal: 499 },
  FIRST10: { code: 'FIRST10', percent: 10, max: 150, minSubtotal: 299 },
  PONGAL50: { code: 'PONGAL50', expired: '20 Jan' },
}

export const FREE_DELIVERY_AT = 999 //
export const DELIVERY_FEE = 49 //
export const COD_LIMIT = 5000 //

// Pincodes starting with these digits are treated as not serviceable (demo of 16f state)
export const UNSERVICEABLE_PREFIXES = ['79']

export const SAVED_ADDRESSES = [
  {
    id: 'home',
    label: 'Home',
    name: 'Ragul S',
    line1: '12, 3rd Cross St',
    area: 'Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
  },
  {
    id: 'office',
    label: 'Office',
    name: 'Ragul S',
    line1: 'Tidel Park',
    area: 'Taramani',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600113',
  },
]

// ── Pricing helpers shared by the builder, subscriptions and grade guide ──────────────────────────────
// ₹ per 100 g for a flavour at (or nearest below) a pack size, from the catalogue's own packs
export function unitPer100(flavour, grams = 100) {
  const sizes = ALL_PRODUCTS.filter((p) => p.flavour === flavour).flatMap((p) => p.sizes.filter((s) => !s.soldOut))
  const fit = sizes.filter((s) => s.grams <= grams)
  const pool = fit.length ? fit : sizes
  return Math.min(...pool.map((s) => (s.price / s.grams) * 100))
}

// price of one 100 g slot in the gift builder: the flavour's smallest pack, scaled to 100 g
export function slotPrice(flavour) {
  const sizes = ALL_PRODUCTS.filter((p) => p.flavour === flavour).flatMap((p) => p.sizes)
  const s = sizes.reduce((a, b) => (b.grams < a.grams ? b : a))
  return Math.round((s.price / s.grams) * 100)
}

// cheapest ₹/100 g actually on sale for a grade, or null when the grade isn't sold online
export function gradeFromPer100(grade) {
  const sizes = ALL_PRODUCTS.filter((p) => p.grade === grade).flatMap((p) => p.sizes.filter((s) => !s.soldOut))
  return sizes.length ? Math.min(...sizes.map((s) => (s.price / s.grams) * 100)) : null
}

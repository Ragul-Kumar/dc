const img = (f) => `/assets/images/${f}`

export const FLAVOURS = {
  plain: { name: 'Classic Plain', color: '#EADBC0', dot: '/assets/icons/dot-plain.svg' },
  roasted: { name: 'Roasted & Salted', color: '#B77A3E', dot: '/assets/icons/dot-roasted.svg' },
  pepper: { name: 'Pepper & Salt', color: '#4A4A48', dot: '/assets/icons/dot-pepper.svg' },
  chilli: { name: 'Chilli Garlic', color: '#B8322A' },
  honey: { name: 'Honey Glazed', color: '#D9A23A', dot: '/assets/icons/dot-honey.svg' },
  chettinad: { name: 'Chettinad Masala', color: '#8C3B1F', dot: '/assets/icons/dot-chettinad.svg' },
  mint: { name: 'Mint & Lime', color: '#5E8C5A' },
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
    roasted: '12 Sep',
    image: img('w240-plain.png'),
    sizes: [
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
    roasted: '10 Sep',
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
    roasted: '12 Sep',
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
    roasted: '12 Sep',
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
    roasted: '11 Sep',
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
    roasted: '11 Sep',
    image: img('roasted-salted.png'),
    sizes: [
      { grams: 100, price: 239 },
      { grams: 250, price: 569 },
    ],
  },
]

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id)

// One upsell used by both the drawer and the cart page, so they no longer disagree
export const UPSELL = { productId: 'honey-glazed', grams: 100 }

export const COUPONS = {
  DIWALI100: { code: 'DIWALI100', value: 100, freeDelivery: true },
  PONGAL50: { code: 'PONGAL50', expired: '20 Jan' },
}

export const FREE_DELIVERY_AT = 999 // [confirm threshold]
export const DELIVERY_FEE = 49 // [confirm]
export const COD_LIMIT = 5000 // [confirm]

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

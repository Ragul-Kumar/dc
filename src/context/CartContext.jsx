import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  COUPONS,
  DELIVERY_FEE,
  FREE_DELIVERY_AT,
  SAVED_ADDRESSES,
  getProduct,
} from '@/data/products'

const STORAGE_KEY = 'durai-cart-v2'
const LEGACY_KEY = 'durai-cart-v1'
const SCHEMA = 2

export const GIFT_WRAP_FEE = 49
export const SUBSCRIBE_DISCOUNT = 0.1
export const BUNDLE_DISCOUNT = 0.15
export const BUNDLE_SIZE = 3
export const MAX_QTY = 20
export const MAX_QTY_GIFT = 500
// boxes bought together → % off gift lines (matches the Gifting hub "Ordering 25 or more?" slabs)
export const VOLUME_SLABS = [
  [50, 0.1],
  [25, 0.05],
]

const initialCheckout = {
  mobile: '+91 98410 12345',
  email: '',
  addressId: 'home',
  newAddress: null,
  saveAddress: true,
  gift: { enabled: false, message: '', recipient: '', phone: '', hidePrices: true, wrap: false },
  gst: { enabled: false, gstin: '', company: '' },
  whatsapp: true,
  payment: 'upi',
  upiId: '',
  billingSame: true,
  billing: { name: '', pincode: '', line1: '' },
  deliveryDate: '',
}

const initialState = {
  v: SCHEMA,
  items: [], // { productId, grams, qty, sub?, bundle?, custom? }
  coupon: null, // code string
  drawerOpen: false,
  checkout: initialCheckout,
  extraAddresses: [], // addresses added from the account page
  order: null,
}

const sameLine = (a, b) =>
  a.productId === b.productId && a.grams === b.grams && (a.sub ?? 0) === (b.sub ?? 0) && !!a.bundle === !!b.bundle

const isGiftLine = (i) => !!i.custom && /^(gift|builder):/.test(i.productId)
const maxQty = (i) => (i.custom ? MAX_QTY_GIFT : MAX_QTY)

// custom line → the same product shape the cart UI already renders
const customProduct = (c) => ({
  id: c.id,
  name: c.name,
  grade: 'GIFT',
  flavour: 'gift',
  style: 'Gift box',
  image: c.image ?? '/assets/images/bowl-wood.png',
  sizes: [{ grams: c.grams, price: c.price }],
})

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const exists = state.items.find((i) => sameLine(i, action.item))
      const cap = maxQty(action.item)
      const items = exists
        ? state.items.map((i) => (sameLine(i, action.item) ? { ...i, qty: Math.min(cap, i.qty + action.item.qty) } : i))
        : [...state.items, { ...action.item, qty: Math.min(cap, action.item.qty) }]
      return { ...state, items, drawerOpen: action.openDrawer ?? true }
    }
    case 'qty':
      return {
        ...state,
        items: state.items
          .map((i) => (sameLine(i, action.item) ? { ...i, qty: Math.min(maxQty(i), action.qty) } : i))
          .filter((i) => i.qty > 0),
      }
    case 'size': {
      // Change pack size; merge if that size is already in the cart
      const { item, grams } = action
      if (grams === item.grams) return state // same size: nothing to do (never drops the line)
      const target = { ...item, grams }
      const other = state.items.find((i) => sameLine(i, target))
      return {
        ...state,
        items: other
          ? state.items
              .filter((i) => !sameLine(i, item))
              .map((i) => (sameLine(i, target) ? { ...i, qty: Math.min(maxQty(i), i.qty + item.qty) } : i))
          : state.items.map((i) => (sameLine(i, item) ? target : i)),
      }
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => !sameLine(i, action.item)) }
    case 'coupon':
      return { ...state, coupon: action.code }
    case 'drawer':
      return { ...state, drawerOpen: action.open }
    case 'checkout':
      return { ...state, checkout: { ...state.checkout, ...action.patch } }
    case 'addAddress':
      return { ...state, extraAddresses: [...state.extraAddresses, action.address] }
    case 'placeOrder':
      // keep contact + payment preferences; clear one-off gift / GST details so the next order starts clean
      return {
        ...state,
        order: action.order,
        items: [],
        coupon: null,
        checkout: {
          ...state.checkout,
          gift: initialCheckout.gift,
          gst: initialCheckout.gst,
          billingSame: true,
          billing: initialCheckout.billing,
          deliveryDate: '',
        },
      }
    default:
      return state
  }
}

// Stored carts from older builds are merged field-by-field so new keys always exist
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY)
    const saved = raw ? JSON.parse(raw) : null
    if (!saved) return initialState
    return {
      ...initialState,
      ...saved,
      v: SCHEMA,
      drawerOpen: false,
      checkout: {
        ...initialCheckout,
        ...saved.checkout,
        gift: { ...initialCheckout.gift, ...saved.checkout?.gift },
        gst: { ...initialCheckout.gst, ...saved.checkout?.gst },
        billing: { ...initialCheckout.billing, ...saved.checkout?.billing },
      },
      extraAddresses: saved.extraAddresses ?? [],
    }
  } catch {
    return initialState
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      const { drawerOpen, ...rest } = state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch {
      /* storage unavailable — cart still works in memory */
    }
  }, [state])

  const value = useMemo(() => {
    const lines = state.items
      .map((i) => {
        const product = i.custom ? customProduct(i.custom) : getProduct(i.productId)
        const size = product?.sizes.find((s) => s.grams === i.grams)
        if (!product || !size) return null
        // subscription lines are 10% off the pack price
        const price = i.sub ? Math.round(size.price * (1 - SUBSCRIBE_DISCOUNT)) : size.price
        return { ...i, product, price, listPrice: size.price, total: price * i.qty }
      })
      .filter(Boolean)

    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.total, 0)

    // tasting-trio bundle: 3+ bundle packs → 15% off those packs
    const bundleLines = lines.filter((l) => l.bundle)
    const bundleUnits = bundleLines.reduce((n, l) => n + l.qty, 0)
    const bundleDiscount =
      bundleUnits >= BUNDLE_SIZE ? Math.round(bundleLines.reduce((n, l) => n + l.total, 0) * BUNDLE_DISCOUNT) : 0

    // gift boxes: 25+ → 5%, 50+ → 10%
    const giftLines = lines.filter(isGiftLine)
    const giftUnits = giftLines.reduce((n, l) => n + l.qty, 0)
    const volumeRate = VOLUME_SLABS.find(([min]) => giftUnits >= min)?.[1] ?? 0
    const volumeDiscount = Math.round(giftLines.reduce((n, l) => n + l.total, 0) * volumeRate)

    const afterOffers = subtotal - bundleDiscount - volumeDiscount
    const giftWrap = state.checkout.gift.wrap ? GIFT_WRAP_FEE : 0

    // coupon: must be unexpired and the cart must meet its minimum
    const coupon = state.coupon ? COUPONS[state.coupon] : null
    const couponLive = !!coupon && !coupon.expired
    const belowMin = couponLive && afterOffers < (coupon.minSubtotal ?? 0)
    const couponOk = couponLive && !belowMin
    const discount = couponOk
      ? Math.min(coupon.percent ? Math.min(Math.round((afterOffers * coupon.percent) / 100), coupon.max ?? Infinity) : coupon.value, afterOffers)
      : 0
    const couponIssue = !coupon
      ? null
      : coupon.expired
        ? `${coupon.code} expired on ${coupon.expired}.`
        : belowMin
          ? `Add ${coupon.minSubtotal - afterOffers > 0 ? `₹${coupon.minSubtotal - afterOffers}` : 'more'} to use ${coupon.code} (minimum ₹${coupon.minSubtotal}).`
          : null

    const freeDelivery = subtotal >= FREE_DELIVERY_AT || (couponOk && !!coupon.freeDelivery)
    const delivery = lines.length === 0 || freeDelivery ? 0 : DELIVERY_FEE
    const total = afterOffers - discount + giftWrap + delivery

    const allAddresses = [...SAVED_ADDRESSES, ...state.extraAddresses]
    const address =
      state.checkout.addressId === 'new'
        ? state.checkout.newAddress
        : allAddresses.find((a) => a.id === state.checkout.addressId)

    const clamp = (n) => Math.max(0, n)
    return {
      ...state,
      lines,
      count,
      allAddresses,
      couponIssue,
      totals: {
        subtotal,
        bundleDiscount,
        volumeDiscount,
        volumeRate,
        giftWrap,
        discount,
        delivery,
        total: clamp(total),
        freeDelivery,
        toFree: Math.max(0, FREE_DELIVERY_AT - subtotal),
      },
      address,
      add: (productId, grams, qty = 1, openDrawer, opts = {}) =>
        dispatch({ type: 'add', item: { productId, grams, qty, ...opts }, openDrawer }),
      // Gift boxes and builder boxes aren't in the product list: the line carries its own details
      addCustom: (custom, qty = 1, openDrawer) =>
        dispatch({ type: 'add', item: { productId: custom.id, grams: custom.grams, qty, custom }, openDrawer }),
      setQty: (item, qty) => dispatch({ type: 'qty', item, qty }),
      setSize: (item, grams) => dispatch({ type: 'size', item, grams }),
      remove: (item) => dispatch({ type: 'remove', item }),
      applyCoupon: (code) => {
        const c = COUPONS[code.trim().toUpperCase()]
        if (!c) return { ok: false, error: `${code.toUpperCase()} is not a valid code.` }
        if (c.expired) return { ok: false, error: `${c.code} expired on ${c.expired}. Discount removed.` }
        if (afterOffers < (c.minSubtotal ?? 0))
          return { ok: false, error: `${c.code} needs a cart of at least ₹${c.minSubtotal}. Add ₹${c.minSubtotal - afterOffers} more.` }
        dispatch({ type: 'coupon', code: c.code })
        return { ok: true }
      },
      removeCoupon: () => dispatch({ type: 'coupon', code: null }),
      setDrawer: (open) => dispatch({ type: 'drawer', open }),
      updateCheckout: (patch) => dispatch({ type: 'checkout', patch }),
      addAddress: (address) => dispatch({ type: 'addAddress', address }),
      placeOrder: (order) => dispatch({ type: 'placeOrder', order }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

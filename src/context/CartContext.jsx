import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  COUPONS,
  DELIVERY_FEE,
  FREE_DELIVERY_AT,
  SAVED_ADDRESSES,
  getProduct,
} from '@/data/products'

const STORAGE_KEY = 'durai-cart-v1'

const initialCheckout = {
  mobile: '+91 98410 12345',
  email: '',
  addressId: 'home',
  newAddress: null,
  saveAddress: true,
  gift: { enabled: false, message: '', recipient: '', phone: '', hidePrices: true },
  gst: { enabled: false, gstin: '', company: '' },
  whatsapp: true,
  payment: 'upi',
  upiId: '',
  billingSame: true,
}

const initialState = {
  items: [], // { productId, grams, qty }
  coupon: null, // code string
  drawerOpen: false,
  checkout: initialCheckout,
  order: null,
}

const sameLine = (a, b) => a.productId === b.productId && a.grams === b.grams

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const exists = state.items.find((i) => sameLine(i, action.item))
      const items = exists
        ? state.items.map((i) => (sameLine(i, action.item) ? { ...i, qty: i.qty + action.item.qty } : i))
        : [...state.items, action.item]
      return { ...state, items, drawerOpen: action.openDrawer ?? true }
    }
    case 'qty':
      return {
        ...state,
        items: state.items
          .map((i) => (sameLine(i, action.item) ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      }
    case 'size': {
      // Change pack size; merge if that size is already in the cart
      const { item, grams } = action
      const target = { ...item, grams }
      const other = state.items.find((i) => sameLine(i, target))
      let items = state.items.filter((i) => !sameLine(i, item))
      items = other
        ? items.map((i) => (sameLine(i, target) ? { ...i, qty: i.qty + item.qty } : i))
        : state.items.map((i) => (sameLine(i, item) ? target : i))
      return { ...state, items }
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => !sameLine(i, action.item)) }
    case 'coupon':
      return { ...state, coupon: action.code }
    case 'drawer':
      return { ...state, drawerOpen: action.open }
    case 'checkout':
      return { ...state, checkout: { ...state.checkout, ...action.patch } }
    case 'placeOrder':
      return { ...state, order: action.order, items: [], coupon: null }
    default:
      return state
  }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved ? { ...initialState, ...saved, drawerOpen: false } : initialState
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
        const product = getProduct(i.productId)
        const size = product?.sizes.find((s) => s.grams === i.grams)
        return product && size ? { ...i, product, price: size.price, total: size.price * i.qty } : null
      })
      .filter(Boolean)

    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.total, 0)
    const coupon = state.coupon ? COUPONS[state.coupon] : null
    const discount = coupon && !coupon.expired ? Math.min(coupon.value, subtotal) : 0
    const freeDelivery = subtotal >= FREE_DELIVERY_AT || !!coupon?.freeDelivery
    const delivery = lines.length === 0 || freeDelivery ? 0 : DELIVERY_FEE
    const total = subtotal - discount + delivery

    const address =
      state.checkout.addressId === 'new'
        ? state.checkout.newAddress
        : SAVED_ADDRESSES.find((a) => a.id === state.checkout.addressId)

    return {
      ...state,
      lines,
      count,
      totals: {
        subtotal,
        discount,
        delivery,
        total,
        freeDelivery,
        toFree: Math.max(0, FREE_DELIVERY_AT - subtotal),
      },
      address,
      add: (productId, grams, qty = 1, openDrawer) =>
        dispatch({ type: 'add', item: { productId, grams, qty }, openDrawer }),
      setQty: (item, qty) => dispatch({ type: 'qty', item, qty }),
      setSize: (item, grams) => dispatch({ type: 'size', item, grams }),
      remove: (item) => dispatch({ type: 'remove', item }),
      applyCoupon: (code) => {
        const c = COUPONS[code.trim().toUpperCase()]
        if (!c) return { ok: false, error: `${code.toUpperCase()} is not a valid code.` }
        if (c.expired) return { ok: false, error: `${c.code} expired on ${c.expired}. Discount removed.` }
        dispatch({ type: 'coupon', code: c.code })
        return { ok: true }
      },
      removeCoupon: () => dispatch({ type: 'coupon', code: null }),
      setDrawer: (open) => dispatch({ type: 'drawer', open }),
      updateCheckout: (patch) => dispatch({ type: 'checkout', patch }),
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

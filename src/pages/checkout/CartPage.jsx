import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icon } from '@/components/shared/Icon'
import { QtyStepper } from '@/components/shared/QtyStepper'
import { ProductThumb } from '@/components/shared/ProductThumb'
import { FreeDeliveryBar } from '@/components/cart/FreeDeliveryBar'
import { UpsellCard } from '@/components/cart/UpsellCard'
import { CheckoutLayout, SummaryCard } from '@/components/checkout/CheckoutLayout'
import { PriceLines } from '@/components/checkout/PriceLines'
import { OutOfStock, PincodeNotServiceable } from '@/components/checkout/states/CheckoutStates'
import { useCart } from '@/context/CartContext'
import { COUPONS, FLAVOURS } from '@/data/products'
import { deliveryDate, grams, inr, perHundred } from '@/lib/format'
import { lookupPincode } from '@/lib/pincode'
import { cn } from '@/lib/utils'

// Figma "16b · Checkout — Cart" (26:3485)
export default function CartPage() {
  const cart = useCart()
  const navigate = useNavigate()
  const { lines, count, totals, coupon } = cart

  if (lines.length === 0) return <EmptyCart />

  const blocked = lines.some((l) => isSoldOut(l))

  return (
    <CheckoutLayout
      step={0}
      main={
        <>
          <FreeDeliveryBar variant="page" />
          <Card>
            <CardHeader>
              <CardTitle>
                Your cart ({count} {count === 1 ? 'item' : 'items'})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col pt-5">
              {lines.map((l, i) => (
                <CartLine key={`${l.productId}-${l.grams}`} line={l} last={i === lines.length - 1} />
              ))}
            </CardContent>
          </Card>
          <CouponCard />
          <UpsellCard variant="page" />
        </>
      }
      aside={
        <SummaryCard>
          <h2 className="font-display text-2xl font-semibold">Price details</h2>
          <PriceLines totals={totals} count={count} coupon={coupon} />
          <Button
            variant="gold"
            className="h-14 w-full text-base text-night"
            disabled={blocked}
            onClick={() => navigate('/checkout/delivery')}
          >
            Continue to delivery details
          </Button>
          {blocked && <p className="text-center text-xs text-error">Sort out the sold-out item to continue.</p>}
          <PincodeCheck />
        </SummaryCard>
      }
    />
  )
}

const isSoldOut = (l) => l.product.sizes.find((s) => s.grams === l.grams)?.soldOut

function CartLine({ line, last }) {
  const { setQty, setSize, remove, add } = useCart()
  const flavour = FLAVOURS[line.product.flavour]
  const soldOut = isSoldOut(line)

  // Suggest the largest in-stock size that divides the requested weight
  const alt = soldOut
    ? line.product.sizes
        .filter((s) => !s.soldOut && s.grams < line.grams && line.grams % s.grams === 0)
        .sort((a, b) => b.grams - a.grams)[0]
    : null
  const swap = alt && { grams: alt.grams, price: alt.price, qty: (line.grams / alt.grams) * line.qty }

  return (
    <div className={cn('flex flex-col gap-4 py-[18px] first:pt-0', !last && 'border-b border-line')}>
      <div className="flex items-start gap-4 sm:items-center sm:gap-[18px]">
        <ProductThumb src={line.product.image} size={96} className="!size-[72px] rounded-[14px] sm:!size-24" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <p className="text-base font-bold sm:text-lg">{line.product.name}</p>
            <div className="flex flex-col items-end gap-0.5 sm:hidden">
              <p className="text-lg font-bold">{inr(line.total)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="grade">{line.product.grade}</Badge>
            <span className="size-2.5 shrink-0 rounded-full border border-line" style={{ background: flavour.color }} />
            <span className="truncate text-xs font-medium text-muted-foreground">{flavour.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Select value={String(line.grams)} onValueChange={(v) => setSize(line, Number(v))}>
              <SelectTrigger className="w-[92px]" aria-label="Pack size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {line.product.sizes.map((s) => (
                  <SelectItem
                    key={s.grams}
                    value={String(s.grams)}
                    disabled={s.soldOut && s.grams !== line.grams}
                    hint={s.soldOut ? 'sold out' : undefined}
                  >
                    {grams(s.grams)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <QtyStepper size="md" value={line.qty} onChange={(q) => setQty(line, q)} />
            <button onClick={() => remove(line)} aria-label={`Remove ${line.product.name}`} className="p-1">
              <Icon name="trash" size={18} />
            </button>
          </div>
        </div>
        <div className="hidden flex-col items-end gap-0.5 sm:flex">
          <p className="text-xl font-bold">{inr(line.total)}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{perHundred(line.price, line.grams)}</p>
        </div>
      </div>

      {soldOut && (
        <OutOfStock
          line={line}
          swap={swap}
          onSwap={() => {
            remove(line)
            add(line.productId, swap.grams, swap.qty, false)
          }}
          onRemove={() => remove(line)}
        />
      )}
    </div>
  )
}

function CouponCard() {
  const { coupon, applyCoupon, removeCoupon, totals } = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [showList, setShowList] = useState(false)

  const apply = (c = code) => {
    if (!c.trim()) return
    const res = applyCoupon(c)
    setError(res.ok ? '' : res.error)
    if (res.ok) setCode('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupon</CardTitle>
        <button onClick={() => setShowList((s) => !s)} className="text-[13px] font-bold text-primary underline">
          View available coupons
        </button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-5">
        {coupon ? (
          <div className="flex items-center gap-3 rounded-xl bg-mint px-4 py-3.5 text-leaf">
            <Icon name="tag" size={18} />
            <div className="flex-1">
              <p className="text-sm font-bold">{coupon} applied</p>
              <p className="text-[13px]">You saved {inr(totals.discount)} on this order</p>
            </div>
            <button onClick={removeCoupon} className="text-[13px] font-bold text-roast underline">
              Remove
            </button>
          </div>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                apply()
              }}
              className={cn(
                'flex h-12 items-center rounded-input border bg-white pr-3.5',
                error ? 'border-[1.5px] border-error' : 'border-line'
              )}
            >
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError('')
                }}
                placeholder="Enter coupon code"
                aria-label="Coupon code"
                aria-invalid={!!error}
                className="h-full flex-1 bg-transparent px-3.5 font-mono text-sm uppercase outline-none placeholder:normal-case"
              />
              <button type="submit" className="text-[13px] font-bold text-primary">
                Apply
              </button>
            </form>
            {error && (
              <p className="flex items-center gap-1.5 text-[13px] font-medium text-error" role="alert">
                <Icon name="alert-error" size={16} />
                {error}
              </p>
            )}
          </>
        )}

        {showList && (
          <ul className="flex flex-col gap-2">
            {Object.values(COUPONS).map((c) => (
              <li key={c.code} className="flex items-center justify-between rounded-xl border border-dashed border-line p-3">
                <div>
                  <p className="font-mono text-sm">{c.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.expired ? `Expired ${c.expired}` : `₹${c.value} off + free delivery`}
                  </p>
                </div>
                {!c.expired && coupon !== c.code && (
                  <Button size="xs" variant="secondary" onClick={() => apply(c.code)}>
                    Apply
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function PincodeCheck() {
  const { address, checkout, updateCheckout } = useCart()
  const [editing, setEditing] = useState(false)
  const [pin, setPin] = useState(checkout.checkPincode ?? address?.pincode ?? '')
  const info = lookupPincode(pin)

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-ivory p-3.5">
      {editing ? (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (info.valid) {
              updateCheckout({ checkPincode: pin })
              setEditing(false)
            }
          }}
        >
          <Input
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            aria-label="Pincode"
            className="h-10 font-mono text-sm"
          />
          <Button size="xs" type="submit" className="h-10">
            Check
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <Icon name="pin" size={16} />
          <span className="font-mono text-sm">{pin || '—'}</span>
          <button onClick={() => setEditing(true)} className="text-xs font-bold text-primary underline">
            Change
          </button>
        </div>
      )}
      {!editing && info.valid && info.serviceable && (
        <p className="text-[13px] font-medium text-success">Estimated delivery: {deliveryDate()}</p>
      )}
      {!editing && info.valid && !info.serviceable && <PincodeNotServiceable pincode={pin} />}
    </div>
  )
}

function EmptyCart() {
  return (
    <CheckoutLayout
      step={0}
      main={
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Icon name="bag" size={40} />
            <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
            <p className="text-muted-foreground">Graded whole cashews, roasted fresh this week.</p>
            <Button asChild>
              <Link to="/">Shop cashews</Link>
            </Button>
          </CardContent>
        </Card>
      }
      aside={null}
    />
  )
}

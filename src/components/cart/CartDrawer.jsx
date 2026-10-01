import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/shared/Icon'
import { QtyStepper } from '@/components/shared/QtyStepper'
import { ProductThumb } from '@/components/shared/ProductThumb'
import { FreeDeliveryBar } from './FreeDeliveryBar'
import { UpsellCard } from './UpsellCard'
import { useCart } from '@/context/CartContext'
import { grams, inr } from '@/lib/format'

// Figma "16a · Slide-out cart" (26:3395)
export function CartDrawer() {
  const { drawerOpen, setDrawer, lines, count, totals, setQty, remove, checkout, updateCheckout } = useCart()
  const [noteOpen, setNoteOpen] = useState(!!checkout.gift.message)
  const navigate = useNavigate()

  const goCheckout = () => {
    setDrawer(false)
    navigate('/checkout/cart')
  }

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawer}>
      <SheetContent className="gap-0 p-0">
        <div className="px-6 pb-4 pt-6">
          <SheetTitle>Your cart ({count})</SheetTitle>
          <SheetDescription className="sr-only">Items in your cart</SheetDescription>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <Icon name="bag" size={40} />
            <p className="font-display text-2xl font-semibold">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Start with our bestselling W240 Classic Plain.</p>
            <Button onClick={() => setDrawer(false)}>Shop cashews</Button>
          </div>
        ) : (
          <>
            <FreeDeliveryBar />

            <div className="flex-1 overflow-y-auto">
              <ul className="flex flex-col gap-3 px-6 py-2">
                {lines.map((l) => (
                  <li key={`${l.productId}-${l.grams}-${l.sub ?? 0}-${l.bundle ? "b" : ""}`} className="flex items-center gap-3.5 rounded-2xl bg-white p-3">
                    <ProductThumb src={l.product.image} size={72} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <p className="truncate text-[15px] font-bold">{l.product.name}</p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="grade">{l.product.grade}</Badge>
                        <span className="font-mono text-xs text-muted-foreground">{grams(l.grams)}</span>
                        {l.sub ? <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-leaf">every {l.sub} wk</span> : null}
                        {l.bundle ? <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-bold">trio</span> : null}
                      </div>
                      <div className="flex items-center gap-3">
                        <QtyStepper value={l.qty} max={l.custom ? 500 : 20} onChange={(q) => setQty(l, q)} />
                        <button onClick={() => remove(l)} aria-label={`Remove ${l.product.name}`}>
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="font-mono text-[15px] font-medium">{inr(l.total)}</p>
                  </li>
                ))}
              </ul>

              <div className="px-6 py-2">
                <button onClick={() => setNoteOpen((o) => !o)} className="flex items-center gap-2.5 text-sm font-bold underline">
                  <Icon name="gift" size={18} />
                  Add a gift note
                </button>
                {noteOpen && (
                  <textarea
                    value={checkout.gift.message}
                    onChange={(e) =>
                      updateCheckout({ gift: { ...checkout.gift, enabled: !!e.target.value.trim(), message: e.target.value } })
                    }
                    placeholder="Happy Deepavali, Amma!"
                    rows={2}
                    className="mt-3 w-full rounded-input border border-line bg-white p-3 text-sm outline-none focus:border-roast"
                  />
                )}
              </div>

              <div className="px-6 py-2">
                <UpsellCard />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-line bg-white px-6 pb-7 pt-5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[17px]">Subtotal</span>
                <span className="text-xl">{inr(totals.subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Coupons and delivery calculated at checkout</p>
              <Button className="w-full" onClick={goCheckout}>
                Checkout · {inr(totals.subtotal)}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

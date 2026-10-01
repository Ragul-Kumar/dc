import { FREE_DELIVERY_AT } from '@/data/products'
import { inr } from '@/lib/format'
import { Icon } from '@/components/shared/Icon'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

// One source of truth for the threshold, so drawer and cart page always agree
export function FreeDeliveryBar({ variant = 'drawer' }) {
  const { totals, coupon } = useCart()
  const pct = totals.freeDelivery ? 100 : Math.min(100, (totals.subtotal / FREE_DELIVERY_AT) * 100)
  const unlockedByCoupon = totals.freeDelivery && totals.subtotal < FREE_DELIVERY_AT

  const message = totals.freeDelivery
    ? unlockedByCoupon
      ? `Free delivery unlocked with ${coupon}`
      : 'You’ve unlocked free delivery'
    : `Add ${inr(totals.toFree)} more for free delivery`

  if (variant === 'page') {
    return (
      <div className={cn('flex flex-col gap-2 rounded-2xl px-5 py-4', totals.freeDelivery ? 'bg-mint' : 'bg-sand')}>
        <div className="flex items-center gap-2">
          <Icon name="truck-green" size={18} />
          <p className="text-sm font-bold text-leaf">{message}</p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-[3px] bg-line">
          <div className="h-full rounded-[3px] bg-leaf transition-all" style={{ width: `${pct}%` }} />
        </div>
        {!totals.freeDelivery && (
          <p className="font-mono text-[11px] text-muted-foreground">
            {inr(totals.subtotal)} of {inr(FREE_DELIVERY_AT)}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-6 pb-4">
      <p className="text-[13px] font-bold">{message}</p>
      <div className="h-2 overflow-hidden rounded bg-line">
        <div className="h-full rounded bg-leaf transition-all" style={{ width: `${pct}%` }} />
      </div>
      {!totals.freeDelivery && (
        <p className="font-mono text-[11px] text-muted-foreground">
          {inr(totals.subtotal)} of {inr(FREE_DELIVERY_AT)}
        </p>
      )}
    </div>
  )
}

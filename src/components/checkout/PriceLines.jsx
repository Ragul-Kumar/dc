import { Separator } from '@/components/ui/separator'
import { inr } from '@/lib/format'

// Subtotal / offers / coupon / delivery / total rows shared by every summary card
export function PriceLines({ totals, count, coupon, totalLabel = 'Total', showSavings = true }) {
  const savings = totals.discount + totals.bundleDiscount + totals.volumeDiscount
  return (
    <div className="flex flex-col gap-4">
      <Row label={`Subtotal (${count} ${count === 1 ? 'item' : 'items'})`} value={inr(totals.subtotal)} />
      {totals.bundleDiscount > 0 && <Row label="Tasting trio · 15% off" value={`−${inr(totals.bundleDiscount)}`} className="text-success" />}
      {totals.volumeDiscount > 0 && (
        <Row label={`Bulk gifting · ${Math.round(totals.volumeRate * 100)}% off`} value={`−${inr(totals.volumeDiscount)}`} className="text-success" />
      )}
      {totals.discount > 0 && <Row label={`Coupon ${coupon}`} value={`−${inr(totals.discount)}`} className="text-success" />}
      {totals.giftWrap > 0 && <Row label="Gift wrap & handwritten note" value={inr(totals.giftWrap)} />}
      <Row
        label="Delivery"
        value={totals.delivery === 0 ? 'Free' : inr(totals.delivery)}
        className={totals.delivery === 0 ? 'text-success' : ''}
      />
      <Separator />
      <div className="flex items-center justify-between font-bold">
        <span className="text-[17px]">{totalLabel}</span>
        <span className="text-xl">{inr(totals.total)}</span>
      </div>
      {showSavings && savings > 0 && <p className="text-[13px] font-medium text-success">You save {inr(savings)} on this order</p>}
    </div>
  )
}

function Row({ label, value, className = '' }) {
  return (
    <div className={`flex items-center justify-between text-[15px] ${className}`}>
      <span>{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  )
}

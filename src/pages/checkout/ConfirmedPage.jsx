import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@/components/shared/Icon'
import { CheckoutLayout, SummaryCard } from '@/components/checkout/CheckoutLayout'
import { SummaryItems } from '@/components/checkout/SummaryItems'
import { PriceLines } from '@/components/checkout/PriceLines'
import { useCart } from '@/context/CartContext'
import { printDocument } from '@/lib/print'
import { deliveryDate, inr, shortAddress } from '@/lib/format'
import { cn } from '@/lib/utils'

// Figma "16e · Order confirmed" (27:3840)
export default function ConfirmedPage() {
  const { order } = useCart()
  const [copied, setCopied] = useState('') // '' | 'ok' | 'failed'
  // a confirmation older than a day is history, not a live page: send people to order tracking instead
  const stale = order && Date.now() - new Date(order.placedAt).getTime() > 24 * 60 * 60 * 1000
  if (!order) return <Navigate to="/" replace />
  if (stale) return <Navigate to={`/track-order?order=${order.id}`} replace />

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${referral}`)
      setCopied('ok')
    } catch {
      setCopied('failed')
    }
    setTimeout(() => setCopied(''), 2000)
  }

  const downloadInvoice = () =>
    printDocument(`Invoice ${order.id}`, [
      {
        heading: 'Order',
        rows: [
          ['Order number', order.id],
          ['Placed', new Date(order.placedAt).toLocaleString('en-IN')],
          ['Payment', order.paidVia],
          ['Deliver to', order.gift?.hidePrices && order.gift?.enabled ? shortAddress(order.address) : shortAddress(order.address)],
          ...(order.gst ? [['GSTIN', `${order.gst.gstin} · ${order.gst.company || ''}`]] : []),
        ],
      },
      {
        heading: 'Items',
        rows: order.lines.map((l) => [
          `${l.product.name} · ${l.grams >= 1000 ? l.grams / 1000 + ' kg' : l.grams + ' g'} × ${l.qty}`,
          order.gift?.enabled && order.gift?.hidePrices ? '—' : inr(l.total),
        ]),
      },
      {
        heading: 'Totals',
        rows: order.gift?.enabled && order.gift?.hidePrices
          ? [['Prices hidden — gift invoice', '']]
          : [
              ['Subtotal', inr(order.totals.subtotal)],
              ...(order.totals.discount ? [[`Coupon ${order.coupon}`, `−${inr(order.totals.discount)}`]] : []),
              ...(order.totals.giftWrap ? [['Gift wrap', inr(order.totals.giftWrap)]] : []),
              ['Delivery', order.totals.delivery ? inr(order.totals.delivery) : 'Free'],
              ['Total', inr(order.totals.total)],
            ],
      },
    ])

  const cod = order.paidVia === 'Cash on Delivery'
  const firstName = order.address.name.split(' ')[0]
  const time = new Date(order.placedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  const eta = deliveryDate(3)
  const referral = `duraicashew.in/r/${firstName.toUpperCase()}100`

  const stages = [
    { label: 'Confirmed', when: `Today, ${time}`, icon: 'check-timeline', done: true },
    { label: 'Packed', when: 'Tomorrow', icon: 'box' },
    { label: 'Shipped', when: deliveryDate(2).split(',')[0], icon: 'truck-muted' },
    { label: 'Delivered', when: eta, icon: 'home-muted' },
  ]

  return (
    <CheckoutLayout
      main={
        <>
          <section className="flex flex-col gap-3 rounded-3xl bg-leaf p-6 md:p-9">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-success">
                <Icon name="check-lg-white" size={22} />
              </span>
              <span lang="ta" className="font-tamil text-xl font-semibold text-gold">நன்றி</span>
            </div>
            <h1 className="max-w-[760px] font-display text-[30px] font-semibold leading-[1.15] text-ivory md:text-h2">
              Nandri, {firstName}! Your order is confirmed.
            </h1>
            <div className="flex flex-wrap gap-2.5">
              {[`Order ${order.id}`, `${cod ? 'To pay' : 'Total paid'} ${inr(order.totals.total)}`, cod ? 'Cash on Delivery' : `Paid via ${order.paidVia}`].map((c) => (
                <span key={c} className="rounded-full bg-ivory/[0.12] px-3.5 py-2 font-mono text-[13px] text-ivory">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link to={`/track-order?order=${order.id}`}>Track order</Link>
              </Button>
              <Button variant="onDark" asChild>
                <Link to="/">Continue shopping</Link>
              </Button>
              <button type="button" onClick={downloadInvoice} className="flex items-center gap-1.5 text-sm font-bold text-sand underline">
                <Icon name="download" size={16} />
                Download invoice
              </button>
            </div>
          </section>

          <Card>
            <CardHeader className="flex-wrap">
              <CardTitle>Delivery and status</CardTitle>
              <p className="text-sm font-bold text-success">Arriving {eta}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-[18px] pt-[18px]">
              <ol className="flex items-start">
                {stages.map((s, i) => (
                  <li key={s.label} className={cn('flex items-start', i > 0 && 'flex-1')}>
                    {i > 0 && <span className="mt-5 h-0.5 flex-1 bg-line" aria-hidden />}
                    <div className="flex w-[72px] flex-col items-center gap-2 text-center sm:w-24">
                      <span
                        className={cn(
                          'flex size-10 items-center justify-center rounded-full border',
                          s.done ? 'border-leaf bg-leaf' : 'border-line bg-white'
                        )}
                      >
                        <Icon name={s.icon} size={18} />
                      </span>
                      <span className={cn('text-[13px] font-bold sm:text-sm', !s.done && 'text-muted-foreground')}>
                        {s.label}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">{s.when}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="text-sm text-muted-foreground">
                Deliver to: {shortAddress(order.address)}
                {order.gift.enabled && order.gift.recipient && ` · gift for ${order.gift.recipient}`}
              </p>
            </CardContent>
          </Card>

          {order.whatsapp && (
            <div className="flex items-center gap-3 rounded-2xl bg-mint p-[18px]">
              <Icon name="wa-lg" size={22} />
              <div>
                <p className="text-sm font-bold">WhatsApp updates are on</p>
                <p className="text-[13px] text-muted-foreground">
                  You agreed at delivery details. We’ll message {order.mobile}.
                </p>
              </div>
            </div>
          )}

          {cod && (
            <div className="flex items-center gap-3 rounded-2xl bg-sand p-[18px]">
              <Icon name="cash" size={22} />
              <p className="text-sm font-medium">
                Pay {inr(order.totals.total)} in cash or UPI when your cashews arrive.
              </p>
            </div>
          )}
        </>
      }
      aside={
        <>
          <SummaryCard>
            <h2 className="font-display text-2xl font-semibold">Order summary</h2>
            <SummaryItems lines={order.lines} />
            <Separator />
            <PriceLines
              totals={order.totals}
              count={order.count}
              coupon={order.coupon}
              totalLabel={cod ? 'To pay on delivery' : 'Total paid'}
              showSavings={false}
            />
          </SummaryCard>

          <div className="flex flex-col gap-3 rounded-3xl bg-night p-7">
            <Icon name="gift-gold" size={28} />
            <h3 className="font-display text-[28px] font-semibold text-ivory">Give ₹100, get ₹100</h3>
            <p className="text-sm leading-[1.55] text-sand">
              Share your link. When a friend orders, you both get ₹100 off.
            </p>
            <div className="flex w-fit max-w-full items-center gap-2 rounded-full bg-ivory/10 px-4 py-2.5 text-[13px]">
              <span className="truncate font-mono text-ivory">{referral}</span>
              <button type="button" className="font-bold text-gold" onClick={copyLink} aria-live="polite">
                {copied === 'ok' ? 'Copied' : copied === 'failed' ? 'Copy failed' : 'Copy'}
              </button>
            </div>
          </div>
        </>
      }
    />
  )
}

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { useCart } from '@/context/CartContext'
import { SITE, whatsappUrl } from '@/data/site'
import { grams, inr, shortAddress } from '@/lib/format'
import { cn } from '@/lib/utils'

// Figma 18 · Track order (39:8692). Your own orders track from what was placed on this device; DC-10482 is a
// sample shipment. Timeline dates are always relative to when the order was placed — never hard-coded.
const digits = (s) => s.replace(/\D/g, '')

const SAMPLE = {
  id: 'DC-10482',
  placedAt: () => Date.now() - 3 * 86400000, // sample order placed three days ago
  paid: 'Paid ₹798 via UPI',
  recipient: 'Lakshmi S (gift) · 12, 3rd Cross St, Adyar, Chennai 600040',
  hidePrices: true,
  items: [
    ['w240-plain.png', 'W240 Classic Plain', '250 g'],
    ['mood-snacking.png', 'W320 Everyday', '500 g'],
  ],
}

// event times as offsets from the order time
const EVENTS = [
  ['Order confirmed', 0, (o) => o.paid ?? 'Payment received'],
  ['Roasted & packed', 1.0, () => 'Batch coded, freshly roasted'],
  ['Shipped', 1.3, () => 'Handed to the courier'],
  ['Out for delivery', 3.0, () => 'With your local hub'],
  ['Delivered', 3.4, () => 'Delivered'],
]

const fmt = (t) => new Date(t).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

function buildTimeline(placedAt, order, now = Date.now()) {
  const steps = EVENTS.map(([title, days, meta], i) => {
    const at = placedAt + days * 86400000
    return { title, at, meta: meta(order), done: now >= at, i }
  })
  const current = steps.findLastIndex((s) => s.done)
  return { steps, current }
}

export default function TrackOrderPage() {
  const { order: placed } = useCart()
  const [params] = useSearchParams()
  const paramOrder = (params.get('order') ?? '').toUpperCase()
  const ownMatches = placed && placed.id === paramOrder

  const [orderNo, setOrderNo] = useState(paramOrder)
  const [phone, setPhone] = useState(ownMatches ? placed.mobile : '')
  const [result, setResult] = useState(() => (ownMatches ? resolve(paramOrder, placed.mobile, placed) : null))

  const track = (e) => {
    e.preventDefault()
    setResult(resolve(orderNo.trim().toUpperCase(), phone, placed))
  }

  return (
    <>
      <section className="bg-sand">
        <div className="page-x mx-auto flex max-w-[1440px] flex-col items-start gap-5 pb-[72px] pt-14 lg:pt-[88px]">
          <p className="eyebrow">TRACK ORDER</p>
          <h1 className="font-display text-[40px] font-semibold leading-[1.1] md:text-h1">Where are my cashews?</h1>
          <p className="text-body-l">No login needed — just your order number and phone.</p>
          <form onSubmit={track} className="flex w-full max-w-[860px] flex-col gap-2 rounded-[28px] bg-white p-2 md:flex-row md:items-center md:gap-3 md:rounded-full">
            <input
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="DC-10482"
              aria-label="Order number"
              required
              className="h-[52px] min-w-0 flex-1 bg-transparent px-5 font-mono text-base focus:outline-none md:max-w-[280px]"
            />
            <span className="hidden h-7 w-px bg-line md:block" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98410 12345"
              aria-label="Phone number"
              type="tel"
              required
              className="h-[52px] min-w-0 flex-1 border-t border-line bg-transparent px-5 font-mono text-base focus:outline-none md:max-w-[260px] md:border-0 md:px-4"
            />
            <Button type="submit">Track</Button>
          </form>
        </div>
      </section>

      {!result && (
        <section className="page-x mx-auto max-w-[1440px] py-[88px]">
          <p className="max-w-[560px] text-body-l text-muted-foreground">
            Enter the order number from your confirmation message (it looks like DC-10482) and the phone number you used at checkout.
          </p>
        </section>
      )}

      {result?.error && (
        <section className="page-x mx-auto max-w-[1440px] py-[88px]">
          <p role="alert" className="max-w-[640px] rounded-card border border-line bg-white p-6">
            {result.error}
          </p>
        </section>
      )}

      {result?.order && <Result o={result.order} />}
    </>
  )
}

function resolve(no, phone, placed) {
  if (!/^DC-\d{4,6}$/.test(no)) return { error: `“${no}” doesn’t look like an order number. Order numbers look like DC-10482.` }
  if (digits(phone).length < 10) return { error: 'Enter the 10-digit phone number you used at checkout.' }
  if (placed && placed.id === no) {
    if (digits(placed.mobile).slice(-10) !== digits(phone).slice(-10)) return { error: 'That phone number doesn’t match this order.' }
    return {
      order: {
        id: no,
        placedAt: new Date(placed.placedAt).getTime(),
        paid: `${placed.paidVia === 'Cash on Delivery' ? 'Cash on delivery' : `Paid ${inr(placed.totals.total)} via ${placed.paidVia}`}`,
        recipient: shortAddress(placed.address),
        hidePrices: placed.gift?.enabled && placed.gift?.hidePrices,
        items: placed.lines.map((l) => [l.product.image.split('/').pop(), l.product.name, grams(l.grams)]),
      },
    }
  }
  if (no === SAMPLE.id) return { order: { ...SAMPLE, placedAt: SAMPLE.placedAt() } }
  return { error: `We couldn’t find ${no} for that phone number. Check the confirmation email or WhatsApp message, or message us.` }
}

function Result({ o }) {
  const { steps, current } = buildTimeline(o.placedAt, o)
  const delivered = current === steps.length - 1
  const eta = new Date(o.placedAt + 3.4 * 86400000)
  const today = new Date()
  const sameDay = eta.toDateString() === today.toDateString()

  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-[88px] lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6 rounded-3xl border border-line bg-white p-6 md:p-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-[30px] font-semibold md:text-4xl">{steps[Math.max(current, 0)].title}</h2>
            <p className="text-[15px] font-medium text-success">
              Order {o.id} · {delivered ? 'Delivered' : sameDay ? 'Arriving today by 7 pm' : `Arriving ${eta.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`}
            </p>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-mint px-5 py-3 text-leaf">
            <span className="text-[11px] font-bold tracking-[0.12em]">{sameDay ? 'TODAY' : delivered ? 'DELIVERED' : 'ETA'}</span>
            <span className="font-display text-2xl font-semibold">{eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        <ol>
          {steps.map((s, i) => {
            const state = i < current || (i === current && delivered) ? 'done' : i === current ? 'now' : 'todo'
            return (
              <li key={s.title} className="flex gap-[18px]">
                <div className="flex flex-col items-center">
                  {state === 'done' && (
                    <span className="flex size-7 items-center justify-center rounded-full bg-leaf">
                      <Icon name="track-check" size={14} />
                    </span>
                  )}
                  {state === 'now' && <Icon name="track-dot" size={28} />}
                  {state === 'todo' && <span className="size-7 rounded-full border-2 border-line bg-white" />}
                  {i < steps.length - 1 && <span className={cn('h-10 w-0.5', state === 'done' ? 'bg-leaf' : 'bg-line')} />}
                </div>
                <div className={cn('flex flex-col gap-1 pb-3', state === 'todo' && 'text-muted-foreground')}>
                  <p className="text-base font-bold">{s.title}</p>
                  <p className="font-mono text-xs font-medium">
                    {state === 'todo' ? `Expected ${fmt(s.at)}` : `${fmt(s.at)} · ${s.meta}`}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <aside className="flex w-full flex-col gap-4 lg:w-[420px] lg:shrink-0">
        <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-7">
          <h2 className="font-display text-2xl font-semibold">Delivering to</h2>
          <p className="text-sm leading-[1.55]">{o.recipient}</p>
          {o.hidePrices && <p className="text-xs font-bold text-leaf">Prices hidden on invoice</p>}
        </div>
        <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-7">
          <h2 className="font-display text-2xl font-semibold">In this box</h2>
          {o.items.map(([img, name, size]) => (
            <div key={name + size} className="flex items-center gap-3">
              <img src={`/assets/images/${img}`} alt="" className="size-11 rounded-lg object-contain" />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold">{name}</p>
                <p className="font-mono text-xs text-muted-foreground">{size}</p>
              </div>
            </div>
          ))}
        </div>
        <a href={whatsappUrl(`Hi Durai Cashew, about order ${o.id}`)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-card bg-roast p-5 text-ivory">
          <Icon name="wa-22" size={22} />
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold">Something wrong?</span>
            <span className="text-[13px] text-sand">WhatsApp us with {o.id}{SITE.phone ? ` or call ${SITE.phone}` : ''}</span>
          </span>
        </a>
      </aside>
    </section>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/shared/Icon'
import { useCart } from '@/context/CartContext'
import { lookupPincode } from '@/lib/pincode'
import { inr } from '@/lib/format'
import { cn } from '@/lib/utils'

// Figma 17 · Account (39:8533). Demo customer — wire to a real auth/orders API.
const NAV = [
  ['acc-box', 'Orders', '#orders'],
  ['acc-repeat', 'Subscriptions', '#subscription'],
  ['acc-home', 'Addresses', '#addresses'],
  ['acc-coin', 'Durai Coins', '#coins'],
  ['acc-gift', 'Gift reminders', '#reminders'],
  ['acc-user', 'Profile', '#profile'],
]
const DEMO_ORDERS = [
  { no: 'DC-10482', img: 'w240-plain.png', title: 'W240 Classic Plain + W320 Everyday', meta: `24 Sep 2026 · ${inr(349 + 449)}`, status: 'Confirmed', track: true },
  { no: 'DC-10311', img: 'chettinad.png', title: 'Chettinad Masala × 2', meta: '02 Sep 2026 · ₹458', status: 'Delivered', reorder: ['chettinad-masala', 100, 2] },
  { no: 'DC-10107', img: 'mood-snacking.png', title: 'W180 King Whole · 500 g', meta: '14 Aug 2026 · ₹1,079', status: 'Delivered', reorder: ['w180-king-whole', 500, 1] },
]
const OCC_KEY = 'durai-occasions-v1'
const DEFAULT_OCCASIONS = [
  { icon: 'acc-cal', title: 'Deepavali', when: '1 Nov · reminder on 18 Oct' },
  { icon: 'acc-gift-sm', title: 'Amma’s birthday', when: '12 Nov · reminder on 2 Nov' },
  { icon: 'acc-bell', title: 'Pongal', when: '14 Jan · reminder on 1 Jan' },
]
const loadOccasions = () => {
  try {
    return JSON.parse(localStorage.getItem(OCC_KEY)) ?? DEFAULT_OCCASIONS
  } catch {
    return DEFAULT_OCCASIONS
  }
}

const card = 'flex flex-col gap-4 rounded-card border border-line bg-white p-7'
const cardTitle = 'font-display text-2xl font-semibold'
const inputCls = 'h-11 w-full rounded-input border border-line bg-white px-3 text-sm focus-visible:border-roast focus-visible:outline-none'

export default function AccountPage() {
  const { add, order, allAddresses, addAddress } = useCart()
  const [skipped, setSkipped] = useState(false)
  const [paused, setPaused] = useState(false)
  const [addingAddress, setAddingAddress] = useState(false)
  const [occasions, setOccasions] = useState(loadOccasions)
  const [addingOccasion, setAddingOccasion] = useState(false)

  // a just-placed order shows first
  const orders = [
    ...(order
      ? [{ no: order.id, img: order.lines[0]?.product.image.split('/').pop(), title: order.lines.map((l) => l.product.name).join(' + '), meta: `${new Date(order.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · ${inr(order.totals.total)}`, status: 'Confirmed', track: true }]
      : []),
    ...DEMO_ORDERS,
  ]

  const saveOccasion = (o) => {
    const next = [...occasions, o]
    setOccasions(next)
    try {
      localStorage.setItem(OCC_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
    setAddingOccasion(false)
  }

  return (
    <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 pb-24 pt-12 lg:flex-row lg:gap-10">
      <nav aria-label="Account" className="flex h-fit w-full gap-1 overflow-x-auto rounded-card border border-line bg-white p-3 lg:w-[260px] lg:shrink-0 lg:flex-col lg:overflow-visible">
        {NAV.map(([icon, label, href], i) => (
          <a
            key={label}
            href={href}
            className={cn('flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-[15px]', i === 0 ? 'bg-sand font-bold' : 'font-medium hover:bg-sand/60')}
          >
            <Icon name={icon} size={20} />
            {label}
          </a>
        ))}
      </nav>

      <div id="profile" className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-[36px] font-semibold md:text-5xl">Vanakkam, Ragul</h1>
          <p className="text-[15px] text-muted-foreground">
            Member since Aug 2026 · {orders.length} orders
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section id="coins" className="flex scroll-mt-28 flex-col gap-4 rounded-card bg-night p-7">
            <h2 className="font-display text-2xl font-semibold text-ivory">Durai Coins</h2>
            <p className="font-display text-[64px] font-semibold leading-none text-gold">420</p>
            <p className="max-w-[360px] text-sm leading-normal text-sand">= ₹42 off your next order · 1 coin per ₹10 spent, 50 for a photo review</p>
          </section>

          <section id="subscription" className={cn(card, 'scroll-mt-28')}>
            <div className="flex items-center justify-between">
              <h2 className={cardTitle}>Subscription</h2>
              <span className={cn('text-xs font-bold', paused ? 'text-muted-foreground' : 'text-success')}>{paused ? 'Paused' : 'Active'}</span>
            </div>
            <div className="flex items-center gap-3">
              <img src="/assets/images/w240-plain.png" alt="" className="size-14 rounded-[10px] object-contain" />
              <div className="flex flex-col gap-0.5">
                <p className="text-[15px] font-bold">500 g · 3 flavours · every 4 weeks</p>
                <p className="font-mono text-xs font-medium text-muted-foreground">
                  {paused ? 'No box scheduled' : `Next box ships ${skipped ? 'in 8 weeks' : 'in 2 weeks'}`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ['acc-skip', skipped ? 'Skipped' : 'Skip next', () => setSkipped(true), skipped || paused],
                ['acc-pause', paused ? 'Resume' : 'Pause', () => setPaused((p) => !p), false],
                ['acc-edit', 'Edit flavours', null, false],
              ].map(([icon, label, onClick, disabled]) =>
                onClick ? (
                  <button key={label} type="button" onClick={onClick} disabled={disabled} className="flex items-center gap-1.5 rounded-full border border-line py-2 pl-3 pr-3.5 text-[13px] font-bold hover:border-roast disabled:opacity-50">
                    <Icon name={icon} size={14} />
                    {label}
                  </button>
                ) : (
                  <Link key={label} to="/subscribe#plan" className="flex items-center gap-1.5 rounded-full border border-line py-2 pl-3 pr-3.5 text-[13px] font-bold hover:border-roast">
                    <Icon name={icon} size={14} />
                    {label}
                  </Link>
                )
              )}
            </div>
          </section>
        </div>

        <section id="orders" className={cn(card, 'scroll-mt-28')}>
          <div className="flex items-center justify-between">
            <h2 className={cardTitle}>Your orders</h2>
            <Link to="/track-order" className="text-[13px] font-bold text-primary underline">
              Track an order
            </Link>
          </div>
          {orders.map((o, i) => (
            <div key={o.no} className={cn('flex flex-wrap items-center gap-4 py-4', i < orders.length - 1 && 'border-b border-line')}>
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-ivory">
                <img src={`/assets/images/${o.img ?? 'w240-plain.png'}`} alt="" className="size-[54px] object-contain" />
              </div>
              <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-medium">{o.no}</span>
                  <span className={cn('rounded-full bg-mint px-2.5 py-[3px] text-[11px] font-bold', o.status === 'Delivered' ? 'text-success' : 'text-leaf')}>{o.status}</span>
                </div>
                <p className="text-sm font-medium">{o.title}</p>
                <p className="font-mono text-xs font-medium text-muted-foreground">{o.meta}</p>
              </div>
              {o.track ? (
                <Link to={`/track-order?order=${o.no}`} className="flex h-11 w-[140px] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-roast text-sm font-bold hover:bg-roast hover:text-ivory">
                  <Icon name="acc-truck" size={16} />
                  Track
                </Link>
              ) : (
                <button type="button" onClick={() => add(...o.reorder)} className="flex h-11 w-[140px] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-roast text-sm font-bold hover:bg-roast hover:text-ivory">
                  <Icon name="acc-repeat-sm" size={16} />
                  Reorder
                </button>
              )}
            </div>
          ))}
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section id="addresses" className={cn(card, 'scroll-mt-28')}>
            <div className="flex items-center justify-between">
              <h2 className={cardTitle}>Saved addresses</h2>
              <button type="button" onClick={() => setAddingAddress((a) => !a)} className="text-[13px] font-bold text-primary underline">
                {addingAddress ? 'Cancel' : '+ Add'}
              </button>
            </div>
            {allAddresses.map((a, i) => (
              <div key={a.id} className="flex flex-col gap-1 rounded-xl bg-ivory p-3.5">
                <p className="text-sm font-bold">
                  {a.label}
                  {i === 0 && ' · default'}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {a.line1}, {a.area}, {a.city} {a.pincode}
                </p>
              </div>
            ))}
            {addingAddress && (
              <AddressForm
                onSave={(a) => {
                  addAddress({ ...a, id: `acc-${Date.now()}` })
                  setAddingAddress(false)
                }}
              />
            )}
          </section>

          <section id="reminders" className={cn(card, 'scroll-mt-28')}>
            <div className="flex items-center justify-between">
              <h2 className={cardTitle}>Gift reminders</h2>
              <button type="button" onClick={() => setAddingOccasion((a) => !a)} className="text-[13px] font-bold text-primary underline">
                {addingOccasion ? 'Cancel' : '+ Add occasion'}
              </button>
            </div>
            {occasions.map((o) => (
              <div key={o.title} className="flex items-center gap-3">
                <Icon name={o.icon} size={20} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold">{o.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">{o.when}</p>
                </div>
              </div>
            ))}
            {addingOccasion && <OccasionForm onSave={saveOccasion} />}
          </section>
        </div>
      </div>
    </div>
  )
}

function AddressForm({ onSave }) {
  const [a, setA] = useState({ label: '', name: '', line1: '', area: '', pincode: '' })
  const [error, setError] = useState('')
  const pin = lookupPincode(a.pincode)
  const set = (patch) => {
    setA((x) => ({ ...x, ...patch }))
    setError('')
  }

  const submit = (e) => {
    e.preventDefault()
    if (!a.name.trim() || !a.line1.trim()) return setError('Add a name and the house number / street.')
    if (!pin.valid) return setError('Enter a 6-digit pincode.')
    if (!pin.serviceable) return setError(`We can’t deliver to ${a.pincode} yet.`)
    onSave({
      label: a.label.trim() || 'Other',
      name: a.name.trim(),
      line1: a.line1.trim(),
      area: a.area.trim() || pin.place?.district || '',
      city: pin.place?.city ?? '',
      state: pin.place?.state ?? '',
      pincode: a.pincode,
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5 rounded-xl border border-dashed border-line p-3.5">
      <input aria-label="Label" placeholder="Label (Home, Office…)" value={a.label} onChange={(e) => set({ label: e.target.value })} className={inputCls} />
      <input aria-label="Full name" placeholder="Full name" value={a.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} />
      <input aria-label="Address line" placeholder="House no., street" value={a.line1} onChange={(e) => set({ line1: e.target.value })} className={inputCls} />
      <div className="grid grid-cols-2 gap-2.5">
        <input aria-label="Area" placeholder="Area" value={a.area} onChange={(e) => set({ area: e.target.value })} className={inputCls} />
        <input aria-label="Pincode" placeholder="Pincode" inputMode="numeric" value={a.pincode} onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} className={cn(inputCls, 'font-mono')} />
      </div>
      {error && (
        <p className="text-xs font-medium text-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="h-11 rounded-full bg-primary text-sm font-bold text-primary-foreground">
        Save address
      </button>
    </form>
  )
}

function OccasionForm({ onSave }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!title.trim() || !date) return
    const d = new Date(date)
    const remind = new Date(d)
    remind.setDate(remind.getDate() - 14)
    const fmt = (x) => x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    onSave({ icon: 'acc-gift-sm', title: title.trim(), when: `${fmt(d)} · reminder on ${fmt(remind)}` })
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5 rounded-xl border border-dashed border-line p-3.5">
      <input aria-label="Occasion" placeholder="Occasion (e.g. Anniversary)" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      <input aria-label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={cn(inputCls, 'font-mono')} />
      <button type="submit" disabled={!title.trim() || !date} className="h-11 rounded-full bg-primary text-sm font-bold text-primary-foreground disabled:opacity-50">
        Save reminder
      </button>
    </form>
  )
}

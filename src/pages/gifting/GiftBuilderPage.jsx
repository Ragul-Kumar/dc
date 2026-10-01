import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { FLAVOURS, slotPrice } from '@/data/products'
import { deliveryDate, inr } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

// Figma 08 · Gift box builder (39:6187). Box prices are placeholders [confirm].
const BOXES = [
  { id: 'brass', name: 'Brass-finish tin', note: '4, 6 or 9 slots', prices: { 4: 199, 6: 299, 9: 399 } },
  { id: 'wood', name: 'Wooden box', note: '6 or 9 slots', prices: { 6: 449, 9: 599 } },
  { id: 'kraft', name: 'Kraft box', note: '4 or 6 slots', prices: { 4: 99, 6: 149 } },
  { id: 'drawer', name: 'Premium drawer', note: '9 or 12 slots', prices: { 9: 799, 12: 999 } },
]
const STEPS = ['Choose a box', 'Fill flavours', 'Personalise', 'Review & date']
const SLOT_GRAMS = 100
const PHOTO_CARD = 49
const MAX_MESSAGE = 200
// one 100 g slot costs what that flavour's smallest catalogue pack costs, so builder and shop prices agree
const flavourPrice = (key) => slotPrice(key)
const STORAGE_KEY = 'durai-builder-v2'
// short stable string hash — keeps two different messages of the same length on separate cart lines
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7).toString(36)

const initial = { box: 'brass', slots: 6, fills: [], message: '', sender: '', photoCard: false, boxes: 1 }
const load = () => {
  try {
    return { ...initial, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }
  } catch {
    return initial
  }
}

export default function GiftBuilderPage() {
  const { addCustom } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [cfg, setCfg] = useState(load)
  const [savedAt, setSavedAt] = useState(null)
  const patch = (p) => setCfg((c) => ({ ...c, ...p }))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
      setSavedAt(new Date())
    } catch {
      /* storage unavailable — the builder still works */
    }
  }, [cfg])

  const box = BOXES.find((b) => b.id === cfg.box)
  const slots = cfg.slots
  const fills = cfg.fills.slice(0, slots)
  const counts = useMemo(() => fills.reduce((m, k) => ({ ...m, [k]: (m[k] ?? 0) + 1 }), {}), [fills])
  const flavourTotal = fills.reduce((n, k) => n + flavourPrice(k), 0)
  const boxPrice = box.prices[slots]
  const extras = cfg.photoCard ? PHOTO_CARD : 0
  const perBox = boxPrice + flavourTotal + extras
  const full = fills.length === slots

  const chooseBox = (id) => {
    const b = BOXES.find((x) => x.id === id)
    const options = Object.keys(b.prices).map(Number)
    patch({ box: id, slots: options.includes(slots) ? slots : options.includes(6) ? 6 : options[0] })
  }
  // functional updates so quick successive taps all register
  const addFill = (key) =>
    setCfg((c) => (c.fills.slice(0, c.slots).length < c.slots ? { ...c, fills: [...c.fills.slice(0, c.slots), key] } : c))
  const removeFill = (key) =>
    setCfg((c) => {
      const list = c.fills.slice(0, c.slots)
      const i = list.lastIndexOf(key)
      return i >= 0 ? { ...c, fills: list.filter((_, j) => j !== i) } : c
    })

  const addToCart = () => {
    // personalisation travels with the cart line, and is part of its identity so different messages stay separate lines
    const note = [
      cfg.message.trim() && `Card: “${cfg.message.trim()}”${cfg.sender.trim() ? ` — ${cfg.sender.trim()}` : ''}`,
      cfg.photoCard && 'Photo card',
    ]
      .filter(Boolean)
      .join(' · ')
    const sig = `${cfg.box}-${slots}-${[...fills].sort().join('.')}-${hash(note)}`
    addCustom(
      {
        id: `builder:${sig}`,
        name: `Custom ${box.name.toLowerCase()} · ${slots} slots`,
        price: perBox,
        grams: slots * SLOT_GRAMS,
        image: '/assets/images/bowl-wood.png',
        note: note || fills.map((k) => FLAVOURS[k].name).join(', '),
      },
      cfg.boxes,
      false
    )
    navigate('/checkout/cart')
  }

  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-6 pb-6 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">GIFT BOX BUILDER</p>
            <h1 className="font-display text-[36px] font-semibold leading-[1.12] md:text-[48px]">Build your box</h1>
          </div>
          <p className="font-mono text-xs font-medium text-muted-foreground">
            Autosaved{savedAt ? ` · ${savedAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` : ''}
          </p>
        </div>

        <ol className="flex items-center gap-3 overflow-x-auto">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done = n < step
            const on = n === step
            return (
              <li key={label} className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  disabled={n > step}
                  onClick={() => setStep(n)}
                  aria-current={on ? 'step' : undefined}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full border text-sm font-bold',
                      done && 'border-leaf bg-leaf text-ivory',
                      on && 'border-primary bg-primary text-white',
                      !done && !on && 'border-line bg-white text-muted-foreground'
                    )}
                  >
                    {done ? <Check className="size-4" strokeWidth={2} /> : n}
                  </span>
                  <span className={cn('text-[15px] font-bold', !done && !on && 'text-muted-foreground')}>{label}</span>
                </button>
                {n < STEPS.length && <span className={cn('h-0.5 w-10 lg:w-24', done ? 'bg-leaf' : 'bg-line')} />}
              </li>
            )
          })}
        </ol>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 pb-16 pt-4 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5 rounded-card bg-white p-6 md:p-8">
          {step === 1 && (
            <>
              <h2 className="font-display text-[26px] font-semibold">Choose a box</h2>
              <div className="flex flex-col gap-3">
                {BOXES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    aria-pressed={cfg.box === b.id}
                    onClick={() => chooseBox(b.id)}
                    className={cn(
                      'flex items-center justify-between rounded-xl bg-white p-3.5 text-left',
                      cfg.box === b.id ? 'border-[1.5px] border-roast' : 'border border-line'
                    )}
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-bold">{b.name}</span>
                      <span className="text-[13px] text-muted-foreground">{b.note}</span>
                    </span>
                    <span className="font-mono text-[13px] font-medium">from {inr(Math.min(...Object.values(b.prices)))}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.12em]">Slots</p>
              <div className="flex gap-2.5">
                {Object.keys(box.prices).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={slots === +s}
                    onClick={() => patch({ slots: +s })}
                    className={cn(
                      'rounded-full border px-6 py-3 font-mono text-sm font-medium',
                      slots === +s ? 'border-roast bg-roast text-ivory' : 'border-line bg-white'
                    )}
                  >
                    {s} slots · {inr(box.prices[s])}
                  </button>
                ))}
              </div>
              <Nav back={<Button asChild variant="secondary"><Link to="/gifting">← Back to gifting</Link></Button>} next={<Button onClick={() => setStep(2)}>Continue to flavours</Button>} />
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-[26px] font-semibold">Tap a flavour to fill the next slot</h2>
                <p className="font-mono text-sm font-medium text-primary">
                  {fills.length} of {slots} filled
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(FLAVOURS).map(([key, f]) => {
                  const n = counts[key] ?? 0
                  return (
                    <div
                      key={key}
                      className={cn('relative flex flex-col gap-2.5 rounded-2xl bg-ivory p-4', n ? 'border-[1.5px] border-roast' : 'border border-line')}
                    >
                      <button
                        type="button"
                        onClick={() => addFill(key)}
                        disabled={fills.length >= slots}
                        aria-label={`Add ${f.name}`}
                        className="flex flex-col gap-2.5 text-left disabled:cursor-not-allowed"
                      >
                        <span className="h-[72px] rounded-[10px]" style={{ background: f.color }} />
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-bold leading-tight">{f.name}</span>
                          {n ? (
                            <span className="rounded-full bg-roast px-2 py-0.5 font-mono text-[11px] font-medium text-ivory">×{n}</span>
                          ) : (
                            <Icon name="plus-16" size={16} />
                          )}
                        </span>
                        <span className="font-mono text-[11px] font-medium text-muted-foreground">
                          {SLOT_GRAMS} g · +{inr(flavourPrice(key))}
                        </span>
                      </button>
                      {n > 0 && (
                        <button
                          type="button"
                          onClick={() => removeFill(key)}
                          aria-label={`Remove one ${f.name}`}
                          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white/90 text-roast"
                        >
                          <Minus className="size-3.5" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              <Nav
                back={<Button variant="secondary" onClick={() => setStep(1)}>← Back to boxes</Button>}
                next={
                  <Button disabled={!full} onClick={() => setStep(3)}>
                    {full ? 'Continue to personalise' : `Fill ${slots - fills.length} more`}
                  </Button>
                }
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-display text-[26px] font-semibold">Personalise</h2>
              <label className="flex flex-col gap-1.5 text-[13px] font-bold">
                Message card ({MAX_MESSAGE} chars)
                <textarea
                  value={cfg.message}
                  maxLength={MAX_MESSAGE}
                  onChange={(e) => patch({ message: e.target.value })}
                  placeholder="Happy Deepavali, Amma! — Ravi & family"
                  className="h-[88px] resize-none rounded-input border border-line bg-white px-3.5 py-3 text-sm font-normal focus-visible:border-roast focus-visible:outline-none"
                />
                <span className="self-end font-mono text-[11px] font-medium text-muted-foreground">
                  {cfg.message.length}/{MAX_MESSAGE}
                </span>
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] font-bold">
                Sender name
                <input
                  value={cfg.sender}
                  onChange={(e) => patch({ sender: e.target.value })}
                  placeholder="Ravi"
                  className="h-12 rounded-input border border-line bg-white px-3.5 text-sm font-normal focus-visible:border-roast focus-visible:outline-none"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-line p-3.5 text-sm font-medium">
                <input type="checkbox" checked={cfg.photoCard} onChange={(e) => patch({ photoCard: e.target.checked })} className="size-4 accent-leaf" />
                <Icon name="upload" size={18} />
                Add an optional photo card (+{inr(PHOTO_CARD)})
              </label>
              <Nav back={<Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>} next={<Button onClick={() => setStep(4)}>Continue to review</Button>} />
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="font-display text-[26px] font-semibold">Review &amp; date</h2>
              <div className="flex items-center gap-2.5 rounded-xl border border-line p-3.5 text-sm font-medium">
                <Icon name="cal-18" size={18} />
                Deliver on {deliveryDate(7)} <span className="text-muted-foreground">(change at checkout)</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-line p-3.5 text-sm font-medium">
                <Icon name="pin-18" size={18} />
                <span className="flex-1">
                  {cfg.boxes} {cfg.boxes === 1 ? "box" : "boxes"} · same address
                </span>
                <span className="flex items-center gap-2">
                  <button type="button" aria-label="Fewer boxes" onClick={() => patch({ boxes: Math.max(1, cfg.boxes - 1) })} className="rounded-full border border-line p-1">
                    <Minus className="size-3.5" />
                  </button>
                  <button type="button" aria-label="More boxes" onClick={() => patch({ boxes: Math.min(500, cfg.boxes + 1) })} className="rounded-full border border-line p-1">
                    <Plus className="size-3.5" />
                  </button>
                </span>
              </div>
              <Lines rows={[
                [`${box.name} · ${slots} slots`, inr(boxPrice)],
                [`${fills.length} flavours × ${SLOT_GRAMS} g`, inr(flavourTotal)],
                ...(cfg.message || cfg.photoCard ? [[cfg.photoCard ? 'Card + photo card' : 'Message card', inr(extras)]] : []),
              ]} dark={false} />
              <div className="flex justify-between text-base font-bold">
                <span>Per box</span>
                <span>{inr(perBox)}</span>
              </div>
              <Button className="w-full" onClick={addToCart}>
                Add {cfg.boxes} box{cfg.boxes > 1 && 'es'} to cart · {inr(perBox * cfg.boxes)}
              </Button>
              <button type="button" onClick={() => setStep(3)} className="self-start text-sm font-bold underline">
                ← Back
              </button>
            </>
          )}
        </div>

        <aside className="flex w-full flex-col gap-5 rounded-media bg-night p-6 text-ivory md:p-8 lg:sticky lg:top-24 lg:w-[480px] lg:shrink-0">
          <p className="eyebrow text-gold">LIVE PREVIEW</p>
          <h2 className="font-display text-2xl font-semibold">
            {box.name} · {slots} slots
          </h2>
          <Tin slots={slots} fills={fills} />
          <p className="rounded-xl bg-ivory/10 p-3.5 text-[13px] font-medium text-sand">
            {cfg.message ? `Card: “${cfg.message}”${cfg.sender ? ` — ${cfg.sender}` : ''}` : 'Card: not added yet'}
          </p>
          <Lines
            dark
            rows={[
              [`${box.name} (${slots} slots)`, inr(boxPrice)],
              [`${fills.length} flavour${fills.length === 1 ? '' : 's'} × ${SLOT_GRAMS} g`, inr(flavourTotal)],
              ...(extras ? [['Photo card', inr(extras)]] : []),
            ]}
          />
          <div className="flex justify-between text-[15px] font-bold">
            <span>Total so far</span>
            <span>{inr(perBox)}</span>
          </div>
        </aside>
      </section>
    </>
  )
}

function Nav({ back, next }) {
  return <div className="mt-2 flex flex-wrap justify-between gap-3">{back}{next}</div>
}

function Lines({ rows, dark }) {
  return (
    <div className={cn('flex flex-col gap-2.5 text-[15px]', dark ? 'text-sand' : 'text-[14px]')}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between">
          <span>{k}</span>
          <span className="font-mono font-medium">{v}</span>
        </div>
      ))}
    </div>
  )
}

// Top view of the tin: filled slots show the flavour colour, empty ones a dashed gold ring
function Tin({ slots, fills }) {
  const cols = slots === 4 ? 2 : slots === 12 ? 4 : 3
  const size = cols === 4 ? 76 : 110
  return (
    <div
      className="mx-auto grid w-fit gap-4 rounded-[28px] border-[3px] border-gold bg-[#8a6a35] p-6"
      style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}
      role="img"
      aria-label={`${fills.length} of ${slots} slots filled`}
    >
      {Array.from({ length: slots }, (_, i) => {
        const key = fills[i]
        return key ? (
          <span key={i} className="flex items-center justify-center rounded-full border-2 border-ivory/70" style={{ width: size, height: size, background: FLAVOURS[key].color }}>
          </span>
        ) : (
          <span key={i} className="rounded-full border-2 border-dashed border-gold/70 bg-night/30" style={{ width: size, height: size }} />
        )
      })}
    </div>
  )
}

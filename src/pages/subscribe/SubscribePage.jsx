import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { FaqList } from '@/components/shared/FaqList'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { FLAVOURS, unitPer100 } from '@/data/products'
import { deliveryDate, grams, inr } from '@/lib/format'
import { cn } from '@/lib/utils'

// Figma 06 · Subscribe and save (39:5846). Prices are placeholders [confirm discount].
const DISCOUNT = 0.1
// box price = the mix's average catalogue price per 100 g at that pack size, times the size
const PLAN_SIZES = [250, 500, 1000]
const planPrice = (grams, keys) =>
  Math.round(((keys.reduce((n, k) => n + unitPer100(k, grams), 0) / keys.length) * grams) / 100)
const FREQUENCIES = [2, 4, 8]
const MAX_FLAVOURS = 3

const STEPS = [
  ['sub-box', '1  Choose', 'Pick a pack size and mix up to three flavours.'],
  ['sub-cal', '2  Schedule', 'Every 2, 4 or 8 weeks. Change the date anytime.'],
  ['sub-sofa', '3  Relax', 'Fresh tins arrive, roasted that week. WhatsApp reminder 3 days before.'],
]
const PERKS = [
  ['sub-pct', '10% off every box', 'Locked in for as long as you stay.'],
  ['sub-truck', 'Free delivery', 'On every subscription order.'],
  ['sub-skip', 'Skip or cancel anytime', 'Two taps in your account.'],
  ['sub-wa', 'WhatsApp reminders', 'Three days before each box ships.'],
]
const FAQ = [
  { q: 'Can I change flavours between boxes?', a: 'Yes — any time up to 48 hours before dispatch.' },
  { q: 'What if I am travelling?', a: 'Skip a box or move the date from your account. Nothing is charged until the box ships.' },
  { q: 'Is there a minimum commitment?', a: 'No. Cancel anytime in two taps — the 10% saving applies for as long as you stay.' },
  { q: 'How is the price calculated?', a: 'The pack price for your size, minus 10%. Delivery is free on every subscription order.' },
]

const pill = (on) =>
  cn(
    'rounded-full border px-6 py-3 text-sm transition-colors',
    on ? 'border-roast bg-roast text-ivory' : 'border-line bg-white hover:border-roast'
  )

export default function SubscribePage() {
  const [size, setSize] = useState(500)
  const [mix, setMix] = useState(['plain', 'roasted', 'chettinad'])
  const [every, setEvery] = useState(4)
  const [started, setStarted] = useState(false)

  const toggleFlavour = (key) =>
    setMix((m) => (m.includes(key) ? (m.length > 1 ? m.filter((k) => k !== key) : m) : m.length < MAX_FLAVOURS ? [...m, key] : m))

  const price = planPrice(size, mix)
  const saving = Math.round(price * DISCOUNT)
  const fromPrice = Math.round(Math.min(...Object.keys(FLAVOURS).map((k) => planPrice(250, [k]))) * (1 - DISCOUNT))

  return (
    <>
      <section className="bg-sand">
        <div className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-10 py-14 lg:flex-row lg:gap-16 lg:py-[72px]">
          <div className="flex flex-1 flex-col items-start gap-6">
            <p className="eyebrow">SUBSCRIBE AND SAVE</p>
            <h1 className="max-w-[560px] font-display text-[44px] font-semibold leading-[1.1] md:text-h1">
              Never run out. <em className="font-normal">Save 10%</em>
            </h1>
            <p className="max-w-[520px] text-body-l">
              A monthly box of freshly roasted cashews, in the grade and flavours you choose. Free delivery, skip or cancel
              anytime.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild>
                <a href="#plan">Build my plan</a>
              </Button>
              <span className="font-mono text-sm font-medium">From {inr(fromPrice)} / month</span>
            </div>
          </div>

          <div className="relative flex h-[320px] w-full items-center justify-center rounded-media bg-ivory md:h-[440px] lg:w-[560px] lg:shrink-0">
            <img src="/assets/images/w240-plain.png" alt="A bowl of W240 cashews" className="h-[86%] w-[86%] object-contain" />
            <div className="absolute right-6 top-7 flex size-20 flex-col items-center justify-center rounded-full bg-primary text-ivory">
              <span className="text-[11px] font-bold tracking-[0.12em]">SAVE</span>
              <span className="font-display text-[32px] font-semibold leading-none">10%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="HOW IT WORKS" title="Three steps, then relax" />
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map(([icon, title, body]) => (
            <div key={title} className="flex flex-col gap-3.5 rounded-card bg-white p-8">
              <Icon name={icon} size={32} />
              <h3 className="font-display text-[26px] font-semibold">{title}</h3>
              <p className="max-w-[340px] text-[15px] leading-[1.55]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="plan" className="page-x mx-auto flex max-w-[1440px] scroll-mt-24 flex-col gap-12 py-[88px] lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <SectionHeading eyebrow="PLAN PICKER" title="Build your plan" />

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">1 · Pack size per delivery</legend>
            <div className="flex flex-wrap gap-2.5">
              {PLAN_SIZES.map((g) => (
                <button key={g} type="button" aria-pressed={size === +g} onClick={() => setSize(+g)} className={cn(pill(size === +g), 'font-mono font-medium')}>
                  {grams(+g)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">2 · Flavour mix (pick up to {MAX_FLAVOURS})</legend>
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(FLAVOURS).map(([key, f]) => {
                const on = mix.includes(key)
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleFlavour(key)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border py-2.5 pl-3 pr-4 text-sm font-medium transition-colors',
                      on ? 'border-[1.5px] border-roast bg-roast text-ivory' : 'border-line bg-white hover:border-roast'
                    )}
                  >
                    <span className="size-3 rounded-full border border-line/60" style={{ background: f.color }} />
                    {f.name}
                    {on && <Icon name="check-sm" size={14} />}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">3 · Frequency</legend>
            <div className="flex flex-wrap gap-2.5">
              {FREQUENCIES.map((w) => (
                <button key={w} type="button" aria-pressed={every === w} onClick={() => setEvery(w)} className={cn(pill(every === w), 'px-5 font-bold')}>
                  Every {w} weeks
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="flex h-fit w-full flex-col gap-3.5 rounded-card bg-white p-8 lg:w-[420px] lg:shrink-0">
          <h2 className="font-display text-[28px] font-semibold">Your plan</h2>
          <div className="flex justify-between text-[15px]">
            <span>
              {grams(size)} · {mix.length} flavour{mix.length > 1 && 's'}
            </span>
            <span className="font-mono font-medium">{inr(price)}</span>
          </div>
          <div className="flex justify-between text-[15px] text-success">
            <span>Subscriber saving 10%</span>
            <span className="font-mono font-medium">−{inr(saving)}</span>
          </div>
          <div className="flex justify-between text-[15px] text-success">
            <span>Delivery</span>
            <span className="font-mono font-medium">Free</span>
          </div>
          <hr className="border-line" />
          <div className="flex justify-between text-[15px] font-bold">
            <span>Every {every} weeks</span>
            <span>{inr(price - saving)}</span>
          </div>
          <p className="text-[13px] leading-normal text-muted-foreground">
            First box ships {deliveryDate(3)}. Skip, swap or cancel from your account.
          </p>
          {started ? (
            <p role="status" className="rounded-input bg-mint p-3 text-sm font-medium text-leaf">
              Nandri! Your plan is saved — subscription checkout opens once payments go live.
            </p>
          ) : (
            <Button className="w-full" onClick={() => setStarted(true)}>
              Start subscription
            </Button>
          )}
        </aside>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="WHY SUBSCRIBE" title="Small perks that add up" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(([icon, title, body]) => (
            <div key={title} className="flex flex-col gap-3 rounded-card bg-sand p-7">
              <Icon name={icon} size={28} />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm leading-normal">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px] lg:flex-row lg:gap-16">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" className="mb-3" />
          <FaqList items={FAQ} />
        </div>
        <div className="flex h-fit w-full flex-col items-start justify-center gap-4 rounded-media bg-roast p-10 lg:w-[440px] lg:shrink-0">
          <p className="max-w-[360px] font-display text-[32px] font-semibold leading-[1.2] text-ivory">
            Your first box could be roasting this week.
          </p>
          <Button asChild>
            <a href="#plan">Start subscription</a>
          </Button>
        </div>
      </section>
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { inr } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { GIFT_BOXES } from '@/data/gifts'
import { downloadCatalogue } from '@/lib/catalogue'
import { cn } from '@/lib/utils'

// Figma 07 · Gifting hub (39:6014)
const OCCASIONS = ['Diwali', 'Pongal', 'Weddings', 'Housewarming', 'Thank you', 'Birthdays']

const EXAMPLES = [
  ['Message card', 'Handwritten-style card, up to 200 characters.'],
  ['Name sleeve', 'A printed sleeve around the tin with a name or logo.'],
  ['Custom ribbon', 'Silk ribbon in maroon, gold or leaf green.'],
]
const SLABS = [
  ['25–49 boxes', '5% off'],
  ['50–99 boxes', '10% off'],
  ['100+ boxes', 'Talk to us'],
]

export default function GiftingHubPage() {
  const { addCustom } = useCart()
  const [occasion, setOccasion] = useState('Diwali')
  const boxes = GIFT_BOXES.filter((b) => b.occasions.includes(occasion))

  return (
    <>
      <div className="bg-night text-ivory">
        <section className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-10 pb-16 pt-10 lg:flex-row lg:gap-16 lg:pb-[88px]">
          <div className="flex flex-1 flex-col items-start gap-6">
            <img src="/assets/icons/kolam-420.svg" alt="" className="h-6 w-[420px] max-w-full" />
            <p className="eyebrow text-gold">DIWALI · PONGAL · WEDDINGS</p>
            <h1 className="max-w-[560px] font-display text-[56px] font-normal leading-none md:text-display-xl">
              Gift the <em className="text-gold">good kind.</em>
            </h1>
            <p className="max-w-[500px] text-body-l text-sand">
              Gold-foiled tins and keepsake boxes filled with graded whole cashews, a handwritten card and your date of
              choice.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="#boxes">Shop gift boxes</a>
              </Button>
              <Button asChild variant="onDark">
                <Link to="/gifting/build">Build your own</Link>
              </Button>
            </div>
          </div>
          <div className="flex h-[360px] w-full items-center justify-center rounded-media border border-gold/40 bg-[#2A1F1A] md:h-[560px] lg:w-[600px] lg:shrink-0">
            <img src="/assets/images/bowl-wood.png" alt="A wooden bowl of graded cashews" className="h-[82%] w-[83%] object-contain" />
          </div>
        </section>

        <div className="page-x mx-auto max-w-[1440px] pb-6">
          <div className="no-scrollbar flex gap-2 overflow-x-auto" role="tablist" aria-label="Occasion">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                role="tab"
                aria-selected={o === occasion}
                onClick={() => setOccasion(o)}
                className={cn(
                  'shrink-0 rounded-full border px-[22px] py-3 text-sm font-bold transition-colors',
                  o === occasion ? 'border-ivory bg-ivory text-roast' : 'border-ivory/30 hover:border-ivory'
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <section id="boxes" className="page-x mx-auto grid max-w-[1440px] scroll-mt-24 gap-6 pb-[88px] pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {boxes.map((b) => (
            <article key={b.id} className="flex flex-col gap-3.5 rounded-card border border-gold/35 p-4">
              <div className="flex h-[260px] items-center justify-center rounded-2xl bg-[#2A1F1A]">
                <img src={`/assets/images/${b.img}`} alt="" className="h-[213px] w-[296px] max-w-full object-contain" />
              </div>
              <div className="flex flex-1 flex-col items-start gap-2.5 px-2 pb-2">
                <div className="flex w-full items-baseline justify-between gap-3">
                  <h3 className="font-display text-[22px] font-semibold">{b.name}</h3>
                  <span className="shrink-0 font-mono text-[15px] font-medium text-gold">{inr(b.price)}</span>
                </div>
                <p className="text-sm leading-normal text-sand">{b.desc}</p>
                <Button size="xs" className="mt-auto" onClick={() => addCustom({ ...b, image: `/assets/images/${b.img}` })}>
                  Add to cart
                </Button>
              </div>
            </article>
          ))}
          {boxes.length === 0 && <p className="text-sand">No boxes for this occasion yet — build your own instead.</p>}
        </section>

        <section className="page-x mx-auto max-w-[1440px] pb-[88px]">
          <div className="flex flex-col items-start justify-between gap-6 rounded-media bg-gold px-8 py-12 text-night md:flex-row md:items-center md:px-14">
            <div className="flex flex-col gap-2.5">
              <p className="eyebrow text-night">GIFT BOX BUILDER</p>
              <h2 className="font-display text-[32px] font-semibold md:text-h2">Build your own box in four steps</h2>
              <p className="max-w-[600px] leading-[1.6]">
                Choose a tin or wooden box, fill each slot with a flavour, add a card. Live preview as you go.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link to="/gifting/build">Start building</Link>
            </Button>
          </div>
        </section>
      </div>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="PERSONALISATION" title="Make it unmistakably yours" />
        <div className="grid gap-6 md:grid-cols-3">
          {EXAMPLES.map(([title, body], i) => (
            <div key={title} className="flex flex-col gap-3.5 rounded-card bg-white p-6">
              <div className="flex h-[200px] items-center justify-center rounded-2xl bg-sand">
                {i === 0 && (
                  <div className="flex h-[140px] w-[220px] flex-col justify-center gap-1.5 rounded-md border border-gold bg-ivory p-5 font-display italic">
                    <p className="max-w-[180px] text-xl">Happy Deepavali, Amma!</p>
                    <p className="text-sm text-muted-foreground">— Ravi &amp; family</p>
                  </div>
                )}
                {i === 1 && (
                  <div className="rounded-lg bg-roast px-6 py-[18px]">
                    <p className="font-display text-xl font-semibold text-gold">For the Iyer family</p>
                  </div>
                )}
                {i === 2 && <img src="/assets/icons/ribbon-frame.svg" alt="" className="h-[120px] w-[240px]" />}
              </div>
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              <p className="text-sm leading-normal">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto grid max-w-[1440px] gap-6 pb-[88px] lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-3.5 rounded-card bg-leaf p-8">
          <Icon name="gift-cal" size={32} />
          <h2 className="max-w-[440px] font-display text-[32px] font-semibold leading-[1.15] text-ivory">Pick the day it arrives</h2>
          <p className="max-w-[440px] leading-[1.6] text-sand">
            Choose the day it should arrive at checkout. Pan-India delivery in 3–5 days.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-card bg-white p-8">
          <h2 className="font-display text-[28px] font-semibold">Ordering 25 or more?</h2>
          {SLABS.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-line py-3 text-[15px]">
              <span className="font-medium">{k}</span>
              <span className="font-mono font-medium text-success">{v}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Applied automatically to gift boxes in your cart.</p>
        </div>
      </section>

      <section className="bg-sand">
        <div className="page-x mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 py-[72px] md:flex-row md:items-center">
          <div className="flex flex-col gap-2.5">
            <p className="eyebrow">CORPORATE GIFTING</p>
            <h2 className="font-display text-[32px] font-semibold md:text-h2">Gifts your clients will actually open.</h2>
            <p>Logo sleeves, co-branded tins and pan-India delivery for 50 to 5,000 boxes.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/gifting/corporate#quote">Get a quote</Link>
            </Button>
            <Button variant="secondary" onClick={downloadCatalogue}>Download catalogue</Button>
          </div>
        </div>
      </section>
    </>
  )
}

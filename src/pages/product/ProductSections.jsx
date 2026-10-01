import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { ProductCard } from '@/components/shared/ProductCard'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { RECIPES } from '@/data/productDetails'
import { useCart } from '@/context/CartContext'
import { printDocument } from '@/lib/print'
import { cn } from '@/lib/utils'

const TRUST = [
  ['shield', 'Whole nuts guarantee', 'Broken count above 5%? We replace it.'],
  ['leaf-trust', 'Packed-on date', 'On every tin, and on this page'],
  ['lab', 'Lab tested', 'Every batch, report below'],
  ['return', 'Easy returns', '7 days, no questions'],
]

// Figma "Trust strip" (39:5277)
export function TrustStrip() {
  return (
    <section className="page-x mx-auto grid max-w-[1440px] gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
      {TRUST.map(([icon, title, sub]) => (
        <div key={title} className="flex items-center gap-3">
          <Icon name={icon} size={28} />
          <div className="flex flex-col gap-0.5">
            <p className="text-[15px] font-bold">{title}</p>
            <p className="text-[13px] text-muted-foreground">{sub}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

const rowClass = 'flex items-start justify-between gap-4 border-b border-line py-3 text-sm leading-[19px]'

// Figma "Know your nut + Taste profile" (39:5306)
export function KnowYourNut({ product, details }) {
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-20 lg:flex-row lg:gap-14">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <SectionHeading eyebrow="KNOW YOUR NUT" title={`${product.grade}, explained`} />
        <dl>
          {details.spec.map(([k, v]) => (
            <div key={k} className={rowClass}>
              <dt className="font-medium text-muted-foreground">{k}</dt>
              <dd className="text-right font-mono">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex h-fit w-full flex-col gap-[18px] rounded-card bg-white p-8 lg:w-[520px] lg:shrink-0">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">TASTE PROFILE</p>
          <h2 className="font-display text-[32px] font-semibold leading-[1.15]">{details.tasteTitle}</h2>
        </div>
        {details.meters.map(([label, score]) => (
          <div key={label} className="flex items-center gap-4">
            <span className="w-[70px] text-sm font-medium leading-[19px]">{label}</span>
            <span className="flex gap-1.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={cn('h-2 w-9 rounded', i < score ? 'bg-roast' : 'bg-roast/15')} />
              ))}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{score}/5</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// Figma "Nutrition + Batch info" (39:5373)
export function NutritionBatch({ product, details }) {
  const { batch } = details
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-6 pb-20 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-card bg-white p-8">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">NUTRITION</p>
          <h2 className="font-display text-[28px] font-semibold leading-[1.15]">Per 30 g serving (about 15 nuts)</h2>
        </div>
        <dl>
          {details.nutrition.map(([k, v]) => (
            <div key={k} className={rowClass}>
              <dt className="font-medium text-muted-foreground">{k}</dt>
              <dd className="font-mono">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="max-w-[560px] text-sm leading-[1.55] text-muted-foreground">
          In plain words: a handful gives steady energy and good fats. Values indicative.
        </p>
      </div>

      <div className="flex w-full flex-col items-start gap-4 rounded-card bg-leaf p-8 lg:w-[520px] lg:shrink-0">
        <p className="eyebrow text-gold">BATCH INFO</p>
        <h2 className="max-w-[456px] font-display text-[32px] font-semibold leading-[1.2] text-ivory">
          This batch was roasted on {batch.date}
        </h2>
        <dl className="flex gap-6">
          {[
            ['Batch', batch.id],
            ['Graded by', batch.gradedBy],
            ['Moisture', batch.moisture],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <dt className="text-xs text-sand">{k}</dt>
              <dd className="font-mono text-base text-ivory">{v}</dd>
            </div>
          ))}
        </dl>
        <Button
          variant="onDark"
          size="sm"
          className="py-3 pl-4 pr-[18px]"
          type="button"
          onClick={() =>
            printDocument(`Lab report · batch ${batch.id}`, [
              { heading: product.name, rows: [["Batch", batch.id], ["Roasted", batch.date], ["Graded by", batch.gradedBy], ["Moisture", batch.moisture]] },
              { heading: "Nutrition per 30 g", rows: details.nutrition },
            ], { note: "Values indicative until the signed lab certificate for this batch is attached." })
          }
        >
          <Icon name="download" size={18} />
          Download lab report (PDF)
        </Button>
      </div>
    </section>
  )
}

// Figma "How people use it" (39:5418)
export function HowPeopleUse({ product }) {
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-20">
      <SectionHeading eyebrow="HOW PEOPLE USE IT" title={`Three ways with ${product.grade}`} />
      <div className="grid gap-6 md:grid-cols-3">
        {RECIPES.map((r) => (
          <Link key={r.title} to="/journal" className="flex flex-col gap-3 rounded-card bg-white p-3">
            <img
              src={`/assets/images/${r.img}`}
              alt=""
              className="h-[220px] w-full rounded-2xl object-cover"
            />
            <div className="flex flex-col gap-1 px-2 pb-2 pt-1">
              <p className="font-mono text-xs text-muted-foreground">{r.time}</p>
              <h3 className="font-display text-[22px] font-semibold">{r.title}</h3>
              <p className="text-[13px] font-bold text-primary">Read in the Journal →</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

const BUNDLE = [
  { id: 'chettinad-masala', grams: 100 },
  { id: 'honey-glazed', grams: 100 },
  { id: 'chilli-garlic', grams: 100 },
]

// Figma "Pairs well with + bundle" (39:5476)
export function PairsWith({ products }) {
  const { add } = useCart()
  const addBundle = () => BUNDLE.forEach((b, i) => add(b.id, b.grams, 1, i === BUNDLE.length - 1, { bundle: true }))

  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading eyebrow="PAIRS WELL WITH" title="Make it a Tasting Trio" />
        <div className="flex items-center gap-3 rounded-full bg-sand py-2 pl-5 pr-2">
          <p className="text-sm font-bold">Buy any 3 × 100 g · Save 15%</p>
          <Button type="button" onClick={addBundle}>
            Add bundle
          </Button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} listing />
        ))}
      </div>
    </section>
  )
}

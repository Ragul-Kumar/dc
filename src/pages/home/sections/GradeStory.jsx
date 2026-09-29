import { useState } from 'react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// W240 figures from Figma; other grades are placeholders [confirm]
const GRADES = [
  { id: 'W180', size: 120, name: 'W180 “King”', body: 'The largest whole grade. A showpiece for gifting and special occasions.', per100: '38 – 40', perLb: '170 – 180', best: 'Gifting, platters', from: '₹219 / 100 g' },
  { id: 'W210', size: 108, name: 'W210 “Jumbo”', body: 'Big, buttery and even. Great when you want a generous bowl.', per100: '44 – 46', perLb: '200 – 210', best: 'Gifting, snacking', from: '₹179 / 100 g' },
  { id: 'W240', size: 96, name: 'W240 “Classic”', body: 'Our hero everyday grade. Big enough to feel generous, sized right for snacking and flavours.', per100: '48 – 53', perLb: '220 – 240', best: 'Snacking, flavoured range', from: '₹139 / 100 g' },
  { id: 'W320', size: 80, name: 'W320 “Everyday”', body: 'The most popular grade in India. Great value for daily snacking.', per100: '66 – 70', perLb: '300 – 320', best: 'Daily snacking, cooking', from: '₹109 / 100 g' },
  { id: 'Splits', size: 64, name: 'Splits', body: 'Whole nuts split naturally in two. Same taste, lower price.', per100: '—', perLb: '—', best: 'Curries, sweets', from: '₹89 / 100 g' },
  { id: 'Pieces', size: 44, name: 'Pieces', body: 'Broken bits for baking, garnishing and kheer.', per100: '—', perLb: '—', best: 'Baking, garnish', from: '₹69 / 100 g' },
]
const ICONS = ['w180', 'w210', 'w240', 'w320', 'splits', 'pieces']

export function GradeStory() {
  const [idx, setIdx] = useState(2)
  const g = GRADES[idx]
  const stats = [
    ['Nuts per 100 g', g.per100],
    ['Nuts per lb', g.perLb],
    ['Best for', g.best],
    ['From', g.from],
  ]

  return (
    <section className="bg-sand py-24">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-10">
        <SectionHeading
          eyebrow="THE GRADE STORY"
          title="Bigger is not always better. Right is."
          lede="Drag the slider. The cashew grows or shrinks and the panel tells you what that grade is for."
        />

        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex flex-1 flex-col items-center gap-10 rounded-media bg-ivory p-6 md:p-12">
            <div className="flex h-[120px] items-end gap-3 md:gap-7">
              {GRADES.map((gr, i) => (
                <button
                  key={gr.id}
                  onClick={() => setIdx(i)}
                  aria-label={gr.id}
                  className={cn('transition-all duration-300', i === idx ? 'opacity-100' : 'opacity-60 hover:opacity-90')}
                >
                  <img
                    src={`/assets/icons/cashew-${ICONS[i]}.svg`}
                    alt=""
                    style={{ width: `min(${gr.size}px, ${gr.size / 7}vw)` }}
                    className="aspect-square"
                  />
                </button>
              ))}
            </div>

            <div className="flex w-full max-w-[640px] flex-col gap-3">
              <input
                type="range"
                min={0}
                max={GRADES.length - 1}
                step={1}
                value={idx}
                onChange={(e) => setIdx(+e.target.value)}
                aria-label="Cashew grade"
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-primary"
                style={{
                  background: `linear-gradient(to right, #C8442C ${(idx / (GRADES.length - 1)) * 100}%, #DCCCB2 0)`,
                }}
              />
              <div className="flex justify-between font-mono text-[11px] md:text-[13px]">
                {GRADES.map((gr, i) => (
                  <span key={gr.id} className={i === idx ? 'text-primary' : 'text-muted-foreground'}>
                    {gr.id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[18px] rounded-card bg-white p-8 lg:w-[420px]">
            <Badge variant="grade">{g.id}</Badge>
            <h3 className="font-display text-[32px] font-semibold">{g.name}</h3>
            <p className="min-h-[52px] leading-relaxed">{g.body}</p>
            <dl className="w-full">
              {stats.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-line py-2.5 text-sm">
                  <dt className="font-medium text-muted-foreground">{k}</dt>
                  <dd className="text-right font-mono">{v}</dd>
                </div>
              ))}
            </dl>
            <Button>Find your grade</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

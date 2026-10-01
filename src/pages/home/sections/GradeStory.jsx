import { useState } from 'react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { gradeFromPer100 } from '@/data/products'
import { cn } from '@/lib/utils'

// Figma 02 · Home → "Grade story (interactive)" (39:4617). W240 figures are from Figma; the other
// grades' copy and prices are placeholders [confirm].
export const GRADES = [
  { id: 'W180', tag: 'King', label: '≈ 3.0 cm', count: '37–40', name: 'W180 “King”', body: 'The largest whole grade. A showpiece for gifting and special occasions.', per100: '38 – 40', perLb: '170 – 180', best: 'Gifting, platters' },
  { id: 'W210', tag: 'Jumbo', label: '≈ 2.8 cm', count: '44–46', name: 'W210 “Jumbo”', body: 'Big, buttery and even. Great when you want a generous bowl.', per100: '44 – 46', perLb: '200 – 210', best: 'Gifting, snacking' },
  { id: 'W240', tag: 'Classic', label: '≈ 2.6 cm', count: '48–53', name: 'W240 “Classic”', body: 'Our hero everyday grade. Big enough to feel generous, sized right for snacking and flavours.', per100: '48 – 53', perLb: '220 – 240', best: 'Snacking, flavoured range' },
  { id: 'W320', tag: 'Everyday', label: '≈ 2.3 cm', count: '66–71', name: 'W320 “Everyday”', body: 'Our best-value whole grade. Great for daily snacking and cooking.', per100: '66 – 70', perLb: '300 – 320', best: 'Daily snacking, cooking' },
  { id: 'Splits', tag: 'Halves', label: '½ nut', count: '—', name: 'Splits', body: 'Whole nuts split naturally in two — the same taste, ideal for curries and sweets. Wholesale only.', per100: '—', perLb: '—', best: 'Curries, sweets' },
  { id: 'Pieces', tag: 'Bits', label: '< 1 cm', count: '—', name: 'Pieces', body: 'Broken bits for baking, garnishing and kheer.', per100: '—', perLb: '—', best: 'Baking, garnish' },
]

// ₹ per 100 g comes from the live catalogue; grades we don't sell online say so
const fromText = (id) => {
  const v = gradeFromPer100(id)
  return v ? `₹${+v.toFixed(1)} / 100 g` : 'Wholesale on request'
}
const SOLD_ONLINE = (id) => gradeFromPer100(id) !== null

export const CELL = 122 // px, one grade column in the stage

// One real W240 cashew cutout, placed per grade at its true relative size (left, top, width in a 114×96 box)
const NUT = '/assets/images/cashew-whole.png'
const NUT_RATIO = 524 / 760
const WHOLE = {
  W180: [{ x: 2, y: 20.16, w: 110 }],
  W210: [{ x: 6, y: 25.67, w: 102 }],
  W240: [{ x: 9, y: 29.81, w: 96 }],
  W320: [{ x: 14.5, y: 37.39, w: 85 }],
  Splits: [
    { x: 21, y: 28.08, w: 84 },
    { x: 11, y: 38.08, w: 84 },
  ],
}
// Pieces: four small nuts, centre points + rotation
const PIECES = [
  { cx: 30.29, cy: 82.95, r: 25 },
  { cx: 80.18, cy: 55.71, r: -40 },
  { cx: 42.12, cy: 8.49, r: -110 },
  { cx: 63.88, cy: 53.51, r: 70 },
]

function Nuts({ id }) {
  if (id === 'Pieces') {
    return PIECES.map((p, i) => (
      <img
        key={i}
        src={NUT}
        alt=""
        className="absolute max-w-none"
        style={{ width: 40, left: p.cx - 20, top: p.cy - 13.79, transform: `rotate(${p.r}deg)` }}
      />
    ))
  }
  return WHOLE[id].map((n, i) => (
    <img key={i} src={NUT} alt="" className="absolute max-w-none" style={{ left: n.x, top: n.y, width: n.w, height: n.w * NUT_RATIO }} />
  ))
}

export function GradeStory() {
  const [idx, setIdx] = useState(2)
  const g = GRADES[idx]
  const stats = [
    ['Nuts per 100 g', g.per100],
    ['Nuts per lb', g.perLb],
    ['Best for', g.best],
    ['From', fromText(g.id)],
  ]
  const col = (i) => CELL / 2 + CELL * i // centre of column i

  return (
    <section className="bg-sand py-24">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-10">
        <SectionHeading
          eyebrow="THE GRADE STORY"
          title="Bigger is not always better. Right is."
          lede="Real nuts at their true relative size. Tap a grade and the panel tells you what it is for."
        />

        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="min-w-0 flex-1 overflow-x-auto rounded-card bg-ivory px-4 py-9 md:px-10">
            <div className="mx-auto flex min-h-[447px] w-[732px] flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground">
                <p className="text-xs font-bold">TRUE RELATIVE SIZE · REAL NUTS</p>
                <p className="font-mono text-[13px] font-medium">Tap a grade →</p>
              </div>

              <div className="flex items-end">
                {GRADES.map((gr, i) => {
                  const on = i === idx
                  return (
                    <button
                      key={gr.id}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-pressed={on}
                      aria-label={`${gr.id} ${gr.tag}`}
                      className={cn(
                        'flex w-[122px] flex-col items-center gap-3 rounded-2xl border-[1.5px] pb-4 pt-[18px] transition-colors',
                        on ? 'border-primary bg-white' : 'border-transparent hover:bg-white/60'
                      )}
                    >
                      <span className="relative block h-[96px] w-[114px]">
                        <Nuts id={gr.id} />
                      </span>
                      <span className={cn('font-mono text-xs font-medium', on ? 'text-primary' : 'text-muted-foreground')}>
                        {gr.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="relative h-7 w-[732px]">
                <span className="absolute left-[61px] top-[11px] h-1.5 w-[610px] rounded-[3px] bg-line" />
                <span className="absolute left-[61px] top-[11px] h-1.5 rounded-[3px] bg-primary" style={{ width: CELL * idx }} />
                {GRADES.map((gr, i) => (
                  <span
                    key={gr.id}
                    className={cn('absolute top-[10px] size-2 rounded-full', i < idx ? 'bg-primary' : 'bg-line')}
                    style={{ left: col(i) - 4 }}
                  />
                ))}
                <span
                  className="absolute top-[2px] size-[23px] rounded-full border-[3px] border-primary bg-white"
                  style={{ left: col(idx) - 11.5 }}
                />
                <input
                  type="range"
                  min={0}
                  max={GRADES.length - 1}
                  step={1}
                  value={idx}
                  onChange={(e) => setIdx(+e.target.value)}
                  aria-label="Cashew grade"
                  className="absolute left-[50px] top-0 h-7 w-[632px] cursor-pointer opacity-0"
                />
              </div>

              <div className="flex">
                {GRADES.map((gr, i) => (
                  <div key={gr.id} className={cn('flex w-[122px] flex-col items-center gap-0.5', i === idx && 'text-primary')}>
                    <span className={cn('font-mono text-sm font-medium', i !== idx && 'text-roast')}>{gr.id}</span>
                    <span className={cn('text-xs', i === idx ? 'font-bold' : 'text-muted-foreground')}>{gr.tag}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-line pt-0">
                <p className="pt-3 text-[11px] font-bold text-muted-foreground">NUTS PER 100 G</p>
                <div className="flex">
                  {GRADES.map((gr, i) => (
                    <span
                      key={gr.id}
                      className={cn('w-[122px] text-center font-mono text-[15px] font-medium', i === idx ? 'text-primary' : 'text-roast')}
                    >
                      {gr.count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[18px] rounded-card bg-white p-8 lg:w-[420px] lg:shrink-0">
            <Badge variant="grade">{g.id}</Badge>
            <h3 className="font-display text-[32px] font-semibold">{g.name}</h3>
            <p className="min-h-[52px] leading-[1.6]">{g.body}</p>
            <dl className="w-full">
              {stats.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-line py-2.5 text-sm">
                  <dt className="font-medium text-muted-foreground">{k}</dt>
                  <dd className="text-right font-mono">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link to="/grades">Find your grade</Link>
              </Button>
              {SOLD_ONLINE(g.id) ? (
                <Link to={`/shop?grade=${g.id}`} className="text-sm font-bold underline">
                  Shop {g.id}
                </Link>
              ) : (
                <Link to="/wholesale" className="text-sm font-bold underline">
                  Ask about wholesale
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

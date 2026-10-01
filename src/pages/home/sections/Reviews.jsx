import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/shared/Icon'
import { SITE } from '@/data/site'

const BARS = [
  ['5★', 82],
  ['4★', 12],
  ['3★', 4],
  ['2★', 1],
  ['1★', 1],
]
const REVIEWS = [
  { text: '“Every nut was whole — not a single broken piece in the tin. My mother noticed before I did.”', name: 'Priya R., Coimbatore', item: 'W240 Classic Plain · 500 g' },
  { text: '“The Chettinad Masala tastes like home. Ordered three more for Deepavali.”', name: 'Karthik S., Chennai', item: 'Chettinad Masala · 250 g' },
  { text: '“Roast date on the tin is such a small thing, but it’s why I trust them.”', name: 'Meena V., Bengaluru', item: 'W180 King · 1 kg' },
]
const UGC = ['honey-glazed.png', 'step-05.png', 'chettinad.png', 'bowl-wood.png', 'step-01.png', 'roasted-salted.png']

export function Reviews() {
  return (
    <section className="py-24">
      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex shrink-0 flex-col gap-2 rounded-card bg-white p-8">
            <p className="font-display text-[72px] font-semibold leading-none">4.8</p>
            <p className="text-xl text-gold" aria-label="4.8 out of 5 stars">
              ★★★★★
            </p>
            <p className="text-[13px] font-medium text-muted-foreground">2,400+ verified reviews</p>
            {BARS.map(([label, pct]) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="w-5 font-mono text-xs">{label}</span>
                <span className="h-1.5 w-[180px] overflow-hidden rounded-[3px] bg-line">
                  <span className="block h-full rounded-[3px] bg-gold" style={{ width: `${Math.max(pct, 2)}%` }} />
                </span>
              </div>
            ))}
          </div>

          <div className="no-scrollbar -mx-4 flex flex-1 snap-x gap-5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {REVIEWS.map((r) => (
              <article
                key={r.name}
                className="flex w-[300px] shrink-0 snap-start flex-col gap-3.5 rounded-card border border-line bg-white p-6 lg:w-auto lg:flex-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gold">★★★★★</span>
                  <Badge variant="success">Verified buyer</Badge>
                </div>
                <p className="leading-[1.55]">{r.text}</p>
                <div className="mt-auto flex items-center gap-3">
                  <Icon name="avatar" size={40} />
                  <div>
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{r.item}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Icon name="ig" />
            <h3 className="font-display text-xl font-semibold md:text-2xl">Your cashew moments · @duraicashew</h3>
          </div>
          <a href={SITE.social.instagram} target="_blank" rel="noreferrer" className="text-sm font-bold underline">
            Tag us to be featured →
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
          {UGC.map((src, i) => (
            <img key={i} src={`/assets/images/${src}`} alt="" className="h-[120px] w-full rounded-2xl object-cover md:h-[200px]" />
          ))}
        </div>
      </div>
    </section>
  )
}

import { SectionHeading } from '@/components/shared/SectionHeading'
import { cn } from '@/lib/utils'

// Taste meters show on hover (Figma shows Chettinad's as the example). Values are [confirm].
const FLAVOURS = [
  { name: 'Classic Plain', note: 'Creamy, milky, raw', bg: 'bg-flavour-plain', dark: true, meters: [0, 0, 1] },
  { name: 'Roasted & Salted', note: 'Toasty, sea salt', bg: 'bg-flavour-roasted', meters: [0, 3, 0] },
  { name: 'Pepper & Salt', note: 'Tellicherry pepper', bg: 'bg-flavour-pepper', meters: [2, 3, 0] },
  { name: 'Chilli Garlic', note: 'Heat, then garlic', bg: 'bg-flavour-chilli', meters: [4, 2, 0] },
  { name: 'Honey Glazed', note: 'Sweet, crackly', bg: 'bg-flavour-honey', dark: true, meters: [0, 1, 4] },
  { name: 'Chettinad Masala', note: 'Kalpasi, star anise', bg: 'bg-flavour-chettinad', meters: [3, 2, 1] },
  { name: 'Mint & Lime', note: 'Fresh, zesty', bg: 'bg-flavour-mint', meters: [1, 2, 1] },
]
const METER_LABELS = ['Heat', 'Salt', 'Sweet']

export function FlavourWall() {
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-24">
      <SectionHeading
        eyebrow="FLAVOUR WALL"
        title="Learn our flavours by colour"
        lede="Every pack, card and filter uses the same colour, so you can spot your favourite from across the room."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {FLAVOURS.map((f) => (
          <div
            key={f.name}
            tabIndex={0}
            className={cn(
              'group flex h-[200px] flex-col justify-end gap-1.5 rounded-card p-5 outline-none md:h-[260px]',
              f.bg,
              f.dark ? 'text-roast' : 'text-ivory'
            )}
          >
            <div className="mb-auto hidden flex-col gap-2 rounded-xl bg-black/20 p-3 group-hover:flex group-focus:flex">
              {METER_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-11 font-mono text-[11px] text-ivory">{label}</span>
                  {[0, 1, 2, 3, 4].map((d) => (
                    <span key={d} className={cn('size-2 rounded-full', d < f.meters[i] ? 'bg-ivory' : 'bg-ivory/35')} />
                  ))}
                </div>
              ))}
            </div>
            <p className="font-display text-xl font-semibold leading-[1.15]">{f.name}</p>
            <p className="text-xs">{f.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

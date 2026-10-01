import { useRef, useState } from 'react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { cn } from '@/lib/utils'

const STEPS = [
  { title: 'Orchard', body: 'Cashew apples ripen on family farms across Tamil Nadu.', img: 'step-01.png' },
  { title: 'Harvest', body: 'Nuts are hand-picked once the apple falls.', img: 'step-02.png' },
  { title: 'Drying', body: 'Sun-dried on open yards for three days.', img: 'step-03.png' },
  { title: 'Shelling', body: 'Steam-cut so the kernel stays whole.', img: 'step-04.png' },
  { title: 'Grading', body: 'Sorted by hand into W180 to splits.', img: 'step-05.png' },
  { title: 'Roasting & packing', body: 'Small-batch roast, dated tin, sealed.', img: 'factory.png' },
]

export function TreeToTin() {
  const [active, setActive] = useState(0)
  const track = useRef(null)

  const onScroll = () => {
    const el = track.current
    if (!el) return
    setActive(Math.min(STEPS.length - 1, Math.round(el.scrollLeft / 280)))
  }

  return (
    <section className="py-24">
      <div className="page-x mx-auto flex max-w-[1440px] items-end justify-between gap-4">
        <SectionHeading
          eyebrow="FROM TREE TO TIN"
          title="Six steps, all under one roof"
          lede="Scroll sideways. Each step is a short muted video loop."
        />
        <p className="shrink-0 font-mono text-[13px] text-muted-foreground">
          Step {active + 1} of {STEPS.length}
        </p>
      </div>

      <div className="mx-auto max-w-[1440px]">
        <div ref={track} onScroll={onScroll} className="page-x no-scrollbar mt-10 flex scroll-px-4 snap-x gap-5 overflow-x-auto md:scroll-px-10 xl:scroll-px-20">
          {STEPS.map((s, i) => (
            <article key={s.title} className="flex w-[260px] shrink-0 snap-start flex-col gap-3.5">
              <img src={`/assets/images/${s.img}`} alt="" className="h-[300px] w-[260px] rounded-card bg-white object-cover" />
              <div className="flex items-center gap-2.5">
                <span className={cn('font-mono text-[13px]', i === active ? 'text-primary' : 'text-muted-foreground')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[22px] font-semibold">{s.title}</h3>
              </div>
              <p className="w-[250px] text-sm leading-normal">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

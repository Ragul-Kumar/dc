import { Button } from '@/components/ui/button'

const STATS = [
  ['[120]', 'women employed'],
  ['[300]', 'farming families'],
  ['[1998]', 'grading since'],
]

export function People() {
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-24 lg:flex-row lg:items-center lg:gap-[72px]">
      <div className="aspect-[520/600] w-full max-w-[520px] shrink-0 overflow-hidden rounded-media bg-sand">
        <img src="/assets/images/founder.png" alt="A grader sorting cashews by hand" className="size-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col items-start gap-7">
        <p className="eyebrow">THE PEOPLE BEHIND DURAI</p>
        <blockquote className="max-w-[620px] font-display text-[26px] leading-[1.3] md:text-[34px]">
          “My grandmother could tell a W210 from a W240 by touch. We still grade the same way — by hand, one tray at a
          time.”
        </blockquote>
        <p className="text-[15px] font-medium text-muted-foreground">
          — [Founder name, confirm], second-generation cashew grader
        </p>
        <div className="flex w-full flex-wrap gap-10 border-t border-line pt-6">
          {STATS.map(([n, l]) => (
            <div key={l} className="flex flex-col gap-1">
              <p className="font-display text-h2 font-semibold leading-none">{n}</p>
              <p className="text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
        <Button variant="secondary">Read our story</Button>
      </div>
    </section>
  )
}

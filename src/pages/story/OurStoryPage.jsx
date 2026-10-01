import { Icon } from '@/components/shared/Icon'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { cn } from '@/lib/utils'

// Figma 11 · Our story (39:6866). Names, years and places marked [confirm] are placeholders in the design.
const MILESTONES = [
  ['1998', 'First grading shed', 'Four women, one table, hand-grading for local traders.'],
  ['2006', 'Own roaster', 'Small-batch roasting begins.'],
  ['2014', 'Export grade', 'First W240 lot shipped overseas.'],
  ['2021', 'Women-led floor', 'Grading team grows past 100.'],
  ['2026', 'Durai Cashew', 'Our own brand, direct to you.', true],
]
const LOCATIONS = [
  ['Farms', 'Panruti · Ariyalur · Pudukkottai'],
  ['Processing unit', 'Our own unit, Tamil Nadu'],
  ['Dispatch', 'Pan-India from Chennai hub'],
]
const PEOPLE = [
  ['Selvi', 'Head grader · 22 years', 'step-02.png'],
  ['Murugan', 'Roast master · 15 years', 'step-03.png'],
  ['Kamala', 'Quality lead · 11 years', 'step-01.png'],
  ['Team 3', 'Grading floor · 40 women', 'step-05.png'],
]
const PILLARS = [
  ['01', 'Only cashew', 'Depth over range. We know every grade.'],
  ['02', 'Whole and graded', 'Size and grade are shown, not hidden.'],
  ['03', 'Freshly roasted', 'Small-batch roasting with a packed-on date.'],
  ['04', 'Rooted in Tamil Nadu', 'Local craft, women-led processing, honest sourcing.'],
]

// Map pins: [image, inset, label, label inset, label style]
const PINS = [
  ['map-chennai', '20% 26.92% 77.14% 70%', 'Chennai', '19.64% 14.81% 77.32% 74.62%', 'text-sm'],
  ['map-panruti', '40% 30.19% 56.07% 65.58%', 'Panruti', '40.36% 19.23% 56.61% 71.15%', 'text-sm font-bold text-primary'],
  ['map-city', '46.96% 40.96% 50.54% 56.35%', 'Ariyalur', '46.79% 52.5% 50.36% 38.46%', 'text-[13px]'],
  ['map-city', '63.04% 37.12% 34.46% 60.19%', 'Pudukkottai', '62.86% 21.54% 34.29% 64.42%', 'text-[13px]'],
  ['map-madurai', '75.71% 53.65% 22.14% 44.04%', 'Madurai', '75.36% 59.62% 21.79% 30.77%', 'text-[13px]'],
]

export default function OurStoryPage() {
  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-10 pb-16 pt-12 lg:flex-row lg:gap-[72px] lg:pb-[88px] lg:pt-[72px]">
        <div className="aspect-[520/640] w-full max-w-[520px] shrink-0 overflow-hidden rounded-media bg-white">
          <img src="/assets/images/founder.png" alt="Portrait of a grader at work" className="size-full object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
          <p className="eyebrow">OUR STORY</p>
          <h1 className="max-w-[620px] font-display text-[36px] leading-[1.15] md:text-[52px]">
            “We only do one thing. <em>So we do it properly.”</em>
          </h1>
          <p className="max-w-[560px] text-body-l">
            Durai means master. Our family has graded cashews in Tamil Nadu for more than two decades — first for
            other brands, now under our own name.
          </p>
          <p className="text-[15px] font-bold text-muted-foreground">— The founding family</p>
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="MILESTONES" title="How we got here" />
        <ol className="grid gap-8 md:grid-cols-5 md:gap-0">
          {MILESTONES.map(([year, title, body, now]) => (
            <li key={title} className="flex flex-col gap-3 md:pr-4">
              <div className="flex items-center">
                <Icon name={now ? 'tl-dot-now' : 'tl-dot'} size={16} />
                {!now && <span className="hidden h-0.5 flex-1 bg-line md:block" />}
              </div>
              <p className="font-mono text-[15px] font-medium text-muted-foreground">{year}</p>
              <h3 className="font-display text-[22px] font-semibold">{title}</h3>
              <p className="max-w-[220px] text-sm leading-normal">{body}</p>
            </li>
          ))}
        </ol>
        
      </section>

      <section className="bg-sand">
        <div className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-10 py-[88px] lg:flex-row lg:gap-16">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <SectionHeading
              eyebrow="ROOTS"
              title="Where our cashews come from"
              lede="Grown by partner farms in the Panruti and Ariyalur belt, processed and packed at our own unit. Every tin can be traced back to its farm cluster."
              className="mb-2"
            />
            {LOCATIONS.map(([title, place]) => (
              <div key={title} className="flex items-center gap-3">
                <Icon name="pin-20" size={20} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-[15px] font-bold">{title}</p>
                  <p className="text-sm text-muted-foreground">{place}</p>
                </div>
              </div>
            ))}
          </div>

          <div role="img" aria-label="Illustrated map of Tamil Nadu" className="relative h-[420px] w-full max-w-[390px] shrink-0 md:h-[560px] md:max-w-[520px]">
            <img src="/assets/icons/map-tn.svg" alt="" className="absolute max-w-none" style={insetStyle('3.57% 17.31% 2.68% 21.15%')} />
            {PINS.map(([icon, inset, label, labelInset, cls]) => (
              <span key={label}>
                <img src={`/assets/icons/${icon}.svg`} alt="" className="absolute max-w-none" style={insetStyle(inset)} />
                <span className={cn('absolute whitespace-nowrap text-roast', cls)} style={insetStyle(labelInset, true)}>
                  {label}
                </span>
              </span>
            ))}
            <span className="absolute whitespace-nowrap font-display text-base italic text-muted-foreground" style={insetStyle('88.21% 47.12% 8.39% 36.54%', true)}>
              Tamil Nadu
            </span>
          </div>
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="THE PEOPLE" title="The hands behind every tin" />
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {PEOPLE.map(([name, role, img]) => (
            <figure key={name} className="flex flex-col gap-3">
              <img src={`/assets/images/${img}`} alt="" className="h-[240px] w-full rounded-card object-cover md:h-[340px]" />
              <figcaption className="flex flex-col gap-3">
                <span className="font-display text-[22px] font-semibold">{name}</span>
                <span className="font-mono text-[13px] font-medium text-muted-foreground">{role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <SectionHeading eyebrow="WHAT WE STAND FOR" title="Four pillars" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(([n, title, body]) => (
            <div key={n} className="flex flex-col gap-3 rounded-card bg-white p-7">
              <p className="font-mono text-sm font-medium text-gold">{n}</p>
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              <p className="max-w-[240px] text-[15px] leading-[1.55]">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

// "T R B L" percentages from Figma's inset shorthand → absolute left/top/width/height
function insetStyle(inset, label = false) {
  const [t, r, b, l] = inset.split(' ').map(parseFloat)
  return label
    ? { left: `${l}%`, top: `${t}%` }
    : { left: `${l}%`, top: `${t}%`, width: `${100 - l - r}%`, height: `${100 - t - b}%` }
}

import { SectionHeading } from '@/components/shared/SectionHeading'

const ARTICLES = [
  { tag: 'RECIPE · 12 MIN', title: 'Kaju masala in 20 minutes, with W320', img: 'factory.png' },
  { tag: 'GRADE GUIDE · 6 MIN', title: 'W180 vs W240: is bigger worth it?', img: 'bowl-wood.png' },
  { tag: 'BEHIND THE SCENES · 4 MIN', title: 'A day on the grading floor', img: 'step-05.png' },
]

export function JournalTeaser() {
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="CASHEW JOURNAL" title="Recipes, grade guides and stories" />
        <a href="#" className="text-sm font-bold underline">
          Read the Journal →
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {ARTICLES.map((a) => (
          <a key={a.title} href="#" className="group flex flex-col gap-3.5">
            <div className="h-[260px] overflow-hidden rounded-card">
              <img
                src={`/assets/images/${a.img}`}
                alt=""
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-muted-foreground">{a.tag}</p>
            <h3 className="max-w-[400px] font-display text-2xl font-semibold leading-tight group-hover:underline">
              {a.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  )
}

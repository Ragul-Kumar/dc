import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { ARTICLES, CATEGORIES, FEATURED } from '@/data/journal'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 6

export const ArticleCard = ({ a }) => (
  <Link to={`/journal/${a.slug}`} className="group flex flex-col gap-3">
    <img src={a.img} alt="" className="h-[240px] w-full rounded-card object-cover transition-transform duration-300 group-hover:scale-[1.01]" />
    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
      {a.category} · {a.mins} min
    </p>
    <h3 className="max-w-[380px] font-display text-[22px] font-semibold leading-[1.2] group-hover:underline">{a.title}</h3>
  </Link>
)

// Figma 13 · Cashew Journal (39:7253)
export default function JournalPage() {
  const [tab, setTab] = useState('All')
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE_SIZE)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const list = ARTICLES.filter(
    (a) => (tab === 'All' || a.category === tab) && a.title.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col items-start gap-4 pb-8 pt-12 lg:pt-16">
        <h1 className="font-display text-[48px] leading-none md:text-display-xl">Cashew Journal</h1>
        <p className="text-body-l">Recipes, grade guides, health notes and stories from the grading floor.</p>
        <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto" role="tablist" aria-label="Categories">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={tab === c}
              onClick={() => {
                setTab(c)
                setShown(PAGE_SIZE)
              }}
              className={cn(
                'shrink-0 rounded-full border px-[18px] py-2.5 text-sm font-bold transition-colors',
                tab === c ? 'border-roast bg-roast text-ivory' : 'border-line bg-white hover:border-roast'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-8 pb-16 pt-6 lg:flex-row lg:gap-12">
        <Link to={`/journal/${FEATURED.slug}`} className="h-[300px] w-full shrink-0 overflow-hidden rounded-media bg-white md:h-[480px] lg:w-[760px]">
          <img src={FEATURED.img} alt="" className="size-full object-cover" />
        </Link>
        <div className="flex flex-1 flex-col items-start gap-4">
          <p className="eyebrow">
            FEATURED · {FEATURED.category} · {FEATURED.mins} MIN
          </p>
          <h2 className="max-w-[460px] font-display text-[32px] font-semibold leading-[1.12] md:text-[44px]">{FEATURED.title}</h2>
          <p className="max-w-[440px] text-[17px] leading-[1.6]">{FEATURED.blurb}</p>
          <Button asChild variant="secondary">
            <Link to={`/journal/${FEATURED.slug}`}>Read the story</Link>
          </Button>
        </div>
      </section>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-8 py-[88px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-[32px] font-semibold">Latest</h2>
          <label className="flex items-center gap-2 rounded-full border border-line py-2.5 pl-3.5 pr-4">
            <Icon name="search-16" size={16} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShown(PAGE_SIZE)
              }}
              placeholder="Search the Journal"
              aria-label="Search the Journal"
              className="w-44 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </label>
        </div>

        {list.length > 0 ? (
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.slice(0, shown).map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-line bg-white p-6 text-center text-muted-foreground">No stories match yet.</p>
        )}

        <div className="flex justify-center">
          <Button variant="secondary" disabled={list.length <= shown} onClick={() => setShown((n) => n + PAGE_SIZE)}>
            {list.length > shown ? 'Load more stories' : 'You’re all caught up'}
          </Button>
        </div>
      </section>

      <section className="bg-sand">
        <div className="page-x mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <p className="font-display text-[28px] font-semibold md:text-[32px]">Two stories a month, no spam.</p>
            <p className="text-base">Recipes and grade guides straight to your inbox.</p>
          </div>
          <form
            className="flex w-full flex-col gap-2.5 sm:flex-row md:w-auto"
            onSubmit={(e) => {
              e.preventDefault()
              if (email.includes('@')) setDone(true)
            }}
          >
            {done ? (
              <p role="status" className="font-medium">
                Nandri! Check your inbox to confirm.
              </p>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email address"
                  className="h-[52px] w-full rounded-input bg-white px-4 text-[15px] placeholder:text-muted-foreground focus:outline-none sm:w-80"
                />
                <Button type="submit">Subscribe</Button>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

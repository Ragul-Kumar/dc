import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { ARTICLES, getArticle } from '@/data/journal'
import { inr, perHundred } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'
import { ArticleCard } from './JournalPage'

const KAJU = 'kaju-masala-20-minutes'
const SECTIONS = [
  ['why-w320', 'Why W320'],
  ['soaking', 'Soaking vs boiling'],
  ['recipe', 'Recipe card'],
  ['serving', 'Serving'],
]
const INGREDIENTS = [
  '150 g W320 cashews, soaked 10 min',
  '2 onions, 2 tomatoes, puréed',
  '1 tsp each ginger & garlic paste',
  '1 tsp Kashmiri chilli, ½ tsp garam masala',
  '3 tbsp cream, salt, coriander',
]
const METHOD = [
  'Sauté onion purée till golden.',
  'Add pastes, tomato and spices; cook 6 min.',
  'Blend a quarter of the cashews into the gravy.',
  'Fold in whole cashews and cream; simmer 3 min.',
]

// Figma 14 · Journal article (39:7325). Author and sidebar anchors are placeholders [confirm].
export default function JournalArticlePage() {
  const { slug } = useParams()
  const article = getArticle(slug)
  const { add } = useCart()
  const [active, setActive] = useState(SECTIONS[0][0])

  // highlight the section being read in "In this article"
  useEffect(() => {
    if (slug !== KAJU || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: '-30% 0px -60% 0px',
    })
    SECTIONS.forEach(([id]) => document.getElementById(id) && io.observe(document.getElementById(id)))
    return () => io.disconnect()
  }, [slug])

  const [shareMsg, setShareMsg] = useState('')

  if (!article) return <Navigate to="/journal" replace />
  const full = slug === KAJU

  const flash = (m) => {
    setShareMsg(m)
    setTimeout(() => setShareMsg(''), 2000)
  }
  const share = {
    share: async () => {
      try {
        if (navigator.share) await navigator.share({ title: article.title, url: window.location.href })
        else {
          await navigator.clipboard.writeText(window.location.href)
          flash('Link copied')
        }
      } catch {
        /* the share sheet was dismissed */
      }
    },
    link: async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        flash('Link copied')
      } catch {
        flash('Copy failed')
      }
    },
    'wa-share': () => window.open(`https://wa.me/?text=${encodeURIComponent(`${article.title} — ${window.location.href}`)}`, '_blank', 'noopener'),
  }
  // same category first, then the rest, never the story you are reading
  const related = [...ARTICLES.filter((a) => a.category === article.category), ...ARTICLES].filter((a, i, all) => a.slug !== slug && all.indexOf(a) === i).slice(0, 3)

  return (
    <>
      <header className="page-x mx-auto flex max-w-[1440px] flex-col items-start gap-[18px] pb-10 pt-12 lg:pt-16">
        <nav aria-label="Breadcrumb" className="whitespace-pre text-[13px] font-medium text-muted-foreground">
          <Link to="/journal" className="hover:text-roast">
            Journal
          </Link>
          {`  /  ${article.category}`}
        </nav>
        <h1 className="max-w-[900px] font-display text-[36px] font-semibold leading-[1.1] md:text-[56px]">{article.title}</h1>
        <p className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-medium">By the Durai Cashew team</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-mono text-[13px] text-muted-foreground">{article.mins} min read</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-mono text-[13px] text-muted-foreground">{article.date}</span>
        </p>
      </header>

      <div className="page-x mx-auto max-w-[1440px] pb-12">
        <img src={article.img} alt="" className="h-[280px] w-full rounded-media object-cover md:h-[560px]" />
      </div>

      <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 pb-20 lg:flex-row lg:gap-16">
        <div className="flex gap-3 lg:flex-col" aria-label="Share">
          {['share', 'link', 'wa-share'].map((i) => (
            <button key={i} type="button" onClick={share[i]} aria-label={i === 'wa-share' ? 'Share on WhatsApp' : i === 'link' ? 'Copy link' : 'Share'} className="h-fit rounded-full border border-line p-2.5 hover:border-roast">
              <Icon name={i} size={18} />
            </button>
          ))}
          {shareMsg && (
            <p role="status" className="text-xs font-bold text-success">
              {shareMsg}
            </p>
          )}
        </div>

        <article className="flex w-full max-w-[720px] flex-col gap-6 text-[18px] leading-[1.7]">
          {full ? (
            <>
              <p id="why-w320" className="scroll-mt-28">
                Kaju masala is the dish people assume takes all afternoon. It doesn’t. The trick is soaking W320 cashews for ten
                minutes, so they turn creamy in the gravy without falling apart.
              </p>
              <p>
                W320 is our everyday whole grade — smaller than W240, which means more nuts per spoonful and a gentler price for
                cooking.
              </p>
              <blockquote id="soaking" className="scroll-mt-28 border-l-[3px] border-gold py-2 pl-7">
                <p className="font-display text-[26px] italic leading-[1.3] md:text-[30px]">
                  “Soak, don’t boil. Boiled cashews go soft; soaked ones stay whole.”
                </p>
                <footer className="mt-2 text-sm font-medium text-muted-foreground">— Selvi, head grader</footer>
              </blockquote>

              <div className="flex flex-wrap items-center gap-5 rounded-card bg-sand p-4 text-base leading-normal">
                <div className="flex size-[110px] shrink-0 items-center justify-center rounded-[14px] bg-white">
                  <img src="/assets/images/w240-plain.png" alt="" className="size-[90px] object-contain" />
                </div>
                <div className="flex min-w-[160px] flex-1 flex-col gap-1">
                  <p className="text-[11px] font-bold tracking-[0.12em] text-muted-foreground">USED IN THIS RECIPE</p>
                  <p className="text-lg font-bold">W320 Everyday · 500 g</p>
                  <p className="font-mono text-[13px] font-medium">
                    {inr(449)} · {perHundred(449, 500)}
                  </p>
                </div>
                <Button onClick={() => add('w320-everyday', 500)}>Add to cart</Button>
              </div>

              <section id="recipe" className="scroll-mt-28 flex flex-col gap-[18px] rounded-card border border-line bg-white p-6 text-base leading-normal md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-[28px] font-semibold">Recipe card</h2>
                  <p className="font-mono text-[13px] text-muted-foreground">Serves 4 · 20 min</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-xs font-bold tracking-[0.12em]">INGREDIENTS</h3>
                    {INGREDIENTS.map((i) => (
                      <p key={i} className="flex items-center gap-2.5 text-[15px]">
                        <Icon name="bullet" size={6} />
                        {i}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-xs font-bold tracking-[0.12em]">METHOD</h3>
                    {METHOD.map((m, i) => (
                      <p key={m} className="text-[15px] leading-normal">
                        {i + 1}.&nbsp; {m}
                      </p>
                    ))}
                  </div>
                </div>
              </section>

              <p id="serving" className="scroll-mt-28">
                Serve with phulkas or jeera rice. Leftovers keep for two days in the fridge — the cashews will soften a little,
                which some people prefer.
              </p>
            </>
          ) : (
            <>
              {article.body.slice(0, 2).map((p) => (
                <p key={p}>{p}</p>
              ))}
              {article.quote && (
                <blockquote className="border-l-[3px] border-gold py-2 pl-7">
                  <p className="font-display text-[26px] italic leading-[1.3] md:text-[30px]">{article.quote[0]}</p>
                  <footer className="mt-2 text-sm font-medium text-muted-foreground">— {article.quote[1]}</footer>
                </blockquote>
              )}
              {article.body.slice(2).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </>
          )}
        </article>

        {full && (
          <aside className="hidden flex-1 lg:block">
            <nav aria-label="In this article" className="sticky top-28 flex flex-col gap-4">
              <p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">IN THIS ARTICLE</p>
              {SECTIONS.map(([id, label]) => (
                <a key={id} href={`#${id}`} className={cn('text-[15px]', active === id ? 'font-bold text-primary' : 'hover:underline')}>
                  {label}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>

      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-[88px]">
        <h2 className="font-display text-[32px] font-semibold">Keep reading</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
      </section>
    </>
  )
}

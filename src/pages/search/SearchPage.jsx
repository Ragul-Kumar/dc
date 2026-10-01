import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '@/components/shared/ProductCard'
import { searchSite } from '@/lib/search'

// /search?q= — products, journal stories, help answers and pages in one list
export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const r = searchSite(q)
  const total = r.products.length + r.stories.length + r.faqs.length + r.pages.length

  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-16">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-[36px] font-semibold md:text-h1">Search</h1>
        <input
          value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          placeholder="Search cashews, gifts, recipes, help…"
          aria-label="Search the site"
          className="h-14 w-full max-w-[640px] rounded-full border border-line bg-white px-6 text-base focus-visible:border-roast focus-visible:outline-none"
        />
        {q.trim() && (
          <p className="text-sm text-muted-foreground">
            {total} result{total === 1 ? '' : 's'} for “{q.trim()}”
          </p>
        )}
      </div>

      {q.trim() && total === 0 && (
        <p className="max-w-[560px] rounded-card border border-line bg-white p-6">
          Nothing matches “{q.trim()}”. Try a grade like W240, a flavour, or{' '}
          <Link to="/contact" className="font-bold underline">
            ask us
          </Link>
          .
        </p>
      )}

      {r.products.length > 0 && (
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-[26px] font-semibold">Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {r.products.map((p) => (
              <ProductCard key={p.id} product={p} listing />
            ))}
          </div>
        </div>
      )}

      {r.stories.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-[26px] font-semibold">Journal</h2>
          {r.stories.map((a) => (
            <Link key={a.slug} to={`/journal/${a.slug}`} className="rounded-xl border border-line bg-white p-4 hover:border-roast">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{a.category}</span>
              <span className="block font-display text-xl font-semibold">{a.title}</span>
            </Link>
          ))}
        </div>
      )}

      {r.faqs.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-[26px] font-semibold">Help</h2>
          {r.faqs.map((f) => (
            <Link key={f.q} to="/faq" className="rounded-xl border border-line bg-white p-4 hover:border-roast">
              <span className="block text-[15px] font-bold">{f.q}</span>
              <span className="block text-sm text-muted-foreground">{f.a}</span>
            </Link>
          ))}
        </div>
      )}

      {r.pages.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-[26px] font-semibold">Pages</h2>
          <div className="flex flex-wrap gap-2">
            {r.pages.map((p) => (
              <Link key={p.to} to={p.to} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold hover:border-roast">
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

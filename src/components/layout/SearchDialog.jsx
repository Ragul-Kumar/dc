import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Icon } from '@/components/shared/Icon'
import { searchSite } from '@/lib/search'
import { inr } from '@/lib/format'
import { defaultSize } from '@/data/products'

const SUGGESTIONS = ['W240', 'Chettinad', 'Gift box', 'Delivery time', 'Kaju katli']

// Header search: live product matches; Enter opens the full results page
export function SearchDialog({ open, onOpenChange }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const results = searchSite(q)

  useEffect(() => {
    if (!open) setQ('')
  }, [open])

  const go = (term = q) => {
    if (!term.trim()) return
    onOpenChange(false)
    navigate(`/search?q=${encodeURIComponent(term.trim())}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12%] max-w-[560px] translate-y-0 gap-0 p-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search products, stories and help</DialogDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            go()
          }}
          className="flex items-center gap-3 border-b border-line px-5 py-4"
        >
          <Icon name="search-20" size={20} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search cashews, gifts, recipes, help…"
            aria-label="Search the site"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </form>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!q.trim() ? (
            <div className="flex flex-wrap gap-2 p-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => go(s)} className="rounded-full border border-line px-3.5 py-2 text-sm font-medium hover:border-roast">
                  {s}
                </button>
              ))}
            </div>
          ) : (
            <>
              {results.products.slice(0, 5).map((p) => (
                <Link key={p.id} to={`/shop/${p.id}`} onClick={() => onOpenChange(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-sand/60">
                  <img src={p.image} alt="" className="size-12 rounded-lg bg-sand object-contain" />
                  <span className="flex-1 text-sm font-bold">{p.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">from {inr(defaultSize(p).price)}</span>
                </Link>
              ))}
              {results.pages.slice(0, 3).map((p) => (
                <Link key={p.to} to={p.to} onClick={() => onOpenChange(false)} className="block rounded-xl p-2.5 text-sm font-medium hover:bg-sand/60">
                  {p.title} →
                </Link>
              ))}
              <button type="button" onClick={() => go()} className="mt-1 w-full rounded-xl p-2.5 text-left text-sm font-bold text-primary hover:bg-sand/60">
                See all results for “{q.trim()}”
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

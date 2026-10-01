import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProduct } from '@/data/products'
import { MAX_COMPARE, useCompare } from '@/context/CompareContext'

// Tray shown while 1+ products are ticked "Compare" on the shop page
export function CompareBar() {
  const { ids, toggle, clear } = useCompare()
  const { pathname } = useLocation()
  if (!ids.length || pathname === '/compare') return null

  const ready = ids.length >= 2
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white shadow-[0_-4px_16px_rgba(58,35,23,0.08)]">
      <div className="page-x mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-bold">
            Compare{' '}
            <span className="font-mono text-muted-foreground">
              ({ids.length}/{MAX_COMPARE})
            </span>
          </p>
          {ids.map((id) => {
            const p = getProduct(id)
            return (
              <span key={id} className="flex items-center gap-2 rounded-full bg-sand py-1 pl-1 pr-2.5 text-[13px] font-medium">
                <img src={p.image} alt="" className="size-7 rounded-full bg-white object-contain" />
                {p.name}
                <button type="button" aria-label={`Remove ${p.name}`} onClick={() => toggle(id)}>
                  <X className="size-3.5" />
                </button>
              </span>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={clear} className="text-sm font-bold underline">
            Clear
          </button>
          {ready ? (
            <Button asChild size="sm">
              <Link to="/compare">Compare now</Link>
            </Button>
          ) : (
            <Button size="sm" disabled>
              Pick one more
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

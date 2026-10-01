import { Fragment, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Icon } from '@/components/shared/Icon'
import { ProductCard } from '@/components/shared/ProductCard'
import { BESTSELLERS, SHOP_PRODUCTS } from '@/data/products'
import { MAX_COMPARE, useCompare } from '@/context/CompareContext'
import { cn } from '@/lib/utils'
import { FilterDropdown } from './FilterDropdown'
import { FILTER_GROUPS, SORTS, applyFilters, readSelection } from './filters'

// Figma 03 · Shop all (39:4993)
export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [sheetOpen, setSheetOpen] = useState(false)
  const { ids: compare, toggle: toggleCompare } = useCompare()

  const selection = readSelection(params)
  const sort = params.get('sort') ?? SORTS[0].value
  const results = useMemo(() => applyFilters(selection, sort), [params]) // eslint-disable-line react-hooks/exhaustive-deps

  const chips = FILTER_GROUPS.flatMap((g) =>
    selection[g.key].map((v) => ({ group: g.key, value: v, label: g.options.find((o) => o.value === v)?.label ?? v }))
  )

  const update = (mutate) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        mutate(next)
        return next
      },
      { replace: true }
    )

  const toggle = (key, value) =>
    update((next) => {
      const set = new Set(next.get(key)?.split(',').filter(Boolean))
      set.has(value) ? set.delete(value) : set.add(value)
      set.size ? next.set(key, [...set].join(',')) : next.delete(key)
    })
  const clearAll = () =>
    update((next) => FILTER_GROUPS.forEach((g) => next.delete(g.key)))
  const setSort = (value) =>
    update((next) => (value === SORTS[0].value ? next.delete('sort') : next.set('sort', value)))

  // The grade-guide editorial tile sits inside the grid after the seventh product (Figma row 3)
  const EDITORIAL_AT = 7
  const cells = results.map((p) => ({ type: 'product', p }))
  if (results.length >= 3) cells.splice(Math.min(EDITORIAL_AT, cells.length), 0, { type: 'editorial' })

  const emptyCopy = (() => {
    const label = (key) => chips.filter((c) => c.group === key).map((c) => c.label)
    const what = [...label('flavour'), ...label('roast'), ...label('diet'), ...label('size'), ...label('price')].join(' ')
    const grade = label('grade').join(' / ')
    if (!what && !grade) return 'No cashews match right now.'
    return `No ${what || 'cashews'}${grade ? ` in ${grade}` : ''} right now.`
  })()

  return (
    <>
      <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-3 pb-8 pt-12">
        <nav aria-label="Breadcrumb" className="whitespace-pre text-[13px] font-medium text-muted-foreground">
          <Link to="/" className="hover:text-roast">
            Home
          </Link>
          {'  /  '}Shop
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h1 className="font-display text-[40px] font-semibold leading-[1.1] md:text-h1">All cashews</h1>
            <p className="max-w-[620px] text-body-l">
              Every grade, roast and flavour we make — graded whole, dated and sold by the pack.
            </p>
          </div>
          <p className="font-mono text-sm font-medium text-muted-foreground">{SHOP_PRODUCTS.length} products</p>
        </div>
      </section>

      <div className="sticky top-[75px] z-30 border-y border-line bg-ivory">
        <div className="page-x mx-auto flex max-w-[1440px] flex-col gap-3.5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2 rounded-full bg-roast px-4 py-2.5 text-sm font-bold text-ivory"
              >
                <Icon name="filter" size={16} />
                Filters
                {chips.length > 0 && <span className="font-mono text-[11px] text-gold">{chips.length}</span>}
              </button>
              <div className="hidden items-start gap-2.5 lg:flex">
                {FILTER_GROUPS.map((g) => (
                  <FilterDropdown key={g.key} group={g} selected={selection[g.key]} onToggle={toggle} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sort:</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger
                  aria-label="Sort products"
                  className="h-auto gap-1.5 rounded-full border-line py-2.5 pl-4 pr-3.5 font-sans text-sm font-bold"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="font-sans text-sm">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            <span>
              Showing {results.length} of {SHOP_PRODUCTS.length}
              {chips.length > 0 && ' ·'}
            </span>
            {chips.map((c) => (
              <button
                key={`${c.group}-${c.value}`}
                type="button"
                onClick={() => toggle(c.group, c.value)}
                aria-label={`Remove filter ${c.label}`}
                className={cn(
                  'flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2.5 font-mono text-xs font-medium',
                  c.group === 'grade' ? 'bg-mint text-leaf' : 'bg-sand text-roast'
                )}
              >
                {c.label}
                <X className="size-3" strokeWidth={2} />
              </button>
            ))}
            {chips.length > 0 && (
              <button type="button" onClick={clearAll} className="font-bold text-primary underline">
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {results.length > 0 ? (
        <section className="page-x mx-auto grid max-w-[1440px] gap-x-6 gap-y-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell) =>
            cell.type === 'editorial' ? (
              <GradeGuideTile key="grade-guide" />
            ) : (
              <div key={cell.p.id} className="flex flex-col gap-2.5">
                <ProductCard product={cell.p} listing />
                <label className="flex cursor-pointer items-center gap-2 px-1.5 text-[13px] font-medium">
                  <Checkbox checked={compare.includes(cell.p.id)} onCheckedChange={() => toggleCompare(cell.p.id)} disabled={!compare.includes(cell.p.id) && compare.length >= MAX_COMPARE} />
                  Compare
                </label>
              </div>
            )
          )}
        </section>
      ) : (
        <section className="page-x mx-auto flex max-w-[1440px] flex-col items-center gap-5 py-[72px] text-center">
          <h2 className="font-display text-h2 font-semibold">Nothing matches — yet.</h2>
          <p className="max-w-[520px] leading-[1.6]">{emptyCopy} Try removing a filter, or start with one of these bestsellers.</p>
          <Button variant="secondary" onClick={clearAll}>
            Clear filters
          </Button>
          <div className="mt-2 grid w-full gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {BESTSELLERS.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} listing />
            ))}
          </div>
        </section>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="gap-0 p-0">
          <div className="border-b border-line px-6 py-6">
            <SheetTitle>All filters</SheetTitle>
            <SheetDescription>
              {results.length} of {SHOP_PRODUCTS.length} products
            </SheetDescription>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {FILTER_GROUPS.map((g) => (
              <Fragment key={g.key}>
                <p className="eyebrow mb-3 mt-5 first:mt-0">{g.label}</p>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((o) => {
                    const on = selection[g.key].includes(o.value)
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(g.key, o.value)}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                          on ? 'border-roast bg-roast text-ivory' : 'border-line bg-white hover:border-roast'
                        )}
                      >
                        {o.label}
                      </button>
                    )
                  })}
                </div>
              </Fragment>
            ))}
          </div>
          <div className="flex gap-3 border-t border-line p-6">
            <Button variant="secondary" className="flex-1" onClick={clearAll} disabled={!chips.length}>
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setSheetOpen(false)}>
              Show {results.length}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

// Figma "Editorial tile · grade guide" (39:5110)
function GradeGuideTile() {
  return (
    <div className="flex min-h-[320px] flex-col justify-end gap-4 self-stretch rounded-card bg-roast p-8">
      <p className="text-label font-bold uppercase tracking-[0.12em] text-gold">Grade guide</p>
      <h2 className="max-w-[330px] font-display text-[30px] font-semibold leading-[1.2] text-ivory">
        W180, W240, W320 — what do the numbers mean?
      </h2>
      <p className="max-w-[330px] text-[15px] leading-[1.55] text-sand">
        Fewer nuts per pound means bigger nuts. Two minutes to find yours.
      </p>
      <Button asChild className="self-start">
        <Link to="/grades">Find your grade</Link>
      </Button>
    </div>
  )
}

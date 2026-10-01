import { Link } from 'react-router-dom'
import { FLAVOURS, SHOP_PRODUCTS, defaultSize } from '@/data/products'
import { inr } from '@/lib/format'

// Shop by flavour (/flavours) — each tile opens the shop filtered to that flavour
export default function FlavoursPage() {
  return (
    <section className="page-x mx-auto flex max-w-[1440px] flex-col gap-10 py-14 lg:py-[88px]">
      <div className="flex flex-col gap-4">
        <p className="eyebrow">SHOP BY FLAVOUR</p>
        <h1 className="font-display text-[40px] font-semibold leading-[1.1] md:text-h1">Seven flavours, one grade of care.</h1>
        <p className="max-w-[620px] text-body-l">Every flavour is roasted in small batches and dated on the tin.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(FLAVOURS).map(([key, f]) => {
          const items = SHOP_PRODUCTS.filter((p) => p.flavour === key)
          const from = items.length ? Math.min(...items.map((p) => defaultSize(p).price)) : null
          return (
            <Link key={key} to={`/shop?flavour=${key}`} className="group flex flex-col gap-3 rounded-card bg-sand p-3">
              <div className="flex h-[200px] items-center justify-center rounded-2xl" style={{ background: f.tint }}>
                <img src={items[0]?.image ?? '/assets/images/w240-plain.png'} alt="" className="h-[85%] object-contain transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-col gap-1 px-2 pb-2">
                <span className="flex items-center gap-2 font-display text-[22px] font-semibold">
                  <span className="size-3 rounded-full border border-line" style={{ background: f.color }} />
                  {f.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {items.length} product{items.length === 1 ? '' : 's'}
                  {from ? ` · from ${inr(from)}` : ''}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
